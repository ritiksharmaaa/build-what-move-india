import { z } from 'zod';

export const StudentDecisionSchema = z.object({
  stage: z.enum(['class_10', 'class_12', 'graduate', 'dropout']),
  class10Stream: z.enum([
    'science_with_maths', 'science_without_maths', 
    'commerce_with_maths', 'commerce_without_maths', 
    'humanities', 'vocational', 'unknown'
  ]).optional(),
  class12Stream: z.enum([
    'science_with_maths', 'science_without_maths', 
    'commerce_with_maths', 'commerce_without_maths', 
    'humanities', 'vocational', 'unknown'
  ]).optional(),
  class12Subjects: z.array(z.string()).optional(),
  stateCode: z.string().min(2).default('UP'),
  interests: z.array(z.string()).max(5).default([]),
  goals: z.array(z.string()).default([]),
  budgetBand: z.enum(['low', 'medium', 'high']).default('medium'),
  earningUrgency: z.enum(['immediate', 'within_2_years', 'long_term']).default('long_term'),
  preferredLanguage: z.enum(['en', 'hi']).default('en'),
  hasPwDCertificate: z.boolean().default(false),
});

export type StudentDecisionFormData = z.infer<typeof StudentDecisionSchema>;
