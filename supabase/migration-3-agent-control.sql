-- The Daily Stack — agent kill switch
-- Run once in the Supabase SQL editor.
-- Single-row settings table: when paused = true, /api/publish and
-- /api/stop-press exit before any AI call is made (zero API spend).

create table if not exists agent_settings (
  id integer primary key check (id = 1),
  paused boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into agent_settings (id, paused) values (1, false)
on conflict (id) do nothing;

alter table agent_settings enable row level security;

create policy "Public read access to agent_settings" on agent_settings
  for select using (true);
