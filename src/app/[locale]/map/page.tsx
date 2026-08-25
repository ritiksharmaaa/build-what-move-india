import { evaluateGraph } from '@/lib/graph/evaluate-pathway';
import { computeStatistics } from '@/lib/graph/compute-statistics';
import { getGraphData } from '@/lib/data/fetch-pathways';
import { PathwayWorkspace } from '@/components/pathway/pathway-workspace';
import { StudentDecisionSchema } from '@/lib/validation/student-input';
import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default async function MapPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const search = await searchParams;

  // Build input from query params
  const rawInput = {
    stage: search.stage || 'class_10',
    class12Stream: search.stream,
    budgetBand: search.budget || 'medium',
    goals: search.goals ? search.goals.split(',') : [],
    stateCode: 'UP',
    interests: [],
    earningUrgency: 'long_term',
    preferredLanguage: locale
  };

  const parsed = StudentDecisionSchema.safeParse(rawInput);
  if (!parsed.success) {
    // Redirect back to start if invalid
    redirect(`/${locale}/start`);
  }

  const input = parsed.data;
  const graphData = getGraphData();
  
  // Evaluate the graph on the server!
  const evaluatedNodes = evaluateGraph(input, graphData.nodes, graphData.edges, graphData.sources);
  const stats = computeStatistics(evaluatedNodes);

  return (
    <PathwayWorkspace 
      initialInput={input}
      initialNodes={evaluatedNodes}
      initialStats={stats}
      rawGraphData={graphData}
    />
  );
}
