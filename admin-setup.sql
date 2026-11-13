-- Solarpunk Commons admin tools. Run once in Supabase SQL Editor.
-- 1) Add an admin flag to profiles. Existing accounts remain non-admin by default.
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- 2) Profile form wording settings. These configure the existing profile fields;
-- they do not add new database columns or erase existing member answers.
create table if not exists public.profile_field_settings (
 field_key text primary key,
 label text not null,
 help_text text not null default '',
 is_visible boolean not null default true,
 position integer not null default 0
);
alter table public.profile_field_settings enable row level security;
drop policy if exists "Profile field settings are public" on public.profile_field_settings;
create policy "Profile field settings are public" on public.profile_field_settings for select to anon, authenticated using (true);
drop policy if exists "Admins manage profile field settings" on public.profile_field_settings;
create policy "Admins manage profile field settings" on public.profile_field_settings for all to authenticated
 using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin))
 with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin));

-- 3) Let admins manage all research topics, including closed topics.
drop policy if exists "Open research topics are public" on public.research_topics;
create policy "Open research topics are public" on public.research_topics for select to anon, authenticated using (is_open=true);
drop policy if exists "Admins manage research topics" on public.research_topics;
create policy "Admins manage research topics" on public.research_topics for all to authenticated
 using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin))
 with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin));

insert into public.profile_field_settings(field_key,label,help_text,position) values
('name','Name','Your name or the name you use in the Commons.',1),
('location','Where are you based?','Town, city or region. Approximate coordinates help us map the network.',2),
('introduction','Introduction','A short introduction to you and your work.',3),
('interests','Areas of interest','Choose the themes you are interested in.',4),
('contribution','What would you like to contribute?','Skills, ideas, time, questions or other ways you might participate.',5)
on conflict(field_key) do nothing;

-- 4) Make YOUR account an administrator.
-- Replace the email below with the email address you use to log in to Solarpunk Commons.
update public.profiles set is_admin=true
where id=(select id from auth.users where email='YOUR-LOGIN-EMAIL@example.com');
