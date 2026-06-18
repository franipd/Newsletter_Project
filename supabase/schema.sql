-- The Daily Stack — Supabase schema
-- Run this in the Supabase SQL editor once a project is created.

create table if not exists editions (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  edition_number integer not null unique,
  created_at timestamptz not null default now()
);

create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references editions(id) on delete cascade,
  section text not null check (
    section in ('AI/ML', 'Security', 'DevTools', 'Infrastructure/Cloud', 'Industry & Business')
  ),
  headline text not null,
  summary text not null,
  source_name text not null,
  source_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists stories_edition_id_idx on stories(edition_id);

-- Public read-only access (no auth required for v1 — this is a public news site)
alter table editions enable row level security;
alter table stories enable row level security;

create policy "Public read access to editions" on editions
  for select using (true);

create policy "Public read access to stories" on stories
  for select using (true);
