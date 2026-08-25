export type StudentStage = 'class_10' | 'class_12' | 'graduate' | 'dropout';

export type StreamChoice =
  | 'science_with_maths'
  | 'science_without_maths'
  | 'commerce_with_maths'
  | 'commerce_without_maths'
  | 'humanities'
  | 'vocational'
  | 'unknown';

export type BudgetBand = 'low' | 'medium' | 'high';

export type EarningUrgency = 'immediate' | 'within_2_years' | 'long_term';

export type StudentDecisionInput = {
  stage: StudentStage;
  class10Stream?: StreamChoice;
  class12Stream?: StreamChoice;
  class12Subjects?: string[];
  stateCode: string;
  interests: string[];
  goals: string[];
  budgetBand: BudgetBand;
  earningUrgency: EarningUrgency;
  preferredLanguage: 'en' | 'hi';
  hasPwDCertificate?: boolean;
};
