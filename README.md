# The Daily Stack

Tech news today is scattered across Hacker News, X, Reddit, LinkedIn, and a dozen newsletters, wrapped in hype and delivered as an infinite feed that never tells you when to stop. The Daily Stack is the opposite: a calm, finite daily edition built specifically for people who work in tech. Every day there is exactly one dated front page with exactly ten curated stories, organized into five sections — AI/ML, Security, DevTools, Infrastructure/Cloud, and Industry & Business. Each story is a short, original summary with clear source attribution and a link out to the original reporting; this project curates and summarizes, it does not republish. There is no infinite scroll, no algorithmic feed, and no personalization — everyone reads the same finite edition, the way a morning newspaper used to work. When you reach the bottom of the page, you are done for the day, which is the entire point. That finite, ritual-like shape is the bet: a product that respects your attention is more likely to earn a daily habit than one that competes for endless engagement. The current build is a working prototype aimed at software engineers, IT professionals, engineering leaders, and CS students who want industry awareness without doomscrolling. It ships with realistic seed data out of the box, and is wired to read from a Supabase database once one is connected, so the path from prototype to real curated content is a configuration change, not a rewrite. The next major piece of work is an automated curation pipeline that pulls from real sources, summarizes with an LLM, and publishes a new edition each day. See [docs/prd.md](docs/prd.md) for the full product spec, including goals, non-goals, and what's intentionally out of scope for this version.

See [docs/prd.md](docs/prd.md) for the full product spec.

## Running locally

**Requirements:** Node.js 18.18+

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site works out of the box with no setup — it reads from local seed data in [src/data/seed-edition.ts](src/data/seed-edition.ts) until a Supabase project is connected.

## Connecting Supabase (optional)

The app is wired to read from Supabase but falls back to seed data automatically if it's not configured.

1. Create a project at [supabase.com](https://supabase.com)
2. In the Supabase SQL editor, run [supabase/schema.sql](supabase/schema.sql) to create the `editions` and `stories` tables
3. Copy `.env.local.example` to `.env.local` and fill in your project URL and anon key:
   ```bash
   cp .env.local.example .env.local
   ```
4. Insert an edition and its stories into the new tables (via the Supabase table editor or SQL)
5. Restart the dev server — it will now read from Supabase instead of seed data

## Other commands

```bash
npm run build    # production build
npm run start    # run the production build locally
npm run lint     # eslint
npx tsc --noEmit # type check
```

## Deploying

This project is set up to deploy on [Vercel](https://vercel.com). Connect the repository in the Vercel dashboard, set the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables if using Supabase, and deploy.

## License

MIT
