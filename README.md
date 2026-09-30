# Chaarvee English Coach v3

A Vercel-ready Next.js app for independent Grade 8 English practice.

## v3 capabilities

- Unlimited-on-demand AI-generated reading exercises
- Unlimited-on-demand AI-generated writing prompts
- Adaptive difficulty: Grade 8 → Grade 8+ → Grade 9 → Grade 9+ → AP/IB Foundation
- Personalized skill targeting from recent rubric scores
- Age-appropriate original content generation
- Reading comprehension, inference, vocabulary and evidence questions
- Writing evaluation using an 8-category /40 rubric
- Revision and re-evaluation workflow
- Local progress history
- Supabase-ready schema for cloud persistence/authentication

"Unlimited" means the application does not have a fixed content catalog; actual usage remains subject to your OpenAI account's quotas, rate limits and spend controls.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Required AI environment variables

```text
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5-mini
```

## Supabase

See `DEPLOY.md` for the exact setup steps and `supabase/schema.sql` for the database/RLS schema.
