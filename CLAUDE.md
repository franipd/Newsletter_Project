# The Daily Stack

> Also read [AGENTS.md](AGENTS.md) — Next.js-specific agent rules (this scaffold's APIs may differ from training data; check `node_modules/next/dist/docs/` before using unfamiliar Next.js APIs).

## What this is

A finite, curated daily tech news edition for practitioners — the "morning newspaper" for software engineers, IT professionals, engineering leaders, and CS students. The core differentiator: a fixed daily edition that says "you're done," unlike infinite feeds.

Full product spec: see [docs/prd.md](docs/prd.md). That PRD is the source of truth for scope, user stories, and acceptance criteria — keep this file and that PRD consistent. If they conflict, flag it rather than picking one silently.

## Tech stack

- **Frontend**: Next.js (App Router) + Tailwind CSS + TypeScript
- **Database**: Supabase (Postgres) — currently using seed/mock data; real Supabase project not yet connected
- **Curation pipeline**: not yet built — out of scope for this milestone. Site reads from seed data / Supabase only.

## Repo structure

```
├── CLAUDE.md
├── AGENTS.md             ← Next.js scaffold agent rules
├── docs/
│   └── prd.md
├── src/
│   ├── app/               ← Next.js App Router pages
│   ├── components/        ← article cards, section nav, etc.
│   ├── data/               ← seed/mock edition data (until Supabase is wired up)
│   └── lib/
│       └── supabase.ts    ← Supabase client (stubbed until real project exists)
└── ...
```

## Visual design

The site is styled as an editorial, newspaper-style reading experience, not a generic app/dashboard UI:

- **Fonts**: `Source Serif 4` for headlines/mastheads (`font-serif`), `Inter` for body/UI text (`font-sans`) — set up in [src/app/layout.tsx](src/app/layout.tsx) via `next/font/google`
- **Colors**: warm off-white background and ink-black text (not pure white/black), one accent color (a muted brick red) used sparingly for section ticks, hover underlines, and source links — defined as CSS variables in [src/app/globals.css](src/app/globals.css) (`--background`, `--foreground`, `--rule`, `--accent`, `--muted`)
- **Masthead pattern**: rule lines (`border-rule`) instead of generic Tailwind `border-neutral-*`, asymmetric edition/date line, serif title
- When adding new UI, reuse these tokens (`bg-accent`, `text-muted`, `border-rule`, `font-serif`/`font-sans`) rather than introducing new ad hoc colors or falling back to Tailwind's default neutral/gray palette

## Content & publishing model

- Editions are modeled as: one edition → 10 stories → grouped into 5 sections
- Currently sourced from local seed data in `src/data/`; designed so swapping to a live Supabase table later doesn't require changing component code
- Publishing happens two ways: automatically via `/api/publish` (a Vercel Cron hits it daily at 06:00 UTC; Haiku curators with web search → Sonnet editor with structured output → code validation → Supabase insert), or manually via the `/publish-edition` Claude Code skill + pasting SQL. The cron route is idempotent — one edition per date.
- No infinite scroll, no "load more," no personalization in v1

## Deployment & publishing

- Deploy target is Vercel; the full human-run guide is [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). The app is at the repo root (github.com/franipd/Newsletter_Project), so Vercel's Root Directory stays at the default.
- Database is Supabase: run `supabase/schema.sql` then `supabase/seed.sql` in the SQL editor. Env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) live only in Vercel settings and local `.env.local`.
- New editions are drafted with `/publish-edition` (root `.claude/` config): story-curator sub-agents on Haiku (cheap gathering), edition-editor on Sonnet (editorial judgment), edition-validator on Haiku (rule checks). Output goes to `drafts/` for human review; the human runs the SQL in Supabase. Use the cheapest model that can do each step — no Opus in this pipeline.
- Run `/pre-deploy` (lint, type-check, build, secret scan) before any deploy.

## Guardrails

- **Never deploy without asking first** — no `vercel --prod`, no production deploy commands, no pushing to a branch that triggers auto-deploy, without explicit confirmation in the moment
- Treat Supabase credentials/connection strings as secrets — never print them, commit them, or hardcode them outside `.env.local`

## How Claude should work in this repo

- Keep changes scoped to what's asked; this is an early-stage prototype, not a production system — don't add infrastructure (CI/CD, test suites, monitoring) unless asked
- When the PRD has an `[ASSUMPTION]` or `[NEEDS INPUT]` that affects an implementation decision, surface it rather than silently resolving it
- Prefer the simplest implementation that satisfies the must-have user stories in the PRD over a more "scalable" or "correct" architecture — this is a prototype meant to test the next-day return rate hypothesis, not a long-term platform
