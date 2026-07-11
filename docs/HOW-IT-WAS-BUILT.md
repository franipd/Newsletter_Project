# How The Daily Stack Was Built

The Daily Stack started as a course project in **Claude Code in Practice** (Maven) and evolved, in one extended build session, from a static prototype into a self-publishing, agent-run newspaper. This document records what was built, in what order, and why — both as project documentation and as a case study in building with AI agents.

## The idea

Tech news is scattered across Hacker News, X, Reddit, and a dozen newsletters, all wrapped in hype and infinite scroll. The Daily Stack is the opposite bet: **a finite daily edition**. Exactly ten curated stories in five sections, dated like a newspaper front page, with a defined end. The product hypothesis (see [prd.md](prd.md)) is that "you're done" is a feature people come back for.

## Build timeline

### 1. Prototype (initial commits)
- Next.js App Router + Tailwind + TypeScript scaffold
- Editorial newspaper styling: serif masthead, warm off-white paper, brick-red accent
- One hard-coded seed edition; Supabase client stubbed with automatic fallback

### 2. Database + deployment
- Supabase (Postgres) with two tables — `editions` (one row per day) and `stories` (ten per edition) — protected by row-level security: public read-only, writes only via the server-side secret key
- Deployed to Vercel from a standalone GitHub repo; environment variables kept strictly out of git (`.env.local` gitignored, secrets in Vercel settings only)
- Verified end-to-end by editing a headline in the database and watching it appear on the live site

### 3. The agent pipeline (the big step)
The publishing intelligence lives in a single API route, [`/api/publish`](../src/app/api/publish/route.ts), triggered by a daily Vercel Cron:

| Stage | Who | What |
|---|---|---|
| Curate | 5 parallel agents (fast model + web search) | Each searches the live web for its section and returns 4 candidate stories with real URLs |
| Edit | 1 editor agent (stronger model, schema-enforced JSON) | Picks the final 10 (exactly 2 per section), polishes copy, writes a first-person editor's note, lists what it rejected |
| Validate | Plain code, no model | Counts, section names against the DB constraint, https-URL checks, dedupe — with one automatic retry loop back through the editor |
| Publish | Supabase insert | One `editions` row + ten `stories` rows; idempotent per date; roll-back on partial failure |

Design principles: **cheapest model that can do each job** (mechanical gathering on a fast model, judgment on a stronger one, validation in deterministic code); **structured outputs** so the editor's JSON can't be malformed; **idempotency** so re-triggering is always safe. Cost is roughly 10–30¢ per edition.

- The front page got ISR (`revalidate = 300`), so new editions appear within 5 minutes with no redeploy
- The first fully hands-off edition (№2) published minutes after the pipeline shipped

### 4. Archive
- `/edition/[date]` routes plus an "Editions" strip showing the last 5 days — the finite newspaper gained a browsable past without becoming a feed

### 5. Liveness
Static-once-a-day wasn't enough, so four features added motion while honoring the finite identity:
- **Stop Press** — a separate agent route ([`/api/stop-press`](../src/app/api/stop-press/route.ts)) pinged every 2 hours by GitHub Actions (Vercel free-tier crons are daily-only). A deliberately high bar: live outages, actively exploited zero-days, frontier releases. One ribbon at a time, 6-hour expiry, most checks return "quiet"
- **The wire line** — the pipeline stopped throwing away its telemetry; each edition records agents/searches/candidates and the site types it out like a newsroom wire
- **Editor's note** — the editor agent's judgment call of the day, rendered as a signed pull-quote
- **Also considered** — the rejected candidates, proof that editing happened today

### 6. The "Wire Room" redesign
A full visual overhaul, referencing luxury-editorial sites (numbered sections, marquee text loops, progress counters):
- Ink-black full-bleed masthead with a clamp-scaled giant serif title
- A marquee streaming today's ten headlines with `+++` wire separators
- Numbered everything: sections 01–05 with ghosted giant numerals, stories 01–10, numbered sticky nav
- A reading meter that fills as you read and flips to **"DONE — GO BUILD"** at the end — the anti-infinite-feed promise turned into UI
- Two typographic voices: serif for journalism, monospace for everything the machine says
- All motion CSS-first and disabled under `prefers-reduced-motion`

## Architecture decisions worth remembering

- **Thin site, smart pipeline.** The website never calls an AI model; it renders rows. All intelligence runs at publish time, so the reader experience is fast, cheap, and can't fail at read time.
- **Two cron providers.** Vercel Cron handles the daily publish; GitHub Actions handles intraday stop-press checks — each doing what its free tier does well.
- **Validation is code, not a model.** Rules that can be checked deterministically (counts, enums, URL shape) are; the model retry loop only handles what needs judgment.
- **Fail soft everywhere.** No Supabase → seed data. No migration → publish without metadata. No breaking news → no ribbon. Every feature degrades to the previous version of the product.
- **Human control points remain.** The repo also ships a manual pipeline (Claude Code skill + sub-agents producing reviewable SQL drafts in [`drafts/`](../drafts/)) for editions a human wants to approve.

## How it was made

The entire project — code, database schema, deployment, agent pipeline, and this documentation — was built conversationally with **Claude Code**, in the spirit of the course it belongs to: describe the outcome, review what the agent builds, keep the judgment calls human. The commit history on `main` is the honest build log.
