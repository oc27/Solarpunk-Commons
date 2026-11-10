-- Run once in Supabase > SQL Editor > New query.
-- Run after supabase-setup.sql, because projects belong to member profiles.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  location text,
  details text not null check (char_length(details) between 1 and 4000),
  participation text not null check (char_length(participation) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_created_at_idx on public.projects(created_at desc);
create index if not exists projects_owner_id_idx on public.projects(owner_id);
alter table public.projects enable row level security;
drop policy if exists "Projects are publicly viewable" on public.projects;
create policy "Projects are publicly viewable" on public.projects for select to anon, authenticated using (true);
drop policy if exists "Members can create their own projects" on public.projects;
create policy "Members can create their own projects" on public.projects for insert to authenticated with check (auth.uid() = owner_id);
drop policy if exists "Members can update their own projects" on public.projects;
create policy "Members can update their own projects" on public.projects for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
drop policy if exists "Members can delete their own projects" on public.projects;
create policy "Members can delete their own projects" on public.projects for delete to authenticated using (auth.uid() = owner_id);
