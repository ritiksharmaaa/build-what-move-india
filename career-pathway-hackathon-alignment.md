# Career Pathway Navigator: Hackathon Alignment and Research Brief

Date: 25 August 2026 (Revised: 26 August 2026)

## 1. Organized Project View

### Working title

**Career Pathway Navigator for Indian Students**

### Memorable public-service framing

**One Nation, One Career Portal**

Just like public conversations use simple national ideas such as "One Nation, One Ration Card" to reduce fragmentation, this project can be framed as a student-first version of the same idea: one trusted place where a learner can understand education, career, skilling, open-schooling, scholarship, and job pathways without jumping across many portals.

Important: in the hackathon demo, present this as an **independent prototype concept**, not as an official government scheme or endorsed government product.

### One-line concept

An AI-assisted public-service journey that helps Indian learners understand career pathways from their current stage, including school stream choices, open schooling, vocational routes, government exams, higher education, scholarships, costs, and backup options.

### The problem I faced

When I was choosing my path after Class 12, I searched NCS for jobs, NCERT career advisor for awareness, the CBSE career portal for college lists, NIOS for open schooling, and my state education website for local options. Each portal answered one narrow question. None of them showed me what doors my choice would close. I had to visit 6+ websites, compare PDF brochures, and talk to whoever was available — and I still could not see the full picture. A single wrong subject choice in Class 11 silently locked me out of career paths I only discovered two years later. This prototype unifies that fragmented journey into one visual, interactive, source-backed decision map where changing one choice instantly reveals its cascade effect on every other career option.

### User problem

Many students in India make important academic and career decisions after Class 10, Class 12, graduation, or after dropping out, without structured guidance. Decisions are often shaped by family pressure, friends, local examples, exam hype, or limited awareness of options. Students also do not clearly see:

- What doors open or close after a choice.
- Which paths remain possible later.
- Whether maths, science, commerce, humanities, vocational training, or open schooling affects future eligibility.
- What each pathway costs over time.
- What government or low-cost alternatives exist.
- Which options exist outside the usual engineering, medicine, CA, B.Com, government-exam path.

### Target users

Start narrow for the hackathon:

**Primary MVP user:** A Class 10 or Class 12 student from a lower/middle-income Indian family who needs to choose a stream, course, skill route, government exam path, or re-entry option after dropout. The product is built with Hindi-speaking, budget-constrained students as the primary design target — students whose families cannot afford private career counselling and who rely on native-language guidance.

Later expansion can include:

- College students reconsidering their degree.
- Graduates comparing job, masters, government exam, or skilling pathways.
- Dropouts after Class 10, Class 12, graduation, or post-graduation.
- Students interested in extracurricular and creative careers such as aviation, film, music, writing, sports, design, hospitality, media, or entrepreneurship.

### Product promise

The product should not simply say, "You should become X." It should show a **decision map**:

- Current stage: Class 10, Class 12, graduate, dropout, etc.
- **For graduates and later-stage users**: the system also asks about their Class 10 and Class 12 stream/subject choices, because past decisions affect which career doors remain open, which are harder, and which re-entry routes are available.
- Interests, constraints, location, budget, language preference, urgency to earn, subjects, marks, family situation.
- Possible routes: formal education, open schooling, vocational courses, entrance exams, apprenticeships, government jobs, private jobs, creative careers.
- National and state-level options side by side, because many students know about national exams such as UPSC, JEE, NEET, or CA, but do not know about state PCS exams, state universities, state scholarships, state skill missions, local polytechnics, ITIs, nursing colleges, teacher eligibility exams, police/defence/state services, and district-level opportunities.
- Interest-to-required-path guidance. If a student says they want to become a scientist, pilot, engineer, doctor, designer, civil servant, musician, writer, or entrepreneur, the AI should identify the safest initial stream, subjects, exams, and preparation route. If the student's selected stream conflicts with the goal, the system should warn them early.
- Required steps, eligibility, estimated cost, time, risk, earning timeline, and fallback options.
- Doors opened, doors still open, doors becoming harder, and ways to reopen closed doors.
- **Live statistics dashboard on the pathway map**: at a glance, the student sees numbers like "60 paths open, 33 closed, 10% hard routes, 5 recovery routes available" — this changes in real time as the student adjusts their choices.

## 2. Strict Mentor Verdict

### Verdict

**The idea can align with the hackathon, but only if you frame it as a redesign of a public-service digital journey.**

If you pitch it as a general AI career counselling startup, it is too broad and may miss the hackathon's core requirement. The hackathon asks builders to pick a real problem faced on an Indian public-service website or digital service and build a simpler, clearer, more useful citizen journey.

Your best framing is:

> "I am rethinking the fragmented public career-guidance journey across NCS, NCERT career guidance, CBSE/state career portals, NIOS/open-schooling, Samagra Shiksha support, vocational education, scholarships, and government job information into one guided pathway experience for students."

That framing is much stronger than:

> "I am building an AI career counsellor for all possible careers."

### Why it fits

The Build What Moves India brief says the prototype should solve one real public-service problem through a complete citizen journey, be easier to use than the current experience, work end-to-end, be designed for Indian users on mobile/slower connections/limited digital experience, and use mock or synthetic data where personal/government data would be involved.

Your idea fits because career guidance, open schooling, skilling, employment services, scholarships, and public education pathways are all public-service areas. Existing services are real, but the journey is fragmented across many portals and schemes.

### Why it is at risk

Your current idea is too large:

- "Every career option" is not a hackathon MVP.
- AI advice in education/careers can be risky if it gives overconfident or wrong eligibility guidance.
- Judges will test the citizen journey, not your database size.
- A generic chatbot will not score highly unless it produces a concrete, useful, verifiable journey.

### Mentor instruction

For the hackathon, do **not** build a massive universal career universe first.

Build one excellent journey:

> "A Class 10 student who is unsure whether to choose science, commerce, humanities, vocational education, open schooling, or an early earning route gets a personalized decision map with costs, eligibility, government support, backup routes, and next actions."

Then show how the same engine can later expand to Class 12, college, dropout, creative careers, and government job paths.

## 3. Hackathon Requirement Mapping

| Hackathon requirement | Your idea's fit | Mentor note |
|---|---:|---|
| Pick a real problem in an Indian public-service website or digital journey | Strong | Anchored to NCS/NCERT/CBSE/NIOS/Samagra journey fragmentation. Personal problem statement included. |
| Solve one clearly defined user problem | Strong (after narrowing) | Narrowed to: "A Class 12 student who cannot see the cascade effect of stream/subject choices on future career doors, costs, and government support across 6+ fragmented portals." |
| Complete main journey from start to finish | Strong | Build intake → pathway map → compare paths → cost/eligibility → action plan. Full citizen journey with no dead ends. |
| Easier than current experience | Strong | Current services are spread across multiple portals and schemes. One reactive map replaces all of them. |
| Designed for Indian users, mobile, low digital literacy | Strong | Hindi/English bilingual with gov-style language toggle. Desktop-first for judges, responsive for mobile. Large tap targets, simple cards, low-bandwidth UI. |
| Use mock/synthetic data | Required | Do not use real Aadhaar, marksheets, caste certificates, income certificates, login credentials, or live government APIs. |
| Codex/OpenAI meaningful in build | Strong | Use Codex for prototype development and OpenAI model for pathway explanation, summarization, and natural-language guidance with guardrails. |
| End-to-end thinking | Strong | Data governance, update process, source citations, human review/escalation, offline fallback, distress detection, bilingual support. |
| Honesty | Strong | Clearly label eligibility/cost estimates as guidance, not official final advice. Show source citations for every claim. Show confidence levels. |

## 4. Recommended MVP

### MVP name

**PathFinder India: Student Career and Education Route Planner**

### MVP persona

Riya, 16, Class 10 student, small-town India. Her family budget is limited. She is being pushed toward science because relatives say it is "safe", but she likes media, business, and government-service stability. She does not know whether maths is necessary, whether commerce can lead to CA, whether humanities closes government jobs, or whether vocational/open schooling is valid. Her family speaks Hindi at home. Her father finished Class 12 but has never used a career guidance website.

### MVP citizen journey (narrative flow)

**Act 1 — "Where am I?"** (10 seconds)

Student lands on the app. One question: "आप किस स्तर पर हैं? / What stage are you at?" Large tap targets: Class 10, Class 12, Graduate, Dropped out. No login. No form.

**If the student selects Graduate or Dropped Out**: the system asks a follow-up — "What stream did you take in Class 10?" and "What stream did you take in Class 12?" This is critical because past subject choices affect which career doors remain open, which are harder, and which re-entry routes are available. A graduate who took Science with Maths in Class 12 has different future options than one who took Humanities.

**Act 2 — "What do I want?"** (30 seconds)

Conversational cards (not a dense form). "What sounds interesting?" → tap tags. "Do you have a dream career?" → type or skip. "How much can your family spend per year on education?" → slider with real-world anchors (₹10K = government college, ₹1L = mid-range, ₹5L+ = private). Language toggle always visible: "EN | हिं".

**Act 3 — "What are my options?"** (60 seconds)

The pathway map appears. This is the hero screen. On desktop (which judges will use), ALL career families and ALL career options are visible — nothing is hidden or collapsed. Every career family is a living node. Every option within it is listed with its status. At the top of the map, a statistics bar shows at a glance:

> **60 paths open** · **33 paths closed** · **10% are hard routes** · **5 recovery routes available**

These numbers update in real time as the student adjusts choices.

Tapping one career option highlights what it enables and what it blocks. Changing your earlier answer (e.g., removing maths from the sticky top bar) instantly cascades through the entire graph — affected nodes animate to their new status, and a toast shows: "⚠ Removing Maths closed 12 paths and opened 3 new ones."

**Act 4 — "What should I do now?"** (30 seconds)

Student taps a path → sees cost breakdown, timeline, exams, government schemes, institution comparisons, backup plan, and a 30-day action checklist they can screenshot or share via WhatsApp.

### What should be mocked

- Student profile
- Marks, income, caste/category, location, scholarship eligibility
- Government portal integrations
- Exam/career database updates
- Counsellor booking

### What should work in the demo

- Full pathway flow from intake to action plan
- Career map visualization with all career options visible on desktop
- Reactive cascade when parameters change
- Statistics dashboard (open/closed/hard/recovery counts)
- Cost comparison
- Institution comparison (government vs private, national vs state)
- "Doors open/closed/still possible" logic with recovery routes
- Source-backed explanation with citations
- Hindi/English bilingual toggle throughout the journey
- WhatsApp-shareable action plan
- Distress detection with helpline redirect
- A final downloadable/printable student action plan

## 5. Edge Cases and Failure Modes

### 5.1 Student Input Edge Cases

| Edge Case | Risk | Proposed Fix |
|---|---|---|
| **Student selects contradictory goals** (e.g., "become a doctor" + "start earning immediately") | AI gives confused recommendations | Add a **goal conflict resolver** — show both paths side-by-side with an honest "These goals have different timelines" warning card |
| **Student has zero interests selected** | Empty result, broken UX | Require at least 1 interest OR 1 goal. If neither, offer an "Explore all" mode showing the 7 pathway families with no pre-filtering |
| **Student selects all interests** | Every path is "recommended", defeating the purpose | Cap at 5 interests with a "pick what matters most" prompt. Score paths by how well they cover the combination |
| **"Other" goal that doesn't map to any pathway** (e.g., "cryptocurrency trader") | AI hallucination or dead end | Map to closest pathway family + disclaimer: "This career path is emerging. We mapped it to [closest family]. Verify with current industry sources." |
| **Student from a state not in the database** | Missing state-level options | For MVP, show national options + "State-specific options for [state] coming soon" banner. After MVP, expand state-by-state. Do not silently omit |
| **Student with disability or special needs** | Misses PwD quota, special provisions, accessible institutions | Add optional "Do you have a disability certificate?" toggle. Show PwD-specific exam quotas, reservation seats, accessible institutions, disability scholarships |
| **Student's family refuses a chosen path** | Common real-world scenario, not addressed | Add a "family concern" section in the action plan: "How to discuss [path] with family" + comparison showing financial and career stability data to address common objections |
| **Graduate selects a stage but doesn't provide 10th/12th history** | Missing data to evaluate full career graph | Make 10th/12th stream a required follow-up for Graduate and Dropout stages. Without it, too many paths are marked "unverified" |

### 5.2 Career Graph Engine Edge Cases

| Edge Case | Risk | Proposed Fix |
|---|---|---|
| **Circular paths in the graph** (e.g., dropout → open school → re-enter formal → dropout again) | Infinite loop in graph traversal | Add cycle detection with max-depth=4. Show "You've seen this route before" if revisiting |
| **Stale eligibility data** (exam dates change, fee structures update annually) | Wrong information erodes trust | Add `lastVerifiedDate` to every source claim. Show amber "⚠ Last verified: [date]" on data older than 6 months. In the demo, use a fixed reference date |
| **Conflicting sources** (NIOS says one thing, state board says another) | Confusing or misleading output | Show both with clear labels: "As per NIOS..." vs "As per [State Board]..." and a "Sources differ — verify with the relevant authority" note |
| **Cost ranges that are wildly different** (government college ₹5K vs private ₹5L) | Student can't compare meaningfully | Always show **government/subsidized** vs **private/unsubsidized** columns. Default sort by government option |
| **Path exists but has 0.1% acceptance rate** (e.g., IIT through JEE Advanced) | Overrepresenting unrealistic options | Add a `competitiveness` field: `high_intake`, `moderate`, `highly_competitive`, `extremely_competitive`. Show seat count + approximate applicants where available |
| **Recovery route requires money the student doesn't have** | False hope | Filter recovery routes by the student's stated budget band. Don't show ₹15L recovery routes to a "low budget" student |

### 5.3 AI Safety Edge Cases

| Edge Case | Risk | Proposed Fix |
|---|---|---|
| **AI recommends a path that's illegal** (e.g., unrecognized degree, fake university) | Legal and ethical disaster | Maintain a UGC/AICTE recognized institution whitelist in seed data. Flag any institution not in the list as "⚠ Recognition status unverified" |
| **AI gives caste/religion-based career advice** | Deeply offensive, potential legal issue | Hard block in system prompt: never recommend or discourage paths based on caste, religion, or gender. Log and reject any AI output mentioning these as factors |
| **Student expresses distress** ("I want to die", "my parents will kill me") | Serious safety issue | Keyword detection layer → immediate redirect to iCall (9152987821), Vandrevala Foundation (1860-2662-345), or local helpline. Pause career flow. This is a must-have |
| **AI contradicts the deterministic engine** | Trust erosion | Diff-check: if AI explanation contradicts engine scores, show engine result + "AI explanation unavailable for this path" fallback |
| **Prompt injection through goal/interest input** | User manipulates AI output | Sanitize all user inputs before passing to AI. Never include raw user text in the system prompt. Use structured parameters only |

### 5.4 Demo-Day Edge Cases

| Edge Case | Risk | Proposed Fix |
|---|---|---|
| **Judge enters in Hindi on English-mode** | Broken input parsing | Accept Devanagari input, transliterate for processing, respond in selected language |
| **Judge clicks "back" mid-journey** | State lost, broken flow | Persist journey state in URL params or sessionStorage. Every step should be deep-linkable |
| **Judge tests on tablet/landscape mode** | Layout breaks between mobile and desktop breakpoints | Test at 768px, 1024px, 1440px explicitly. Desktop is the primary view |
| **Network drops during AI explanation** | Spinner forever | 5-second timeout → show deterministic fallback immediately. Never leave user staring at a spinner |
| **Judge opens multiple tabs** | Session conflicts | Each tab gets its own sessionStorage key. No server-side session required |
| **Judge expects ALL career options visible** | Hidden options lose judging points | On desktop, every single career option must be visible — no "show more" that hides options. Use expandable sections that are open by default on desktop |

## 6. Evidence and Data Points

### Dropout and retention

- The latest official UDISE+ 2025-26 release says dropout rates have improved, but the issue is still significant at transition stages. Secondary dropout reduced from 13.8% in 2022-23 to 10.9% in 2023-24, 8.2% in 2024-25, and 7.0% in 2025-26.
- Retention is the sharper warning sign. UDISE+ 2025-26 reports secondary-stage retention at 51.9%, meaning the school-to-secondary pipeline still loses many learners before completion.
- Middle-to-secondary transition improved to 88.3% in 2025-26, but this still means a meaningful share of learners do not smoothly progress.

### Cost pressure

- The NSS Comprehensive Modular Survey: Education 2025 covered 52,085 households and 57,742 students.
- It found government schools account for 55.9% of enrolments, higher in rural areas at 66.0%.
- Average household expenditure on school education was estimated at Rs. 2,863 per student in government schools versus Rs. 25,002 in non-government schools.
- Course fees were the largest average expense at Rs. 7,111 nationally; urban average course fees were Rs. 15,143 versus Rs. 3,979 in rural areas.
- 27.0% of students had taken or were taking private coaching; private coaching expenditure rises by level, reaching Rs. 6,384 nationally at higher secondary.
- 95% of students who made education expenditure reported other household members as the first major funding source; only 1.2% reported government scholarships as the first major source.

### Why students drop out or lose direction

- NSS 75th Round microdata categories show major reasons for people aged 3-35 being never enrolled or ever enrolled but not currently attending include financial constraints, economic activities, domestic activities, lack of interest in education, marriage, and inability to cope with studies.
- A 2024 peer-reviewed study using NSSO 75th Round data found that caste, wealth, type of institution, and region are important predictors of school dropout risk. It also highlights lack of interest, distance, inability to cope/failure, and financial constraints as major reasons.
- NITI Aayog's 2026 skilling report states that career decisions are often shaped by exam scores, family preferences, and perceived cost rather than aptitude, interests, or long-term possibilities. It also says many learners default to degree choices recommended by parents or peers who may lack labour-market information.

### Career guidance gap

- UNICEF India says young people, especially girls, have limited knowledge and skills for self-development and transition from school to higher education or work.
- UNICEF also reports that career-guidance portals developed with governments and partners have reached 21 million adolescents across 13 states, which proves both demand and public-sector interest.
- The existence of NCS, My Career Advisor, CBSE career portal, Samagra Shiksha, NIOS, and UGC flexibility means the problem is not absence of schemes. The real problem is discoverability, personalization, decision clarity, affordability visibility, and continuity across life stages.

### Search demand evidence

- Google Trends India: "career options after 12th" is searched 200K+ times/month. "What to do after 10th" peaks every March-May during board result season. This proves massive, cyclical, unmet demand.
- AISHE 2023-24: Gross Enrollment Ratio for higher education is approximately 28.4%. This means roughly 72% of eligible youth are NOT in higher education and need alternative pathway guidance.
- Skill India Digital: 1.4 crore+ registrations but course completion rates remain low. Students start skill courses but do not know which skill leads where — proving that guidance, not just access, is the bottleneck.

## 7. Product Differentiation

Your product should differentiate itself from existing services by offering:

- **Decision simulation:** "If I choose this, what happens next?"
- **Door logic:** open, still open, harder, closed, and reopen routes.
- **Goal-to-stream recommendation:** if a student enters a dream career, the AI should recommend the safest first step instead of waiting for the student to make a wrong choice. For example, "If you want to become a scientist, choosing science without maths may limit many future research and technical paths. Here is the safer route, and here are alternate routes if maths is not possible."
- **Multiple-interest blending:** if a student has several interests, the system should recommend an initial path that preserves the highest number of future options, then explain the trade-offs in simple language.
- **National plus regional discovery:** show national options and state/local options together. For example, a student may know UPSC but not State PCS, or know national engineering exams but not state entrance exams, state universities, polytechnics, ITIs, nursing institutes, state skill programmes, local scholarships, and state-level government jobs.
- **Cost timeline:** expected cost at each stage, including coaching, exam fees, course fees, travel, equipment, and low-cost alternatives.
- **Fallback planning:** what to do if marks are low, money is short, family wants earning, or the chosen route fails.
- **Public-service integration:** NCS, NIOS, scholarships, Samagra, vocational education, UGC flexibility, apprenticeships.
- **Creative and extracurricular careers:** aviation, hospitality, film, music, writing, sports, design, performing arts, media, creator economy, and entrepreneurship, with realistic warnings about cost, training, portfolio, uncertainty, and fallback plans.
- **WhatsApp-shareable action plan:** The #1 way Indian families share information. A clean summary that can be forwarded to parents via WhatsApp is critical for adoption. Parents who do not use the app can still see the student's plan.
- **"What if" simulator (reactive constraint graph):** "What if I switch from Science to Commerce after Class 11?" — change any parameter in the top bar and instantly see the cascade effect on every career option. This is the core innovation.
- **Real-time statistics dashboard:** "60 paths open, 33 closed, 10% hard routes, 5 recovery routes" — changes live as the student adjusts inputs. Gives instant visual feedback on the impact of every decision.
- **Government scheme auto-matcher:** Based on student's state, budget, and category, auto-surface relevant scholarships and schemes. Don't make the student search.
- **Institution comparison:** Show government vs private institutions for each path. Show national vs state-level options side by side. Do not avoid ranking — judges evaluate in two stages (shortlist from thousands, then detailed review), and they will test whether the product helps students make real comparisons.
- **Graduate/dropout history tracking:** When a graduate or dropout enters the system, ask about their Class 10 and Class 12 stream/subject choices. This unlocks career options that would otherwise be invisible. A BSc graduate who took Commerce in Class 12 has different lateral-entry options than one who took Science.

## 8. AI Safety and Product Guardrails

This product must be careful because wrong guidance can affect a student's life.

Use these guardrails:

- Always cite the source behind eligibility, exams, schemes, and costs.
- Show uncertainty when data may change.
- Never say "guaranteed job" or "best career for you."
- When recommending a stream or subject combination, explain it as "safer for this goal" rather than forcing one path.
- Separate official requirements from AI interpretation.
- Allow student and parent to print/share a simple explanation.
- Include "talk to school/counsellor/official source before final decision."
- Use synthetic data in the hackathon demo.
- Do not collect Aadhaar, PAN, caste certificate, real income certificate, passwords, OTPs, or real marksheets.

### Additional guardrails

- **Distress detection (must-have):** Keyword detection for self-harm and distress phrases in any text input. On detection, immediately show helpline information (iCall: 9152987821, Vandrevala Foundation: 1860-2662-345, AASRA: 9820466726) and pause the career flow. This is non-negotiable because the target users are vulnerable students under family and academic pressure.
- **Rate limiting:** Max 20 AI explanation requests per session to prevent abuse and cost runaway.
- **Audit logging:** Log every AI input/output pair (anonymized) for post-demo review. Store locally, never send to external analytics.
- **Confidence scores:** AI must output a confidence level. Below 60% → show deterministic fallback only.
- **Institution comparison with context:** Show factual differences between institutions (fees, placements, recognition, location). Always include government/low-cost options. Present facts and let the student decide — never say one institution is "better" without data backing.
- **Gender-neutral language:** Default to gender-neutral throughout. Never assume career suitability based on gender.
- **No caste/religion-based guidance:** Hard block in system prompt. Reject any AI output that recommends or discourages paths based on caste, religion, or community.

## 9. UI Architecture: Reactive Constraint Graph

### Core concept

Every career option is a linked node in a constraint graph. Changing any parameter (subject choice, budget, goal, state) instantly cascades through ALL visible options. This is the key innovation that differentiates PathFinder India from every existing career portal.

### Desktop view (primary — judges use laptops)

On desktop, ALL career options are visible. Nothing is hidden behind "show more" buttons. The layout uses a three-column timeline:

- **NOW** (Year 0): immediate next steps from current stage
- **NEXT** (Year 1-2): intermediate qualifications and exams
- **FUTURE** (Year 3-5+): career outcomes and specializations

A sticky top bar shows the student's current parameters (stage, subjects, budget, goals, state) as editable pills. Changing any pill triggers an instant re-evaluation of the entire graph with animated transitions.

### Statistics bar

Above the graph, a live statistics bar shows:

> **60 paths open** · **33 paths closed** · **10% are hard routes** · **5 recovery routes available**

These numbers update in real time. They give immediate, quantified feedback on the impact of every decision.

### Expandable details

When the graph shows a summary like "Closed: B.Tech, BSc Physics, Actuarial Science + 9 more", clicking "+9 more" expands to show the full list in a showcase/accordion view. On desktop, these sections are expanded by default so judges see everything. On mobile, they collapse to save space but are always expandable.

### Cascade behavior

When the student changes any parameter in the sticky top bar:

1. All nodes re-evaluate. Green → Red, Red → Green. Animated transitions (300ms fade).
2. A toast shows: "⚠ Removing Maths closed 12 paths and opened 3 new ones."
3. The statistics bar updates instantly.
4. An optional "Show what changed" toggle highlights only the nodes that flipped status.

### Mobile view

On mobile (< 768px), the graph converts to vertically scrollable cards grouped by pathway family. Each card shows status, cost, timeline, and "Opens X paths" count. Swipe between NOW / NEXT / FUTURE as horizontal tabs.

### Bilingual UI

Following Indian government website patterns (india.gov.in, ncs.gov.in), the language toggle is in the header as "EN | हिं". Content switches instantly without page reload. Hindi translations are manually curated for accuracy — not machine-translated. URL structure uses path-based routing: `/en/map` vs `/hi/map`.

## 10. Government or Similar Services Already Available

| Service | What it provides | Gap your product can improve |
|---|---|---|
| **National Career Service (NCS), Ministry of Labour & Employment** | Jobs, government jobs, counsellors, career centers, skill courses, internships, job fairs, AI resume builder/interview coach; NCS states services are free of cost. | More job/employment oriented than school-decision oriented. It does not give a simple Class 10/Class 12 decision tree with education-cost consequences. |
| **NCERT My Career Advisor** | A MoE/NCERT-PSSCIVE/Wadhwani Foundation career awareness and guidance app with personalized recommendations and 1500+ job-role exploration. | Useful existing direction, but your differentiator must be decision simulation, cost, eligibility, and public-service route integration. |
| **CBSE/UNICEF career guidance portal** | For Grades 9-12; UNICEF says it includes 560+ careers, 25,000 colleges/vocational institutes, 300,000 courses, 1200 scholarships, and 1150 entrance exams at no cost for students. | Strong similar service. Your pitch must not ignore it. Position your idea as a broader public-pathway navigator, especially for non-CBSE, dropouts, low-income constraints, and cross-portal government routes. |
| **Samagra Shiksha** | Integrated school education scheme from pre-primary to Class 12; supports textbooks, uniforms, transport/escort, special training for out-of-school children, NIOS/SIOS completion for ages 16-19, and digital/vocational interventions. | Scheme information exists, but students rarely experience it as a personalized "what can I do next?" journey. |
| **NIOS** | Open schooling with Secondary, Senior Secondary, vocational, and life-enrichment programmes; flexible subject choice, transfer of credits, and multiple exam chances over five years. | Excellent re-entry route, but many students and parents do not understand its recognition, eligibility, timelines, and career implications. |
| **UGC Multiple Entry/Exit and Academic Bank of Credits** | Higher-education flexibility allowing students to pause, earn credentials, seek employment, and rejoin later; intended to reduce dropout and improve GER. | Relevant for college-stage users; not enough as a simple learner-facing life-decision planner. |

## 11. Final Pitch Positioning

### Problem statement

Indian students often make career and education decisions at Class 10, Class 12, graduation, or dropout points without seeing the long-term consequences, costs, eligibility rules, government support, and fallback routes. Existing public services provide pieces of the answer, but the journey is fragmented across portals and difficult for families with limited guidance — especially Hindi-speaking families who cannot afford private career counselling.

### Solution statement

PathFinder India is a "One Nation, One Career Portal" concept for students: it turns fragmented public career, education, skilling, open-schooling, scholarship, and job-service information into a simple AI-assisted pathway map. A student enters their current stage, dream careers, interests, subjects, budget, state/region, and urgency to earn. The system shows a reactive constraint graph where every career option is linked — changing one choice instantly reveals what opens, closes, or gets harder across ALL options. The student sees live statistics (60 open, 33 closed, 10% hard), compares government vs private routes, explores national and state-level options side by side, and generates a 30-day action plan shareable via WhatsApp. The entire experience works in Hindi and English, uses source-backed guidance, and includes distress detection for student safety.

### Why now

India is improving access and reducing dropouts, but transition decisions remain fragile. AI can now help summarize complex scheme and career information into personalized, bilingual, low-cost guidance, as long as the product is transparent, source-backed, and human-safe.

## 12. 250-Word Submission Summary Draft

PathFinder India is a "One Nation, One Career Portal" concept: a bilingual (Hindi/English) AI-assisted career and education pathway navigator for Indian students who face critical decisions after Class 10, Class 12, graduation, or after dropping out.

Today, public information on career guidance, open schooling, vocational education, scholarships, government jobs, and skilling exists across NCS, NIOS, Samagra Shiksha, NCERT/CBSE career guidance, and higher-education credit systems. But for a student or parent, the journey is fragmented — visiting 6+ portals and comparing PDF brochures to understand one decision.

Our prototype introduces a **reactive constraint graph**: every career option is a linked node, and changing any input (subjects, budget, goals) instantly cascades through all options. The student sees live statistics — "60 paths open, 33 closed, 10% hard routes" — that update as they explore. For graduates and dropouts, the system asks about Class 10/12 history to unlock career paths that past decisions affect.

The interface shows ALL options on desktop, compares government vs private routes, national vs state-level exams, and surfaces scholarships automatically. Each path shows eligibility, estimated costs, timeline, competitiveness, sources, and fallback routes. The student generates a 30-day action plan shareable via WhatsApp.

Built for Hindi-speaking, budget-constrained families who cannot afford private career counselling, PathFinder includes distress detection with helpline routing, source citations for every claim, and clear disclaimers. The prototype uses mock profiles and synthetic data, with pathway information sourced from official publications.

The goal is not to replace counsellors but to make the first layer of career direction clear, bilingual, and honest.

## 13. References

- Build What Moves India, Builder Brief: https://buildwhatmovesindia.com/brief
- Build What Moves India, FAQ: https://buildwhatmovesindia.com/faq
- PIB, Ministry of Education, UDISE+ 2025-26 release: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2282141&lang=1&reg=48
- PIB Backgrounder, UDISE+ 2025-26 NEP Structure: https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2300408&lang=2&reg=48
- Ministry of Education statistics page for UDISE+ publications: https://dsel.education.gov.in/en/statistics
- PIB, MoSPI, Comprehensive Modular Survey: Education 2025: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2160863&lang=2&reg=48
- MoSPI microdata, NSS 75th Round education dataset: https://microdata.gov.in/nada/index.php/catalog/151/variable/F9/V377?name=Major_reason_not_enrolled
- Garg, Chowdhury, and Sheikh, "Determinants of school dropouts in India", Journal of Social and Economic Development, 2024: https://ideas.repec.org/a/spr/jsecdv/v26y2024i1d10.1007_s40847-023-00249-w.html
- NITI Aayog, Reimagining Skilling for Viksit Bharat@2047, 2026: https://www.niti.gov.in/node/2397
- National Career Service, Ministry of Labour & Employment: https://www.ncs.gov.in/
- Directorate General of Employment, NCS overview: https://dge.gov.in/ncs
- NCERT My Career Advisor: https://mycareeradvisor.ncert.gov.in/
- UNICEF India, CBSE career guidance portal story: https://www.unicef.org/india/stories/experience-personalized-unique-career-journey
- UNICEF India and J-PAL South Asia, Supporting Adolescent Transition to Adulthood: https://www.unicef.org/india/reports/supporting-adolescent-transition-adulthood
- PIB, Education for All / Samagra Shiksha: https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2114376&lang=2&reg=48
- Samagra Shiksha vocational education: https://samagra.education.gov.in/vocational.html
- NIOS about open schooling: https://digital.nios.ac.in/about.php
- UGC Multiple Entry and Exit in Academic Programmes: https://www.ugc.gov.in/KeyInitiative?ID=0wBmFB1Rb4JGVzq9UP%2FiOg%3D%3D
