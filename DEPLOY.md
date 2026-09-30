# Vercel deployment
1. Create a GitHub repository and push this folder.
2. Import the repository into Vercel as a Next.js project.
3. Add `OPENAI_API_KEY` as a Vercel environment variable. Optionally add `OPENAI_MODEL`.
4. Optional: create a Supabase project, run `supabase/schema.sql`, then add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Deploy.

Important: never put OPENAI_API_KEY in client-side code.

The current UI is usable without Supabase and stores progress in the browser. The supplied schema is the foundation for cloud persistence and authentication in the next hardening step.
