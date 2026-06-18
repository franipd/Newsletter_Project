# The Daily Stack

A finite, curated daily tech news edition for practitioners. One dated front page, five sections, ten stories — then you're done.

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
