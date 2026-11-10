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
