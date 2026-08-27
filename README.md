# PathFinder India

**Student Career and Education Route Planner**

> ⚠️ **Independent Hackathon Prototype** — This is NOT an official government product. All data is synthetic. Guidance shown is for exploration only — verify with official sources before making decisions.

## What is this?

PathFinder India is a bilingual (Hindi/English) career pathway navigator that turns fragmented public career-guidance information into one interactive decision map. A student enters their stage, interests, goals, and budget — and instantly sees which career doors their choices open, close, or make harder.

The core innovation is a **reactive constraint graph**: changing any parameter (removing Maths, lowering budget, changing goals) instantly cascades through ALL career options with animated transitions and live statistics.

## Built for

- Hindi-speaking, budget-constrained students from lower/middle-income families
- Students at Class 10, Class 12, Graduate, or Dropout decision points
- Families who cannot afford private career counselling

## Tech Stack

- **Framework**: Next.js 15 (App Router, React Server Components)
- **Language**: TypeScript strict mode
- **Database**: SQLite via Drizzle ORM
- **Bilingual**: `next-intl` with path-based routing (`/en/`, `/hi/`)
- **UI**: Tailwind CSS 3, Shadcn UI primitives
- **AI**: OpenAI (structured output with guardrails)
- **Graph**: Deterministic directed pathway graph with dagre layout
- **AI Fallback**: Built-in Bring-Your-Own-Key (BYOK) system. If the server's OpenAI key is missing or exhausted, the UI prompts the user to securely enter their own API key and endpoint (supports OpenAI, Groq, OpenRouter, etc.).

## Key Features

- 🔗 **Reactive Constraint Graph** — every career is linked; change one choice, see the cascade
- 📊 **Live Statistics** — "60 open, 33 closed, 10% hard routes" updates in real time
- 🇮🇳 **Hindi + English** — gov-style bilingual with manual translations
- 💰 **Government vs Private** — always shows the affordable option first
- 📱 **WhatsApp Share** — action plan shareable with family
- 🛡️ **Safety** — distress detection, source citations, no PII collection

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Mock Data Disclosure

This prototype uses synthetic data. The following are mocked:
- Student profiles and inputs
- Scholarship eligibility calculations
- Government portal API integrations
- Counsellor booking

The following use real, publicly available data:
- Career pathway structures and eligibility rules
- Exam information (JEE, NEET, UPSC, UPPSC, CA, etc.)
- Cost ranges (from official fee structures)
- Source citations (all URLs are real government/official sources)

## License

Built for the Build What Moves India hackathon (August 2026).
# build-what-move-india
