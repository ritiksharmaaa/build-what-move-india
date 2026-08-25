import type { StudentDecisionInput } from '../contracts/student';
import type { EvaluatedNode } from '../contracts/pathway';

export function scoreRoute(node: EvaluatedNode, input: StudentDecisionInput): number {
  let score = 0;

  // 40% goal match (basic heuristic for MVP)
  if (input.goals.length === 0) {
    score += 20; // baseline if no specific goals
  } else {
    const hasGoalMatch = input.goals.some(
      g => node.nameEn.toLowerCase().includes(g.toLowerCase()) || node.family === g.toLowerCase()
    );
    if (hasGoalMatch) score += 40;
  }

  // 25% future doors preserved
  score += Math.min(25, node.futureDoorsOpened * 2);

  // 15% budget fit
  const cost = node.costRange.min;
  if (input.budgetBand === 'high') {
    score += 15;
  } else if (input.budgetBand === 'medium') {
    if (cost <= 200000) score += 15;
    else if (cost <= 500000) score += 5;
  } else if (input.budgetBand === 'low') {
    if (cost <= 50000) score += 15;
  }

  // 10% time to first earning
  if (input.earningUrgency === 'immediate') {
    if (node.durationMonths <= 12) score += 10;
  } else if (input.earningUrgency === 'within_2_years') {
    if (node.durationMonths <= 24) score += 10;
    else if (node.durationMonths <= 36) score += 5;
  } else {
    score += 10; // no rush
  }

  // 10% fallback strength (if it has recovery routes or is a government/low-risk path)
  if (node.recoveryRoute || node.costRange.type === 'government' || node.costRange.type === 'both') {
    score += 10;
  }

  return score;
}
