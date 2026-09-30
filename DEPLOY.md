# Chaarvee English Coach v3 — GitHub, Vercel and Supabase setup

## A. Update the existing GitHub repository

### Option 1 — replace the repository files from your computer

1. Download and unzip `chaarvee-english-coach-v3.zip`.
2. Open a terminal in the extracted project folder.
3. If the existing repo is already cloned, copy/replace the project files into that clone.
4. Run:

```bash
git status
git add -A
git commit -m "feat: add unlimited adaptive AI practice"
git push origin main
```

Vercel will normally create a new deployment automatically after the GitHub push when the repository is connected to the Vercel project.

### Option 2 — GitHub website upload

If you do not use Git locally:

1. Open your GitHub repository.
2. Choose **Add file → Upload files**.
3. Upload the contents of the extracted project folder, replacing the old files.
4. Commit directly to `main`.

For a Next.js repository, keep `package.json` at the repository root.

## B. Vercel environment variables

In Vercel:

**Project → Settings → Environment Variables**

Add:

```text
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-5-mini
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Use the OpenAI key only as `OPENAI_API_KEY`; never prefix it with `NEXT_PUBLIC_`.

For Supabase, the URL and publishable key are browser-safe when Row Level Security is correctly configured. Never put a Supabase secret/service-role key in a `NEXT_PUBLIC_*` variable.

After changing environment variables, redeploy the Vercel project.

## C. Create the Supabase project

1. Open the Supabase Dashboard.
2. Create a new project.
3. Open **SQL Editor**.
4. Open this project's `supabase/schema.sql`.
5. Paste the entire file into SQL Editor and click **Run**.

This creates:
- `profiles`
- `submissions`
- indexes
- Row Level Security policies
- a signup trigger that creates a parent profile

## D. Get the Supabase values

Open the Supabase project **Connect** dialog or API Keys settings.

Copy:

```text
Project URL → NEXT_PUBLIC_SUPABASE_URL
Publishable key → NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Do not put a secret/service-role key in the browser.

## E. Local development

Create `.env.local` in the project root:

```text
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5-mini
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Then:

```bash
npm install
npm run dev
```

## F. Verify the adaptive engine

1. Open Reading Lab.
2. Select a level/topic/type.
3. Click **Generate fresh reading**.
4. Submit a response.
5. Review the rubric scores.
6. Repeat with another exercise.
7. The lowest average rubric skill becomes the next personalized focus.
8. Generate another reading or writing task; the focus is sent to the AI generator.

## G. Important usage note

The content catalog is no longer fixed to four articles. Each generation creates a fresh original exercise. There is no application-level exercise count limit, but OpenAI API usage is still subject to your account's rate limits, quotas and billing/spend controls.

## H. Age-appropriate content

The generation prompts explicitly require original, school-appropriate content and exclude sexual content, graphic violence, self-harm, suicide, drugs, profanity, pornography, gore/horror, extremist propaganda and partisan political persuasion. The app is designed for a young Grade 8 learner, but generated content should still be reviewed occasionally by a parent.
