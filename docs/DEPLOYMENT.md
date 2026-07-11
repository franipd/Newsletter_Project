# Deploying The Daily Stack to Vercel

A step-by-step guide for a non-engineer. Total time: ~20 minutes. No terminal required except step 1.

**Security rule for every step:** the Supabase URL and anon key go ONLY into Vercel's environment variable settings and your local `.env.local`. Never paste them into code, commit them to git, or share them in chat/screenshots. The anon key is designed to be public-facing, but treat it carefully anyway; never expose the `service_role` key anywhere.

---

## Part 1 — Push the code to GitHub

Vercel deploys from a git repository. This app lives at [github.com/franipd/Newsletter_Project](https://github.com/franipd/Newsletter_Project). If your latest changes are already pushed, skip to Part 2.

```bash
git add -A
git commit -m "Prepare The Daily Stack for Vercel deployment"
git push
```

Before pushing, confirm no secrets are staged:

```bash
git status              # .env.local must NOT appear here
git diff --cached | grep -iE "supabase.*key|anon|service_role"   # should print nothing
```

---

## Part 2 — Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → sign in → **New project**
2. Name: `daily-stack` (any name works). Choose a region near your readers. Set a strong database password (Supabase stores it; you won't need it for this app).
3. Wait ~2 minutes for the project to provision.
4. Open **SQL Editor** (left sidebar) → **New query** → paste the entire contents of [`supabase/schema.sql`](../supabase/schema.sql) → **Run**. You should see "Success".
5. New query again → paste the contents of [`supabase/seed.sql`](../supabase/seed.sql) → **Run**. This inserts Edition #1 with its 10 stories.
   - If a "Potential issue detected" dialog warns about a table called `usage` without Row Level Security, that's a false positive — the scanner matched the phrase "into usage-based" inside a story headline. seed.sql creates no tables (RLS is already enabled by schema.sql). Click **Run without RLS**.
6. Verify: **Table Editor** → `editions` should show 1 row, `stories` should show 10 rows.
7. Get your credentials: **Project Settings → API Keys**. Copy two values:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **Publishable key** (starts with `sb_publishable_`; older projects show a legacy "anon" key starting with `eyJ` — either works)

   Never use the **secret key** (`sb_secret_`, formerly `service_role`) — this app never needs it, and it must never leave Supabase settings.

---

## Part 3 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → sign in (easiest with your GitHub account) → **Add New… → Project**
2. **Import** the `Newsletter_Project` repository. (It's private — Vercel will ask for GitHub access the first time.)
3. Framework Preset should auto-detect **Next.js**. The app is at the repo root, so leave Root Directory and build settings as default.
4. Expand **Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Project URL from Part 2 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key from Part 2 |

5. Click **Deploy**. First build takes 1–2 minutes.
6. Open the deployment URL. You should see Edition № 1 dated June 18, 2026 — now served from Supabase, not seed data.

If you skip step 4, the site still deploys and shows the built-in seed data — same content, just not database-backed.

---

## Part 4 — Verify

- [ ] Front page shows "Edition № 1" with a date and exactly 10 stories in 5 sections
- [ ] Section nav links scroll to the right section
- [ ] "Read source ↗" links open in a new tab
- [ ] To confirm Supabase is live (not seed fallback): edit a headline in the Supabase Table Editor, redeploy or wait for revalidation, and check it appears on the site. Then edit it back.

---

## Publishing future editions

Insert a new row in `editions` (next date + edition number) and 10 rows in `stories` via the Supabase Table Editor or SQL. The site always shows the most recent edition automatically.

If you work on this project through the course repo's Claude Code setup, the `/publish-edition` command drafts the SQL for a new edition. Review every generated SQL statement before running it in Supabase.

## Troubleshooting

- **Build fails on Vercel** — check the build log; run `npm run build` locally first to reproduce the error.
- **Site shows the old June 18 seed edition after adding new data** — the page may be statically cached. Trigger a redeploy (Vercel → Deployments → ⋯ → Redeploy).
- **Blank/error page** — check the env variable names are exactly `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (typos silently fall back to seed data; wrong values can error).
