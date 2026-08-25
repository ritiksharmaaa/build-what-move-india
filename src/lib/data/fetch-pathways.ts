import science from '@/data/pathways/science.json';
import commerce from '@/data/pathways/commerce.json';
import government from '@/data/pathways/government.json';
import creative from '@/data/pathways/creative.json';
import sources from '@/data/sources/source-register.json';

export function getGraphData() {
  const nodes = [
    ...science.nodes,
    ...commerce.nodes,
    ...government.nodes,
    ...creative.nodes
  ];

  const edges = [
    ...science.edges,
    ...commerce.edges,
    ...government.edges,
    ...creative.edges
  ];

  return { nodes, edges, sources: sources.sources || [] };
}
