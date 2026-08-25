import type { EvaluatedNode, GraphStatistics, CascadeImpact } from './pathway';
import type { StudentDecisionInput } from './student';

export type RouteEvaluationRequest = {
  input: StudentDecisionInput;
};

export type RouteEvaluationResponse = {
  nodes: EvaluatedNode[];
  statistics: GraphStatistics;
  timestamp: string;
  disclaimer: string;
};

export type CascadeRequest = {
  previousInput: StudentDecisionInput;
  newInput: StudentDecisionInput;
};

export type CascadeResponse = {
  impact: CascadeImpact;
  newNodes: EvaluatedNode[];
  newStatistics: GraphStatistics;
};

export type AIExplanationRequest = {
  nodeId: string;
  evaluatedNode: EvaluatedNode;
  studentInput: StudentDecisionInput;
};

export type AIExplanation = {
  officialRequirements: string;
  aiExplanation: string;
  tradeOffs: string[];
  nextActions: string[];
  warnings: string[];
  confidenceScore: number;
  sourceIds: string[];
};

export type AIExplanationResponse = {
  explanation: AIExplanation | null;
  fallbackUsed: boolean;
  error?: string;
};
