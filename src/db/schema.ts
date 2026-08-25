import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const pathwayNodes = sqliteTable('pathway_nodes', {
  id: text('id').primaryKey(),
  nameEn: text('name_en').notNull(),
  nameHi: text('name_hi').notNull(),
  family: text('family').notNull(), // science | commerce | government | creative | healthcare | vocational | flexible
  tier: text('tier').notNull(),     // now | next | future
  descriptionEn: text('description_en'),
  descriptionHi: text('description_hi'),
  costRangeMinINR: integer('cost_range_min_inr'),
  costRangeMaxINR: integer('cost_range_max_inr'),
  costType: text('cost_type'),       // government | private | both
  durationMonths: integer('duration_months'),
  competitiveness: text('competitiveness'), // high_intake | moderate | highly_competitive | extremely_competitive
  seatCount: integer('seat_count'),
  approxApplicants: integer('approx_applicants'),
  earningTimelineMonths: integer('earning_timeline_months'),
  isGovernmentPath: integer('is_government_path', { mode: 'boolean' }),
  recognitionBody: text('recognition_body'), // UGC | AICTE | state_board | none | unverified
});

export const pathwayEdges = sqliteTable('pathway_edges', {
  id: text('id').primaryKey(),
  fromNodeId: text('from_node_id').notNull().references(() => pathwayNodes.id),
  toNodeId: text('to_node_id').notNull().references(() => pathwayNodes.id),
  requiredSubjects: text('required_subjects', { mode: 'json' }),   // string[]
  requiredExams: text('required_exams', { mode: 'json' }),         // string[]
  requiredStage: text('required_stage'),                           // class_10 | class_12 | graduate | any
  requiredStream: text('required_stream'),                         // science | commerce | humanities | any
  requiresMaths: integer('requires_maths', { mode: 'boolean' }),
  budgetMax: text('budget_max'),                                   // low | medium | high | any
  stateSpecific: text('state_specific'),                           // UP | null (null = national)
  edgeType: text('edge_type').notNull(),                           // direct | lateral_entry | recovery | reentry
});

export const eligibilityConditions = sqliteTable('eligibility_conditions', {
  id: text('id').primaryKey(),
  edgeId: text('edge_id').notNull().references(() => pathwayEdges.id),
  conditionType: text('condition_type').notNull(),
  conditionKey: text('condition_key').notNull(),
  conditionValue: text('condition_value').notNull(),
  isHardRequirement: integer('is_hard_requirement', { mode: 'boolean' }).notNull(),
});

export const sourceClaims = sqliteTable('source_claims', {
  id: text('id').primaryKey(),
  nodeOrEdgeId: text('node_or_edge_id').notNull(),
  sourceUrl: text('source_url').notNull(),
  sourceName: text('source_name').notNull(),
  claimType: text('claim_type').notNull(),
  claimTextEn: text('claim_text_en').notNull(),
  claimTextHi: text('claim_text_hi'),
  verificationStatus: text('verification_status').notNull(),
  lastVerifiedDate: text('last_verified_date').notNull(),
  confidenceLevel: text('confidence_level').notNull(),
});

export const aiAuditLog = sqliteTable('ai_audit_log', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  inputHash: text('input_hash').notNull(),
  outputSummary: text('output_summary').notNull(),
  modelUsed: text('model_used').notNull(),
  confidenceScore: real('confidence_score'),
  hadFallback: integer('had_fallback', { mode: 'boolean' }),
  createdAt: text('created_at').notNull(),
});
