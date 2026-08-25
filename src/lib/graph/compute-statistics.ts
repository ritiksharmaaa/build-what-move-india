import type { EvaluatedNode, GraphStatistics } from '../contracts/pathway';

export function computeStatistics(nodes: EvaluatedNode[]): GraphStatistics {
  return nodes.reduce(
    (stats, node) => {
      stats.totalPaths++;
      if (node.doorStatus === 'open') stats.openPaths++;
      else if (node.doorStatus === 'closed') stats.closedPaths++;
      else if (node.doorStatus === 'harder') stats.harderPaths++;
      else if (node.doorStatus === 'reopenable') stats.recoveryRoutes++;
      else if (node.doorStatus === 'conditional') stats.conditionalPaths++;
      else if (node.doorStatus === 'unverified') stats.unverifiedPaths++;
      return stats;
    },
    { totalPaths: 0, openPaths: 0, closedPaths: 0, harderPaths: 0, recoveryRoutes: 0, conditionalPaths: 0, unverifiedPaths: 0 }
  );
}
