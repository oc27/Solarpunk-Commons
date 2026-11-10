-- Run once in Supabase > SQL Editor > New query.
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 name text, location text, introduction text,
 interests text[] not null default '{}',
 contribution text, created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "Public profiles are viewable" on public.profiles;
create policy "Public profiles are viewable" on public.profiles for select to anon, authenticated using (true);
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles for update to authenticated using (auth.uid()=id) with check (auth.uid()=id);

-- Trusted trigger creates the profile from signup metadata. No public INSERT policy is needed.
create or replace function public.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
 insert into public.profiles(id,name,location,introduction,interests,contribution)
 values (
  new.id,
  nullif(new.raw_user_meta_data->>'name',''),
  nullif(new.raw_user_meta_data->>'location',''),
  nullif(new.raw_user_meta_data->>'introduction',''),
  coalesce(array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data->'interests','[]'::jsonb))),'{}'::text[]),
  nullif(new.raw_user_meta_data->>'contribution','')
 ) on conflict(id) do nothing;
 return new;
end; $$;
drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users for each row execute procedure public.create_profile_for_new_user();
-- Run this once in Supabase SQL Editor after the original supabase-setup.sql.
create table if not exists public.research_topics (
 id uuid primary key default gen_random_uuid(),
 slug text unique not null,
 title text not null,
 question text not null,
 description text not null default '',
 position integer not null default 0,
 is_open boolean not null default true,
 created_at timestamptz not null default now()
);

create table if not exists public.research_responses (
 id uuid primary key default gen_random_uuid(),
 topic_id uuid not null references public.research_topics(id) on delete cascade,
 profile_id uuid not null references public.profiles(id) on delete cascade,
 response text not null,
 current_need text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(topic_id, profile_id)
);

alter table public.research_topics enable row level security;
alter table public.research_responses enable row level security;

drop policy if exists "Open research topics are public" on public.research_topics;
create policy "Open research topics are public" on public.research_topics
 for select to anon, authenticated using (is_open = true);

drop policy if exists "Research responses are public" on public.research_responses;
create policy "Research responses are public" on public.research_responses
 for select to anon, authenticated using (true);

drop policy if exists "Members can add their own research responses" on public.research_responses;
create policy "Members can add their own research responses" on public.research_responses
 for insert to authenticated with check (auth.uid() = profile_id);

drop policy if exists "Members can edit their own research responses" on public.research_responses;
create policy "Members can edit their own research responses" on public.research_responses
 for update to authenticated using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

insert into public.research_topics (slug,title,question,description,position) values
('workshops-and-activities','The art of doing','What are your favourite workshops and activities that you run or participate in?','We are interested in the practical activities through which people build communities, share knowledge and experiment with alternative ways of living. Tell us what happens, who takes part, what makes it meaningful, and what others might learn from it.',1),
('local-organisations-and-places','Mapping the movement','What are the solarpunk organisations and places in your area that you think people should know about?','Help build a distributed map of the spaces, organisations, collectives and initiatives making alternative futures tangible. Include names, locations, links and a little about what makes each one worth knowing.',2),
('current-projects','What are you working towards?','What are you looking to do right now? Do you have a project ongoing that needs support, or would you like to join a project?','Tell us where you are now. You might be looking for collaborators, resources, skills, a project to join, inspiration, or simply people working on similar things. Be as specific as you like about the help or connections that would be useful.',3)
on conflict (slug) do update set title=excluded.title, question=excluded.question, description=excluded.description, position=excluded.position;
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
-- Run after supabase-setup.sql. This adds one editable offers/needs record per member.
create table if not exists public.member_offers_needs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  offers text[] not null default '{}',
  offer_details text not null default '',
  needs text[] not null default '{}',
  need_details text not null default '',
  location text,
  visibility text not null default 'public' check (visibility in ('public','private')),
  updated_at timestamptz not null default now(),
  constraint offers_details_length check (char_length(offer_details) <= 1500),
  constraint needs_details_length check (char_length(need_details) <= 1500)
);
create index if not exists member_offers_needs_visibility_idx on public.member_offers_needs(visibility);
alter table public.member_offers_needs enable row level security;
drop policy if exists "Public offers and needs are visible" on public.member_offers_needs;
create policy "Public offers and needs are visible" on public.member_offers_needs for select to anon, authenticated using (visibility = 'public' or auth.uid() = profile_id);
drop policy if exists "Members can create their own offers and needs" on public.member_offers_needs;
create policy "Members can create their own offers and needs" on public.member_offers_needs for insert to authenticated with check (auth.uid() = profile_id);
drop policy if exists "Members can update their own offers and needs" on public.member_offers_needs;
create policy "Members can update their own offers and needs" on public.member_offers_needs for update to authenticated using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
drop policy if exists "Members can delete their own offers and needs" on public.member_offers_needs;
create policy "Members can delete their own offers and needs" on public.member_offers_needs for delete to authenticated using (auth.uid() = profile_id);
