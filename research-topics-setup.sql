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
