import type { StudentDecisionInput } from '../contracts/student';
import type { EvaluatedNode, DoorStatus, SourceClaim, RecoveryRoute } from '../contracts/pathway';
import { scoreRoute } from './score-routes';
import { findRecoveryRoute } from './find-recovery-routes';

type DBNode = any; // Will map to Drizzle schema type
type DBEdge = any; 
type DBSource = any;

export function evaluateGraph(
  input: StudentDecisionInput,
  rawNodes: DBNode[],
  rawEdges: DBEdge[],
  rawSources: DBSource[]
): EvaluatedNode[] {
  
  const nodesMap = new Map(rawNodes.map(n => [
    n.id,
    {
      id: n.id,
      nameEn: n.nameEn,
      nameHi: n.nameHi,
      costRange: {
        min: n.costRangeMinINR || 0,
        max: n.costRangeMaxINR || 0,
        type: n.costType || 'both'
      },
      durationMonths: n.durationMonths || 36
    }
  ]));

  const evaluatedNodes: EvaluatedNode[] = rawNodes.map((node) => {
    // Find edges pointing to this node
    const incomingEdges = rawEdges.filter(e => e.toNodeId === node.id);
    
    // Find sources for this node
    const nodeSources: SourceClaim[] = rawSources
      .filter(s => s.nodeOrEdgeId === node.id)
      .map(s => ({
        id: s.id,
        sourceUrl: s.sourceUrl,
        sourceName: s.sourceName,
        claimType: s.claimType,
        claimTextEn: s.claimTextEn,
        claimTextHi: s.claimTextHi,
        verificationStatus: s.verificationStatus,
        lastVerifiedDate: s.lastVerifiedDate,
        confidenceLevel: s.confidenceLevel
      }));

    let status: DoorStatus = 'unverified';
    let reasonEn = 'Data is being verified';
    let reasonHi = 'डेटा का सत्यापन किया जा रहा है';
    let recovery: RecoveryRoute | undefined = undefined;

    // Evaluate based on incoming edges and student input
    // If there are no incoming edges, it's a root node, we'll assume open for now
    if (incomingEdges.length === 0) {
      status = 'open';
      reasonEn = 'Available directly';
      reasonHi = 'सीधे उपलब्ध';
    } else {
      let bestStatus: DoorStatus = 'closed';
      let bestReasonEn = 'You do not meet the requirements.';
      let bestReasonHi = 'आप आवश्यकताओं को पूरा नहीं करते हैं।';

      for (const edge of incomingEdges) {
        // Simplified evaluation logic for MVP
        let edgeStatus: DoorStatus = 'open';
        let edgeReasonEn = 'You meet all requirements.';
        let edgeReasonHi = 'आप सभी आवश्यकताओं को पूरा करते हैं।';

        // Stage check
        if (edge.requiredStage && edge.requiredStage !== 'any' && edge.requiredStage !== input.stage) {
          if (edge.edgeType === 'lateral_entry' || edge.edgeType === 'recovery') {
            edgeStatus = 'harder';
          } else {
            edgeStatus = 'closed';
            edgeReasonEn = `Requires ${edge.requiredStage} stage.`;
            edgeReasonHi = `${edge.requiredStage} स्तर की आवश्यकता है।`;
          }
        }

        // Stream check (simplified)
        if (edgeStatus !== 'closed' && edge.requiredStream && edge.requiredStream !== 'any') {
          const userStream = input.stage === 'graduate' || input.stage === 'dropout' 
            ? input.class12Stream 
            : (input as any).stream; // Assuming UI might pass stream for current class 12
          
          if (userStream && !userStream.includes(edge.requiredStream)) {
            edgeStatus = 'closed';
            edgeReasonEn = `Requires ${edge.requiredStream} stream.`;
            edgeReasonHi = `${edge.requiredStream} स्ट्रीम की आवश्यकता है।`;
          }
        }

        // Maths check
        if (edgeStatus !== 'closed' && edge.requiresMaths) {
          const userStream = input.stage === 'graduate' || input.stage === 'dropout' 
            ? input.class12Stream 
            : (input as any).stream;
            
          if (userStream && !userStream.includes('with_maths')) {
            edgeStatus = 'closed';
            edgeReasonEn = 'Requires Mathematics.';
            edgeReasonHi = 'गणित की आवश्यकता है।';
          }
        }

        // Budget check
        if (edgeStatus !== 'closed' && edge.budgetMax) {
          const budgetLevels = { low: 1, medium: 2, high: 3 };
          const userBudget = budgetLevels[input.budgetBand] || 3;
          const reqBudget = budgetLevels[edge.budgetMax as keyof typeof budgetLevels] || 3;
          
          if (userBudget < reqBudget) {
            edgeStatus = 'harder';
            edgeReasonEn = 'Cost exceeds preferred budget.';
            edgeReasonHi = 'लागत पसंदीदा बजट से अधिक है।';
          }
        }

        if (edge.edgeType === 'lateral_entry' && edgeStatus === 'open') {
          edgeStatus = 'harder';
          edgeReasonEn = 'Available via lateral entry (harder).';
          edgeReasonHi = 'लेटरल एंट्री के माध्यम से उपलब्ध (कठिन)।';
        }

        // Update best status
        if (edgeStatus === 'open') {
          bestStatus = 'open';
          bestReasonEn = edgeReasonEn;
          bestReasonHi = edgeReasonHi;
          break; // Found an open path, no need to check others
        } else if (edgeStatus === 'conditional' && bestStatus !== 'open') {
          bestStatus = 'conditional';
          bestReasonEn = edgeReasonEn;
          bestReasonHi = edgeReasonHi;
        } else if (edgeStatus === 'harder' && (bestStatus === 'closed' || bestStatus === 'reopenable')) {
          bestStatus = 'harder';
          bestReasonEn = edgeReasonEn;
          bestReasonHi = edgeReasonHi;
        } else if (edgeStatus === 'closed' && bestStatus === 'closed') {
          // keep evaluating
        }
      }

      status = bestStatus;
      reasonEn = bestReasonEn;
      reasonHi = bestReasonHi;
    }

    // Attempt to find recovery route if closed
    if (status === 'closed') {
      recovery = findRecoveryRoute(node.id, input.stage, rawEdges, nodesMap, input.budgetBand);
      if (recovery) {
        status = 'reopenable';
        reasonEn = 'Closed, but a recovery route exists.';
        reasonHi = 'बंद है, लेकिन एक पुनर्प्राप्ति मार्ग मौजूद है।';
      }
    }

    const evalNode: EvaluatedNode = {
      nodeId: node.id,
      nameEn: node.nameEn,
      nameHi: node.nameHi,
      family: node.family,
      tier: node.tier,
      doorStatus: status,
      doorReasonEn: reasonEn,
      doorReasonHi: reasonHi,
      costRange: {
        min: node.costRangeMinINR || 0,
        max: node.costRangeMaxINR || 0,
        type: node.costType || 'both'
      },
      durationMonths: node.durationMonths || 36,
      competitiveness: node.competitiveness || 'moderate',
      futureDoorsOpened: 0, // Computed below
      futurePathIds: [], // Computed below
      recoveryRoute: recovery,
      sources: nodeSources,
      score: 0 // Computed below
    };

    return evalNode;
  });

  // Second pass: compute future doors and scores
  for (const node of evaluatedNodes) {
    const outgoingEdges = rawEdges.filter(e => e.fromNodeId === node.nodeId);
    node.futurePathIds = outgoingEdges.map(e => e.toNodeId);
    node.futureDoorsOpened = outgoingEdges.length;
    node.score = scoreRoute(node, input);
  }

  return evaluatedNodes;
}
