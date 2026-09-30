# Chaarvee English Coach v2
Vercel-ready Next.js app for an age-appropriate Grade 8–9 reading and writing coach.

## Features
- Student dashboard
- Parent/student mode UI
- Age-appropriate built-in reading library
- Reading comprehension + evidence-based response
- Writing prompts from Grade 8 through Grade 9 bridge
- Server-side OpenAI evaluation API
- 40-point rubric and revision-oriented coaching
- Local progress storage out of the box
- Optional Supabase schema for cloud persistence/auth

## Run
npm install
npm run dev

## Environment variables
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5-mini
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

The app works without Supabase; it uses localStorage. The AI evaluator requires OPENAI_API_KEY.

## Vercel
Import this repo, add environment variables, and deploy.
