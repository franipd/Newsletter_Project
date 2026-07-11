-- The Daily Stack — liveness features migration
-- Run once in the Supabase SQL editor (after schema.sql).
-- Adds: pipeline stats + editor's note + rejected candidates on editions,
-- and the stop_press table for the breaking-news ribbon.

alter table editions add column if not exists stats jsonb;
alter table editions add column if not exists editors_note text;
alter table editions add column if not exists also_considered jsonb;

create table if not exists stop_press (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  source_url text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

alter table stop_press enable row level security;

create policy "Public read access to stop_press" on stop_press
  for select using (true);
