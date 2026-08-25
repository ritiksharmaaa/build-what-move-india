export type PathwayFamily = 'science' | 'commerce' | 'government' | 'creative' | 'healthcare' | 'vocational' | 'flexible';

export type PathwayTier = 'now' | 'next' | 'future';

export type DoorStatus = 'open' | 'conditional' | 'harder' | 'closed' | 'reopenable' | 'unverified';

export type Competitiveness = 'high_intake' | 'moderate' | 'highly_competitive' | 'extremely_competitive';

export type CostType = 'government' | 'private' | 'both';

export type EdgeType = 'direct' | 'lateral_entry' | 'recovery' | 'reentry';

export type CostRange = {
  min: number;
  max: number;
  type: CostType;
};

export type SourceClaim = {
  id: string;
  sourceUrl: string;
  sourceName: string;
  claimType: string;
  claimTextEn: string;
  claimTextHi?: string;
  verificationStatus: 'verified' | 'partial' | 'discovery';
  lastVerifiedDate: string;
  confidenceLevel: 'high' | 'medium' | 'low';
};

export type RecoveryRoute = {
  steps: { nodeId: string; nameEn: string; nameHi: string; action: string }[];
  totalCostRange: CostRange;
  totalDurationMonths: number;
};

export type EvaluatedNode = {
  nodeId: string;
  nameEn: string;
  nameHi: string;
  family: PathwayFamily;
  tier: PathwayTier;
  doorStatus: DoorStatus;
  doorReasonEn: string;
  doorReasonHi: string;
  costRange: CostRange;
  durationMonths: number;
  competitiveness: Competitiveness;
  futureDoorsOpened: number;
  futurePathIds: string[];
  recoveryRoute?: RecoveryRoute;
  sources: SourceClaim[];
  score: number;
};

export type GraphStatistics = {
  totalPaths: number;
  openPaths: number;
  closedPaths: number;
  harderPaths: number;
  recoveryRoutes: number;
  conditionalPaths: number;
  unverifiedPaths: number;
};

export type CascadeImpact = {
  parameterChanged: string;
  doorsOpened: EvaluatedNode[];
  doorsClosed: EvaluatedNode[];
  doorsUnchanged: number;
  summaryEn: string;
  summaryHi: string;
};
