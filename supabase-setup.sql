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
