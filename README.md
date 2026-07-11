# The Daily Stack

**A self-publishing daily tech newspaper, written and edited by AI agents.**

Every morning at 06:00 UTC, a pipeline of agents searches the live web, curates the ten stories that matter to software practitioners, writes an editor's note, validates its own work, and publishes — no human in the loop. One dated front page, ten stories, five sections (AI/ML, Security, DevTools, Infrastructure/Cloud, Industry & Business). When you've read it, you're done. No infinite scroll, ever.

**Live site:** https://the-daily-stack-newsletter.vercel.app

## What makes it different

- **Agent-published, daily** — five curator agents (with web search) gather ~20 candidates in parallel; an editor agent selects the final 10 and writes a signed note on its hardest call; deterministic validation gates publishing
- **Stop Press** — a breaking-news agent checks every 2 hours; genuinely major news (live outages, exploited zero-days, frontier releases) appears as a ribbon within minutes and expires after 6 hours
- **Finite by design** — a reading meter counts your progress and flips to "DONE — GO BUILD" at the end; the archive keeps the last 5 editions browsable by date
- **Transparent machinery** — the wire line shows each edition's telemetry (agents, searches, candidates), and "Also considered" lists what the editor cut
- **"Wire Room" design** — ink-black masthead, huge serif, a marquee streaming today's headlines teletype-style, numbered sections with ghosted numerals, monospace for everything the machine says

## How it works

```
                       ┌────────────── Vercel Cron, 06:00 UTC daily ─────────────┐
                       │                                                          │
                       ▼                                                          │
             /api/publish (Next.js route)                                         │
   ┌──────────────────┼──────────────────────────────┐                            │
   │  1. CURATE       │  5 parallel agents + web search → 20 candidate stories    │
   │  2. EDIT         │  1 editor agent → final 10 + editor's note + rejects      │
   │  3. VALIDATE     │  deterministic checks (counts, sections, URLs) + 1 retry  │
   │  4. PUBLISH      │  insert into Supabase (editions + stories)                │
   └──────────────────┴──────────────────────────────┘
                       │
                       ▼
        Supabase (Postgres, RLS: public read-only)
                       │
                       ▼
        Next.js front page (ISR, revalidates every 5 min)

   GitHub Actions (every 2h) → /api/stop-press → breaking-news ribbon
```

The website itself is a thin, fast reader — all intelligence runs at publish time. Data changes appear on the site within 5 minutes (ISR); code changes deploy automatically on push to `main`.

### Agent architecture

The pipeline is an **orchestrator–worker workflow with subagents** — not a peer-to-peer multi-agent system:

```
                ORCHESTRATOR (plain TypeScript — owns all control flow)
                     │
     ┌────┬────┬─────┼─────┬────┐
     ▼    ▼    ▼     ▼     ▼    │    fan-out: 5 curator agents in parallel,
   cur-1 cur-2 cur-3 cur-4 cur-5│    isolated contexts, one section each
     └────┴────┴─────┼─────┴────┘
                     ▼               fan-in: code aggregates candidates
                  EDITOR             1 agent, schema-enforced JSON
                     ▼
                 VALIDATION          deterministic code + one retry loop
                     ▼
                  PUBLISH            Supabase insert, idempotent per date
```

Design properties: agents never communicate peer-to-peer (hub-and-spoke only); delegation is one level deep; each worker gets a fresh, minimal context; all state lives in the orchestrator and the database. The control flow is fixed in code — models fill in content, they never decide what happens next. This makes the pipeline cheap (no coordination overhead), debuggable (every stage inspectable), and safe (validation can't be skipped). The stop-press desk is a second, single-agent workflow on its own schedule.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres) · Anthropic API · Vercel (hosting + cron) · GitHub Actions (intraday cron)

Full product spec: [docs/prd.md](docs/prd.md) · Build story: [docs/HOW-IT-WAS-BUILT.md](docs/HOW-IT-WAS-BUILT.md)

## Quick start

Requires Node.js 18.18+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No setup needed — the site reads from local seed data until Supabase is connected.

## Full setup (Supabase + auto-publish)

1. Create a project at [supabase.com](https://supabase.com), run [supabase/schema.sql](supabase/schema.sql) then [supabase/migration-2-liveness.sql](supabase/migration-2-liveness.sql) in the SQL editor
2. `cp .env.local.example .env.local` and fill in the values (see the comments in that file)
3. For the daily pipeline, set the server-only vars in Vercel: `ANTHROPIC_API_KEY`, `SUPABASE_SECRET_KEY`, `CRON_SECRET`

Step-by-step deployment guide: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Commands

```bash
npm run dev      # dev server
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
npx tsc --noEmit # type check
```

Trigger a publish manually (idempotent — one edition per date):

```bash
curl -X POST https://your-site.vercel.app/api/publish \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## License

MIT
