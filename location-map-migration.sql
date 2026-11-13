-- Run in Supabase SQL Editor. Adds map-ready approximate coordinates without changing existing location text.
alter table public.profiles add column if not exists location_lat double precision;
alter table public.profiles add column if not exists location_lng double precision;

-- Keep future signups' selected coordinates in the profile record.
create or replace function public.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
 insert into public.profiles(id,name,location,location_lat,location_lng,introduction,interests,contribution)
 values (
  new.id,
  nullif(new.raw_user_meta_data->>'name',''),
  nullif(new.raw_user_meta_data->>'location',''),
  nullif(new.raw_user_meta_data->>'location_lat','')::double precision,
  nullif(new.raw_user_meta_data->>'location_lng','')::double precision,
  nullif(new.raw_user_meta_data->>'introduction',''),
  coalesce(array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data->'interests','[]'::jsonb))),'{}'::text[]),
  nullif(new.raw_user_meta_data->>'contribution','')
 ) on conflict(id) do nothing;
 return new;
end; $$;
