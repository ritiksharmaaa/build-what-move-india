# PathFinder India Implementation Plan

Revised: 26 August 2026
Timeline: ~67 hours remaining (deadline: 28 August 2026, 8:00 PM IST)
Developer: Solo

## 1. Technology Stack Decisions

### Database: SQLite (via better-sqlite3) → PostgreSQL migration path

SQLite is the right choice for MVP because:

- Zero infrastructure setup (no Docker, no cloud DB provisioning)
- Ships as a single file — trivial to deploy on Vercel/Railway
- Fast reads for the graph evaluation workload (read-heavy, write-light)
- Schema-compatible with PostgreSQL for post-hackathon migration via Drizzle ORM

If a feature specifically requires PostgreSQL (e.g., full-text search in Hindi, JSON indexing at scale), switch that table only. For MVP, SQLite handles everything.

**ORM: Drizzle ORM** (not Prisma) — lighter, faster builds, better SQLite support, and schema is just TypeScript. Migration to PostgreSQL later is a one-line dialect swap.

### Internationalization: Hindi + English (Bilingual, Must-Have)

Following Indian government patterns researched across NCS, india.gov.in, DigiLocker, and Scholarships Portal:

- **Library**: `next-intl` with App Router
- **Routing**: Path-based (`/en/map` vs `/hi/map`) for SEO and shareability
- **Content**: Manually curated JSON dictionaries (not machine-translated)
- **Typography**: `Inter` for Latin + `Noto Sans Devanagari` for Hindi, with `line-height: 1.6` for Devanagari to prevent matra clipping
- **Numbers**: Indian numbering system via `Intl.NumberFormat('hi-IN')` — ₹5,00,000 not ₹500,000
- **Toggle**: Header pill button `EN | हिं` — instant switch without page reload

**File structure**:
```
src/messages/
├── en.json    # English curated dictionary
└── hi.json    # Hindi curated dictionary
src/i18n/
├── routing.ts    # Locale definitions
├── request.ts    # Server-side message loader
└── navigation.ts # Type-safe Link, useRouter, usePathname
src/middleware.ts  # Edge middleware for locale detection
```

### UI Priority: Desktop-First, Then Mobile

Judges review on laptops. ALL career options must be visible on desktop. Nothing hidden behind "show more" buttons. Desktop layout is the primary design target; mobile is responsive secondary.

### Framework and Libraries

- Next.js 15 (App Router, React Server Components)
- TypeScript strict mode
- Tailwind CSS 4 + Shadcn UI
- Drizzle ORM + better-sqlite3
- `next-intl` for bilingual
- `dagre` or `elkjs` for graph layout
- Zod for validation
- Lucide icons
- `next-pwa` for offline fallback

## 2. Block Schedule (7 Blocks over ~65 Productive Hours)

### Day 1 — Foundation + Engine (Aug 26, ~20 productive hours)

| Block | Hours | What Gets Done | Judging Points |
|---|---|---|---|
| **Block 1: Foundation** | 6h | Git init, Next.js + Tailwind + Shadcn + Drizzle, TypeScript contracts, SQLite schema, `next-intl` bilingual setup (EN/HI), JSON pathway data (30+ nodes, 60+ edges, 4 families deep), app shell with disclaimer, language toggle | Working build |
| **Block 2: Graph Engine** | 6h | Deterministic graph evaluator, door-status logic (`open`/`conditional`/`harder`/`reopenable`/`closed`), cost calculator, recovery route finder, scoring algorithm, **write tests** — this is the core logic | Product thinking, End-to-end |
| **Block 3: Intake Journey** | 8h | Landing → stage select → **Graduate/Dropout follow-up asking 10th/12th history** → conversational cards → Zod validation. No login. Sticky parameter bar. Budget slider with real-world anchors. Goal conflict resolver. All in Hindi + English | Usability |

### Day 2 — Pathway Map + Features (Aug 27, ~20 productive hours)

| Block | Hours | What Gets Done | Judging Points |
|---|---|---|---|
| **Block 4: Pathway Map** | 10h | Reactive constraint graph. **Desktop: full graph with ALL nodes visible**, no hiding. **Mobile: vertically scrollable cards with expandable sections**. Parameter change → instant re-evaluation → animated transitions. Impact toast. Color-coded status. **Statistics bar** ("60 open, 33 closed, 10% hard, 5 recovery"). **Expandable "+N more" lists** (click to expand in showcase/accordion) | **Usability**, Product thinking |
| **Block 5: Compare + Action Plan** | 6h | Node detail drawer with institution comparison (govt vs private, national vs state). Side-by-side compare (max 3 paths). 30-day action plan. WhatsApp share. PDF/screenshot export | Working build |
| **Block 6: AI + Safety** | 4h | AI explanation API (structured output, source-backed, fallback). Distress detector. Guardrails. Prompt injection protection. Rate limiting. Audit logging | Honesty, End-to-end |

### Day 3 — Polish + Ship (Aug 28, ~15 productive hours, ship by 6 PM IST)

| Block | Hours | What Gets Done | Judging Points |
|---|---|---|---|
| **Block 7: Integration + Ship** | 10h | Desktop layout QA (1024px, 1440px), mobile responsive (375px, 390px, 768px), loading/error/offline states, ALL Hindi translations verified, Vercel deploy, demo script run-through, 2-min video recording, 250-word summary finalized | All criteria |
| **Buffer** | 5h | Bug fixes, edge cases found during testing, final recording retakes, submission form | — |

### Dependency Graph

```
Block 1 (Foundation + Data + i18n)
  ├──> Block 2 (Graph Engine + Tests) ──> Block 4 (Pathway Map)
  └──> Block 3 (Intake Journey) ────────> Block 4 (Pathway Map)
                                              │
                              Block 5 (Compare + Plan) <──┘
                              Block 6 (AI + Safety) <─────┘
                                              │
                              Block 7 (Integration + Ship) <──┘
```

## 3. Task Details

### Block 1: Foundation (6 Hours)

**Files**

- `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`
- `.gitignore`, `README.md`, `.env.example`
- `drizzle.config.ts`
- `src/db/schema.ts`, `src/db/index.ts`
- `src/db/seed.ts`
- `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`
- `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`
- `src/middleware.ts`
- `src/messages/en.json`, `src/messages/hi.json`
- `src/components/layout/header.tsx`, `src/components/layout/language-switcher.tsx`
- `src/components/prototype-disclaimer.tsx`
- `src/lib/contracts/pathway.ts`, `src/lib/contracts/student.ts`, `src/lib/contracts/api.ts`
- `src/data/pathways/science.json`, `src/data/pathways/commerce.json`
- `src/data/pathways/government.json`, `src/data/pathways/creative.json`
- `src/data/sources/source-register.json`

**Steps**

1. Initialize Git with `main` as the default branch. Single branch workflow — commit after every completed block.
2. Create Next.js 15 App Router project with strict TypeScript.
3. Install and configure: Tailwind CSS, Shadcn UI, Drizzle ORM, better-sqlite3, `next-intl`, Zod, Lucide icons, dagre.
4. Set up bilingual routing with `next-intl`:
   - Path-based routing: `/en/...` and `/hi/...`
   - Edge middleware for locale detection
   - Language switcher component (`EN | हिं` pill toggle in header)
   - Fonts: `Inter` for Latin, `Noto Sans Devanagari` for Hindi
   - Hindi line-height: `1.6` to prevent Devanagari matra clipping
   - Indian number formatting: `Intl.NumberFormat('hi-IN')`
5. Define SQLite schema via Drizzle:

```typescript
// src/db/schema.ts
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
  conditionType: text('condition_type').notNull(), // subject | exam | marks | age | budget | certificate
  conditionKey: text('condition_key').notNull(),
  conditionValue: text('condition_value').notNull(),
  isHardRequirement: integer('is_hard_requirement', { mode: 'boolean' }).notNull(),
});

export const sourceClaims = sqliteTable('source_claims', {
  id: text('id').primaryKey(),
  nodeOrEdgeId: text('node_or_edge_id').notNull(),
  sourceUrl: text('source_url').notNull(),
  sourceName: text('source_name').notNull(),
  claimType: text('claim_type').notNull(),     // eligibility | cost | duration | recognition | exam
  claimTextEn: text('claim_text_en').notNull(),
  claimTextHi: text('claim_text_hi'),
  verificationStatus: text('verification_status').notNull(), // verified | partial | discovery
  lastVerifiedDate: text('last_verified_date').notNull(),    // ISO date string
  confidenceLevel: text('confidence_level').notNull(),       // high | medium | low
});

export const aiAuditLog = sqliteTable('ai_audit_log', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  inputHash: text('input_hash').notNull(),       // SHA-256 of sanitized input (no PII)
  outputSummary: text('output_summary').notNull(),
  modelUsed: text('model_used').notNull(),
  confidenceScore: real('confidence_score'),
  hadFallback: integer('had_fallback', { mode: 'boolean' }),
  createdAt: text('created_at').notNull(),
});
```

6. Seed JSON pathway data:
   - **Science family** (10 nodes, 20 edges): BSc, B.Tech, MSc, ISRO/DRDO, Medical, Research, Data Science, etc.
   - **Commerce family** (8 nodes, 15 edges): CA, B.Com, MBA, Banking, Actuarial, etc.
   - **Government family** (7 nodes, 15 edges): UPSC, UPPSC, SSC, Defence, Police, Teaching, etc.
   - **Creative/vocational family** (5+ nodes, 10+ edges): Design, Aviation, Hospitality, Film, Media, etc.
   - Every node has `nameEn` + `nameHi`. Every source claim has a real URL from official sources.
   - Mark each record `verified`, `partial`, or `discovery`.
7. Define shared TypeScript contracts:

```typescript
// src/lib/contracts/student.ts
export type StudentStage = 'class_10' | 'class_12' | 'graduate' | 'dropout';

export type StudentDecisionInput = {
  stage: StudentStage;
  // For graduates/dropouts: what they chose earlier
  class10Stream?: 'science' | 'commerce' | 'humanities' | 'vocational' | 'unknown';
  class12Stream?: 'science_with_maths' | 'science_without_maths' | 'commerce_with_maths' | 'commerce_without_maths' | 'humanities' | 'vocational' | 'unknown';
  class12Subjects?: string[];
  // Current inputs
  stateCode: string;          // 'UP' for MVP, expandable
  interests: string[];
  goals: string[];
  budgetBand: 'low' | 'medium' | 'high';
  earningUrgency: 'immediate' | 'within_2_years' | 'long_term';
  preferredLanguage: 'en' | 'hi';
  hasPwDCertificate?: boolean;
};

// src/lib/contracts/pathway.ts
export type DoorStatus = 'open' | 'conditional' | 'harder' | 'reopenable' | 'closed' | 'unverified';

export type EvaluatedNode = {
  nodeId: string;
  nameEn: string;
  nameHi: string;
  family: string;
  tier: 'now' | 'next' | 'future';
  doorStatus: DoorStatus;
  doorReason: string;           // Why this status (translatable key)
  costRange: { min: number; max: number; type: 'government' | 'private' | 'both' };
  durationMonths: number;
  competitiveness: string;
  futureDoorsOpened: number;    // Count of paths this enables
  futurePathIds: string[];      // IDs of paths this enables
  recoveryRoute?: RecoveryRoute;
  sources: SourceClaim[];
};

export type GraphStatistics = {
  totalPaths: number;
  openPaths: number;
  closedPaths: number;
  harderPaths: number;
  recoveryRoutes: number;
  conditionalPaths: number;
};

export type CascadeImpact = {
  parameterChanged: string;
  doorsOpened: EvaluatedNode[];
  doorsClosed: EvaluatedNode[];
  doorsUnchanged: number;
  summary: string;             // Translatable summary string
};
```

8. Build app shell with:
   - Sticky header with language toggle, navigation, and disclaimer link
   - Permanent independent-prototype disclaimer component (bilingual)
   - Loading, empty, error, and offline-friendly states
   - No mandatory sign-up

### Block 2: Graph Engine (6 Hours)

**Files**

- `src/lib/graph/evaluate-pathway.ts`
- `src/lib/graph/find-future-routes.ts`
- `src/lib/graph/score-routes.ts`
- `src/lib/graph/calculate-cost.ts`
- `src/lib/graph/find-recovery-routes.ts`
- `src/lib/graph/compute-statistics.ts`
- `src/lib/graph/compute-cascade.ts`
- `src/lib/graph/cycle-detector.ts`
- `src/lib/graph/__tests__/evaluate-pathway.test.ts`
- `src/lib/graph/__tests__/cascade.test.ts`
- `src/lib/graph/__tests__/recovery.test.ts`
- `src/lib/graph/__tests__/edge-cases.test.ts`

**Steps**

1. Build a deterministic directed pathway graph. No Markov Chains. No probabilistic models. Pure graph traversal.
2. Evaluate each edge against student inputs:
   - Subjects → check `requiredSubjects` on edges
   - Stream → check `requiredStream`
   - Budget → check `budgetMax`
   - Maths → check `requiresMaths`
   - Stage → check `requiredStage`
   - **For graduates/dropouts**: check `class10Stream` and `class12Stream` to unlock/block lateral entry paths
3. Return color-coded statuses:
   - 🟢 `open` — all requirements met
   - 🟡 `conditional` — most requirements met, one soft condition pending
   - 🟠 `harder` — possible but significantly more difficult (low acceptance rate, high cost, extra steps)
   - 🔴 `closed` — hard requirement not met
   - 🟣 `reopenable` — closed but a recovery route exists
   - ⚫ `unverified` — data not verified for this combination
4. **Cycle detection**: max-depth=4 on graph traversal. If a path loops back (dropout → re-entry → dropout), show "You've seen this route before."
5. **Recovery route finder**: For every `closed` node, search for an alternative path (max 3 hops) that gets the student to the same destination. Filter by budget — don't show ₹15L recovery routes to a "low budget" student.
6. **Score routes**: 40% goal match, 25% future doors preserved, 15% budget fit, 10% time to first earning, 10% fallback strength.
7. **Calculate total cost ranges**: Separate government/subsidized vs private for each path. Include exam fees, coaching, course fees, travel, equipment, living costs.
8. **Compute statistics**: Count open/closed/harder/recovery/conditional paths. Return `GraphStatistics` object.
9. **Compute cascade**: When a parameter changes, diff the before/after evaluation. Return `CascadeImpact` with lists of doors opened, doors closed, and a summary string.
10. **Test scenarios**:
    - Science with maths → all STEM paths open
    - Science without maths → engineering, physics research closed
    - Multiple contradictory goals → conflict resolution
    - Low budget → filter out expensive paths and recovery routes
    - Graduate who took Commerce in 12th → science lateral entry harder
    - Dropout → open schooling and re-entry routes available
    - Aviation path → medical fitness, cost, and fallback shown
    - Government exam path → UPSC vs UPPSC comparison
    - Creative career → realistic cost and fallback warnings
    - Cycle detection → dropout loop prevented

### Block 3: Intake Journey (8 Hours)

**Files**

- `src/app/[locale]/start/page.tsx`
- `src/components/intake/stage-selector.tsx`
- `src/components/intake/history-selector.tsx` — **NEW: asks 10th/12th history for graduates/dropouts**
- `src/components/intake/interest-tags.tsx`
- `src/components/intake/goal-selector.tsx`
- `src/components/intake/budget-slider.tsx`
- `src/components/intake/urgency-selector.tsx`
- `src/components/intake/goal-conflict-resolver.tsx`
- `src/components/intake/intake-form.tsx`
- `src/lib/validation/student-input.ts`
- `src/lib/safety/distress-detector.ts`

**Steps**

1. **Stage selector**: Large tap targets. Class 10, Class 12, Graduate, Dropped Out. No login. Bilingual labels.
2. **History selector (critical for graduates/dropouts)**:
   - If student selects "Graduate" or "Dropped Out":
   - Ask: "What stream did you take in Class 10?" (Science/Commerce/Humanities/Vocational/Don't Remember)
   - Ask: "What stream did you take in Class 12?" (Science+Maths/Science-Maths/Commerce+Maths/Commerce-Maths/Humanities/Vocational/Did not complete/Don't Remember)
   - These answers feed into the graph engine to unlock/block lateral entry paths
3. **Interest tags**: Tap-to-select tags. Cap at 5 with a "pick what matters most" prompt. Both Hindi and English labels on each tag.
4. **Goal selector**: Common goals list (Doctor, Engineer, CA, Civil Servant, Teacher, Scientist, Pilot, Designer, Business, Government Job, etc.) + free-text "Other" input. Map unknown goals to closest family.
5. **Goal conflict resolver**: If student selects contradictory goals (e.g., Doctor + Earn Immediately), show a card: "These goals have different timelines. We'll show both paths — you decide."
6. **Budget slider**: Real-world anchors in Hindi/English:
   - ₹10K/yr = सरकारी कॉलेज / Government college
   - ₹1L/yr = मध्यम श्रेणी / Mid-range
   - ₹5L+/yr = निजी / Private
7. **Urgency selector**: Three clear options with Hindi labels.
8. **PwD toggle**: Optional. "Do you have a disability certificate? / क्या आपके पास विकलांगता प्रमाणपत्र है?"
9. **Distress detection**: On every text input (goals, interests), run keyword detection:

```typescript
// src/lib/safety/distress-detector.ts
const DISTRESS_KEYWORDS_EN = [
  'kill myself', 'want to die', 'suicide', 'end my life',
  'no point living', 'parents will kill me', 'nobody cares',
  'run away', 'self harm', 'hurt myself'
] as const;

const DISTRESS_KEYWORDS_HI = [
  'मरना चाहता हूं', 'जीने का मन नहीं', 'आत्महत्या',
  'कोई फायदा नहीं', 'भाग जाना', 'मार डालेंगे'
] as const;

type DistressResult = {
  detected: boolean;
  severity: 'low' | 'high';
  helplines: Helpline[];
};

const HELPLINES: Helpline[] = [
  { name: 'iCall', number: '9152987821', hours: 'Mon-Sat 8am-10pm' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', hours: '24/7' },
  { name: 'AASRA', number: '9820466726', hours: '24/7' },
];
```

10. Validate all inputs with Zod (bilingual error messages).
11. Keep draft data in browser memory only. No cookies, no server-side session.
12. Submit valid inputs to the route-evaluation API.

### Block 4: Pathway Map — The Hero Screen (10 Hours)

**Files**

- `src/app/[locale]/map/page.tsx`
- `src/components/pathway/pathway-map-desktop.tsx`
- `src/components/pathway/pathway-map-mobile.tsx`
- `src/components/pathway/pathway-node.tsx`
- `src/components/pathway/pathway-edge.tsx`
- `src/components/pathway/status-legend.tsx`
- `src/components/pathway/statistics-bar.tsx`
- `src/components/pathway/parameter-bar.tsx`
- `src/components/pathway/cascade-impact-toast.tsx`
- `src/components/pathway/expandable-list.tsx`
- `src/components/pathway/recovery-route.tsx`

**Steps**

1. **Desktop view (PRIMARY — judges use laptops)**:
   - Three-column timeline layout: NOW → NEXT → FUTURE
   - **ALL career options visible**. No "show more" buttons hiding options. Every node from every family is rendered
   - Nodes are color-coded by status with clear labels (not just colors — add text labels for accessibility)
   - Edges connect related nodes with curved lines, colored by status
   - Use `dagre` or `elkjs` for automatic graph layout that prevents node overlap

2. **Statistics bar** (sticky, above the graph):
   ```
   60 paths open · 33 paths closed · 10% hard routes · 5 recovery routes
   ```
   Updates in real time as parameters change. Use animated number transitions (count-up effect).

3. **Sticky parameter bar** (top of page, always visible):
   - Shows current inputs as editable pills: Stage, Stream, Subjects, Budget, Goals, State
   - Each pill has an edit/remove button
   - Changing ANY pill triggers instant re-evaluation of the entire graph

4. **Cascade behavior**:
   - When parameter changes: all nodes re-evaluate simultaneously
   - Nodes that change status animate (300ms fade transition)
   - Statistics bar counts animate to new values
   - **Impact toast** appears: "⚠ Removing Maths closed 12 paths and opened 3 new ones"
   - Toast is dismissible, shows for 5 seconds

5. **Expandable "+N more" lists**:
   - When impact shows "Closed: B.Tech, BSc Physics + 9 more"
   - Clicking "+9 more" expands to show ALL items in a showcase/accordion view
   - **On desktop: expanded by default** — judges see everything
   - On mobile: collapsed with clear expand affordance

6. **Recovery routes**:
   - Red/purple nodes are interactive
   - Clicking shows the recovery path: "To reach [goal] from your current position, you would need to: 1. [step] 2. [step] 3. [step]"
   - Recovery routes are filtered by budget

7. **Mobile view** (< 768px):
   - Convert graph to vertically scrollable cards grouped by pathway family
   - Each card shows: status badge, name (Hindi/English), cost range, duration, "Opens X paths" count
   - Swipe between NOW / NEXT / FUTURE as horizontal tabs
   - Expandable sections are collapsed by default but always expandable

8. **Node interaction**:
   - Clicking any node opens a detail drawer/panel
   - Detail shows: full description, eligibility, cost breakdown (govt vs private), timeline, exams required, institution comparison, sources with URLs, recovery route if closed

### Block 5: Compare + Action Plan (6 Hours)

**Files**

- `src/app/[locale]/compare/page.tsx`
- `src/app/[locale]/plan/page.tsx`
- `src/components/comparison/route-comparison.tsx`
- `src/components/comparison/cost-timeline.tsx`
- `src/components/comparison/institution-comparison.tsx`
- `src/components/sources/source-drawer.tsx`
- `src/components/plan/action-plan.tsx`
- `src/components/plan/whatsapp-share.tsx`

**Steps**

1. **Route comparison**: Side-by-side comparison of up to 3 paths. Show:
   - Eligibility status
   - Cost range (government column + private column)
   - Time to first earning
   - Exams required
   - National vs state-level options (e.g., UPSC vs UPPSC)
   - Doors opened count
   - Fallback options
   - Competitiveness (seat count vs applicants)

2. **Institution comparison**: For each path, show government vs private institutions:
   - Name, location, fee range, recognition body, placement data (if available)
   - National vs state-level institutions side by side
   - Sort by government/low-cost first
   - This is judge-facing — they will test whether the product enables real comparisons

3. **Source drawer**: Every eligibility rule, cost figure, and factual claim has a source link. Clicking opens a drawer with:
   - Source name and URL
   - Date last verified
   - Confidence level (high/medium/low)
   - Claim text in Hindi/English

4. **30-day action plan**: Deterministic generation from graph results:
   - Step-by-step checklist
   - Government services to check
   - Questions to ask school/parents
   - Low-cost alternatives to explore
   - Red flags and uncertainty notes
   - "Talk to a counsellor" reminder
   - Bilingual (Hindi + English)

5. **WhatsApp share**:

```typescript
// src/components/plan/whatsapp-share.ts
const generateShareText = (plan: ActionPlan, locale: 'en' | 'hi'): string => {
  if (locale === 'hi') {
    return `📋 *मेरी पाथफाइंडर योजना*\n\n` +
      `चरण: ${plan.stageHi}\n` +
      `चुना हुआ मार्ग: ${plan.chosenPathHi}\n\n` +
      `*अगले 30 दिन:*\n` +
      plan.actionsHi.map((a, i) => `${i + 1}. ${a}`).join('\n') +
      `\n\n_पाथफाइंडर इंडिया (प्रोटोटाइप) द्वारा बनाया गया_` +
      `\n⚠ यह मार्गदर्शन है, आधिकारिक सलाह नहीं।`;
  }
  return `📋 *My PathFinder Plan*\n\n` +
    `Stage: ${plan.stageEn}\n` +
    `Chosen Path: ${plan.chosenPathEn}\n\n` +
    `*Next 30 Days:*\n` +
    plan.actionsEn.map((a, i) => `${i + 1}. ${a}`).join('\n') +
    `\n\n_Generated by PathFinder India (prototype)_` +
    `\n⚠ This is guidance, not official advice.`;
};

const shareViaWhatsApp = (text: string) => {
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
};
```

### Block 6: AI Explanation + Safety (4 Hours)

**Files**

- `src/app/api/route-evaluation/route.ts`
- `src/app/api/route-explanation/route.ts`
- `src/lib/ai/client.ts`
- `src/lib/ai/explanation-schema.ts`
- `src/lib/ai/validate-claims.ts`
- `src/lib/ai/fallback-explanation.ts`
- `src/lib/ai/__tests__/validate-claims.test.ts`

**Steps**

1. **Route-evaluation API**: Wraps the deterministic graph engine. Accepts `StudentDecisionInput`, returns `EvaluatedNode[]` + `GraphStatistics`.
2. **AI explanation API** (separate endpoint):
   - Receives ONLY computed results + approved source claims (never raw user input)
   - Uses OpenAI structured output mode
   - Required output schema:

```typescript
type AIExplanation = {
  officialRequirements: string;    // From sources only
  aiExplanation: string;           // Natural language summary
  tradeOffs: string[];             // Pros and cons
  nextActions: string[];           // Recommended steps
  warnings: string[];              // Risks and caveats
  confidenceScore: number;         // 0-100
  sourceIds: string[];             // Must match source_claims table
};
```

3. **Claim validation**: Reject any AI output where `sourceIds` don't match the database. If AI invents a source, fall back to deterministic explanation.
4. **Confidence threshold**: Below 60% confidence → show deterministic fallback only, no AI text.
5. **Deterministic fallback**: Pre-written bilingual explanation templates for each pathway family. Used when AI fails, returns invalid content, or confidence is too low.
6. **Rate limiting**: Max 20 AI requests per session (tracked via session ID in browser).
7. **Audit logging**: Log every AI request/response to `aiAuditLog` table (anonymized — no PII, just input hash + output summary).
8. **Safety blocks in system prompt**:
   - Never recommend based on caste, religion, or gender
   - Never say "guaranteed job" or "best career"
   - Always say "safer for this goal" not "you must do this"
   - If input contains distress keywords, return helpline info instead of career advice
9. **Prompt injection protection**: Sanitize all user text inputs. Never interpolate raw user strings into the system prompt. Use structured parameters only.
10. **Network timeout**: 5-second timeout on AI calls → show deterministic fallback immediately. Never show a spinner for more than 5 seconds.

### Block 7: Integration, QA, Deploy, Demo (10 Hours)

**Files**

- `src/app/[locale]/page.tsx` (connect all flows)
- `tests/e2e/*`
- `docs/DEMO_SCRIPT.md`
- `docs/MOCK_DATA_DISCLOSURE.md`
- `README.md`

**Steps**

1. **Connect full journey**: Landing → Intake → Map → Compare → Action Plan. Every step deep-linkable via URL.
2. **Back button handling**: Persist state in URL params + sessionStorage. Every step navigable via browser back/forward.
3. **Desktop QA priority** (judges test on laptops):
   - Test at 1024px (small laptop), 1366px (common laptop), 1440px (external monitor)
   - Verify ALL career nodes visible — zero hidden
   - Verify statistics bar updates correctly
   - Verify cascade animation is smooth
   - Verify expandable lists show full content when clicked
4. **Mobile QA**:
   - Test at 375px (iPhone SE), 390px (iPhone 14), 768px (iPad)
   - Verify card layout is scrollable
   - Verify no overlapping text
   - Verify language toggle is accessible
5. **Hindi verification**:
   - Walk through entire journey in Hindi mode
   - Verify no untranslated strings
   - Verify Devanagari text is not clipped
   - Verify numbers use Indian format (₹5,00,000)
6. **End-to-end test scenarios**:
   - Science with maths → STEM paths open → compare → action plan
   - Science without maths → engineering closed, recovery route shown
   - Multiple contradictory goals → conflict resolver → both paths visible
   - Low budget → expensive options filtered, government alternatives highlighted
   - Graduate who took Commerce in 12th → science lateral entry harder
   - Aviation path → medical fitness warning, cost, fallback
   - UPPSC vs UPSC → state vs national comparison
   - Dropout → re-entry via NIOS, open schooling
   - Distress keyword in goal input → helpline redirect
   - AI failure → deterministic fallback shown within 5 seconds
   - Parameter change cascade → correct nodes flip, correct statistics
   - Back button at every step → no state loss
   - Multiple browser tabs → no session conflicts
   - Slow network (Chrome DevTools 3G) → loading states work
   - Hindi toggle mid-journey → content switches, state preserved
7. **PII verification**: Ensure no real data can be entered or persisted anywhere.
8. **Deploy** to Vercel (or Railway if SQLite file needs persistent storage).
9. **Mock data disclosure**: Create `MOCK_DATA_DISCLOSURE.md` listing everything that is mocked vs real.

## 4. Demo Script (2 Minutes)

### Minute 1 — Citizen Journey (judge sees the product working)

1. **(0:00)** Open app on laptop browser. "What stage are you at? / आप किस स्तर पर हैं?" → click Class 12
2. **(0:08)** Conversational cards appear. Select interests (Science, Government), goal (Civil Services), budget (Low), state (UP)
3. **(0:18)** Pathway map appears. **All career options visible.** Statistics bar: "45 open, 28 closed, 8% hard, 4 recovery routes"
4. **(0:28)** Walk through: UPSC path (green/open) vs UPPSC (green, more seats) vs B.Tech (green via JEE)
5. **(0:35)** **THE DEMO MOMENT**: Remove Maths from the parameter bar. Watch 12 nodes turn red. Toast: "12 engineering + research paths closed. 3 commerce paths now highlighted." Statistics update live
6. **(0:42)** Click a red node (B.Tech) → recovery route shown: "Switch to Science with Maths, or explore B.Tech via state lateral entry exam"
7. **(0:48)** Switch language to Hindi → entire interface switches. Walk through same map in Hindi
8. **(0:52)** Tap "Compare" on UPSC vs UPPSC → side-by-side with cost, seats, difficulty
9. **(0:56)** Generate 30-day action plan → Share via WhatsApp button

### Minute 2 — How I Built It (judge sees the thinking)

1. **(1:00)** "The problem: 6+ government portals, no cascade visibility. A wrong subject choice in Class 11 silently locks you out of careers you discover two years later."
2. **(1:10)** Architecture: Deterministic graph engine evaluates every path instantly. AI explains results but never overrides the engine. Source-backed claims with citation URLs.
3. **(1:20)** Safety: Distress detection with helpline routing. No PII collection. Synthetic data only. Every cost/eligibility marked as guidance, not guarantee.
4. **(1:30)** Bilingual: Hindi + English following Indian government website patterns (NCS, india.gov.in). Manually curated translations, not machine-translated.
5. **(1:40)** What's mocked: Student profiles, government API integrations, counsellor booking. What works: Full pathway graph, reactive cascade, cost comparison, source citations, WhatsApp sharing.
6. **(1:50)** Scale: SQLite → PostgreSQL. Add more states. Add more languages. Same graph engine, same reactive UI.
7. **(1:55)** "PathFinder India: one place to see what your choices open and close. In your language. For free."

## 5. Git Workflow

Single `main` branch. Commit after every completed block with a descriptive message.

```bash
git init -b main
# After Block 1:
git add . && git commit -m "feat: foundation, bilingual setup, SQLite schema, pathway data"
# After Block 2:
git add . && git commit -m "feat: deterministic graph engine with tests"
# After Block 3:
git add . && git commit -m "feat: intake journey with graduate history and distress detection"
# After Block 4:
git add . && git commit -m "feat: reactive pathway map with cascade and statistics"
# After Block 5:
git add . && git commit -m "feat: compare view, institution comparison, action plan, WhatsApp share"
# After Block 6:
git add . && git commit -m "feat: AI explanation with guardrails and safety"
# After Block 7:
git add . && git commit -m "chore: integration, QA, deploy, demo readiness"
```

Use feature folders (`src/components/intake/`, `src/components/pathway/`) for organization.

## 6. Verification Checklist

### Automated

```bash
pnpm lint          # TypeScript strict + ESLint
pnpm test          # Graph engine unit tests
pnpm build         # Next.js production build (catches SSR/i18n issues)
```

### Manual — Desktop (Primary)

- [ ] Full journey: Stage → Intake → Map → Compare → Plan (English)
- [ ] Full journey in Hindi
- [ ] ALL career options visible on desktop — zero hidden
- [ ] Parameter change cascade: remove Maths → correct nodes flip
- [ ] Statistics bar updates correctly on cascade
- [ ] "+N more" expandable lists show full content when clicked
- [ ] Institution comparison shows govt vs private
- [ ] Source links open correct URLs
- [ ] Recovery route shown for closed nodes (filtered by budget)
- [ ] Back button works at every step
- [ ] Language toggle mid-journey preserves state
- [ ] Distress keyword in input → helpline shown
- [ ] AI failure → fallback within 5 seconds
- [ ] WhatsApp share generates correct formatted text
- [ ] Graduate stage → asks for 10th/12th history
- [ ] Goal conflict → resolver card shown
- [ ] No PII entry possible anywhere

### Manual — Mobile

- [ ] Cards layout scrollable at 375px, 390px
- [ ] No text overlap at 768px
- [ ] Language toggle accessible
- [ ] Expandable sections work with touch
