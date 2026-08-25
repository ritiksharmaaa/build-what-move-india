import { NextResponse } from 'next/server';
import { evaluateGraph } from '@/lib/graph/evaluate-pathway';
import { computeStatistics } from '@/lib/graph/compute-statistics';
import { computeCascade } from '@/lib/graph/compute-cascade';
import { getGraphData } from '@/lib/data/fetch-pathways';
import { StudentDecisionSchema } from '@/lib/validation/student-input';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { input, oldNodes, changedKey } = body;

    const parsed = StudentDecisionSchema.safeParse(input);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const graphData = getGraphData();
    const newNodes = evaluateGraph(parsed.data, graphData.nodes, graphData.edges, graphData.sources);
    const stats = computeStatistics(newNodes);

    let cascade = null;
    if (oldNodes && changedKey) {
      cascade = computeCascade(changedKey, oldNodes, newNodes, parsed.data.preferredLanguage);
    }

    return NextResponse.json({
      nodes: newNodes,
      stats,
      cascade
    });
  } catch (error) {
    console.error('Error in /api/evaluate:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
