import type { DoorStatus, RecoveryRoute } from '../contracts/pathway';

type NodeSummary = {
  id: string;
  nameEn: string;
  nameHi: string;
  costRange: { min: number; max: number; type: any };
  durationMonths: number;
};

// Simplified BFS to find an alternative route to the target node
export function findRecoveryRoute(
  targetNodeId: string,
  startNodeId: string,
  edges: any[],
  nodesMap: Map<string, NodeSummary>,
  budgetMax: string
): RecoveryRoute | undefined {
  // We look for an edge that leads to targetNodeId that is accessible (e.g. via NIOS or lateral entry)
  // For MVP, we'll simulate finding a direct recovery edge like NIOS or specific exams
  
  const recoveryEdges = edges.filter(e => 
    e.toNodeId === targetNodeId && 
    (e.edgeType === 'recovery' || e.edgeType === 'reentry' || e.edgeType === 'lateral_entry')
  );

  for (const edge of recoveryEdges) {
    // Basic budget check
    if (budgetMax === 'low' && edge.budgetMax === 'high') continue;
    
    const intermediateNode = nodesMap.get(edge.fromNodeId);
    if (!intermediateNode) continue;
    
    // Found a valid recovery path (1 hop simulated for MVP)
    return {
      steps: [
        {
          nodeId: intermediateNode.id,
          nameEn: intermediateNode.nameEn,
          nameHi: intermediateNode.nameHi,
          action: edge.edgeType === 'reentry' ? 'Complete Open Schooling (NIOS)' : 'Take Lateral Entry / Diploma Route'
        },
        {
          nodeId: targetNodeId,
          nameEn: 'Target Route',
          nameHi: 'लक्ष्य मार्ग',
          action: 'Apply via alternate eligibility'
        }
      ],
      totalCostRange: intermediateNode.costRange,
      totalDurationMonths: intermediateNode.durationMonths + 12 // Simulated +1 year for recovery
    };
  }
  
  return undefined;
}
