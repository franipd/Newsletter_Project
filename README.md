# The Daily Stack

A finite daily tech news edition. One dated front page, ten curated stories, five sections — AI/ML, Security, DevTools, Infrastructure/Cloud, Industry & Business. When you've read it, you're done.

Built as an editorial, newspaper-style reading experience: serif headlines, fixed masthead, section rules.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Supabase

Full product spec: [docs/prd.md](docs/prd.md)

## Quick start

Requires Node.js 18.18+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No setup needed — the site reads from local seed data until Supabase is connected.

## Supabase (optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Run [supabase/schema.sql](supabase/schema.sql) in the SQL editor
3. `cp .env.local.example .env.local` and fill in your project URL and anon key
4. Insert an edition and its stories, then restart the dev server

The app falls back to seed data automatically if Supabase isn't configured.

## Commands

```bash
npm run dev      # dev server
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
npx tsc --noEmit # type check
```

## Deploying

Deploys on [Vercel](https://vercel.com). See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full guide. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel project settings — never commit `.env.local`.

## License

MIT
