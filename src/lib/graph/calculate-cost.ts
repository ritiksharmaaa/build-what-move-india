import type { CostRange } from '../contracts/pathway';

export function aggregateCost(costs: CostRange[]): CostRange {
  return costs.reduce(
    (acc, curr) => ({
      min: acc.min + curr.min,
      max: acc.max + curr.max,
      type: curr.type === 'both' || acc.type !== curr.type ? 'both' : curr.type,
    }),
    { min: 0, max: 0, type: 'government' }
  );
}
