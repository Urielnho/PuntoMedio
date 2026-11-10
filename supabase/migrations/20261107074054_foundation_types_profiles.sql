create extension if not exists pgcrypto with schema extensions;

create type public.profile_status as enum ('incomplete', 'pending_verification', 'complete', 'suspended');
create type public.meeting_status as enum ('created', 'invited', 'accepted', 'point_selected', 'in_progress', 'completed', 'cancelled');
create type public.participant_status as enum ('invited', 'accepted', 'declined');
create type public.job_status as enum ('published', 'bidding', 'assigned', 'test_payment_confirmed', 'pickup_in_progress', 'picked_up', 'delivery_in_progress', 'delivered', 'completed', 'cancelled', 'disputed');
create type public.bid_status as enum ('active', 'accepted', 'rejected', 'withdrawn');
create type public.product_payment_status as enum ('declared_paid', 'awaiting_confirmation', 'not_managed');
create type public.transaction_status as enum ('pending', 'confirmed', 'cancelled', 'refunded');
create type public.service_kind as enum ('meeting', 'job');
create type public.handoff_stage as enum ('pickup', 'delivery');
create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  city text,
  avatar_path text,
  phone_verified boolean not null default false,
  email_verified boolean not null default false,
  terms_accepted_at timestamptz,
  privacy_accepted_at timestamptz,
  status public.profile_status not null default 'incomplete',
  completed_services integer not null default 0 check (completed_services >= 0),
  rating_average numeric(3,2) check (rating_average is null or rating_average between 1 and 5),
  rating_count integer not null default 0 check (rating_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (display_name is null or char_length(trim(display_name)) between 2 and 60),
  constraint profiles_city_length check (city is null or char_length(trim(city)) between 2 and 80),
  constraint profiles_avatar_path_scope check (avatar_path is null or avatar_path like id::text || '/%')
);

comment on column public.profiles.phone_verified is 'Trusted server projection; clients cannot set this field.';
comment on column public.profiles.email_verified is 'Trusted server projection; clients cannot set this field.';
comment on column public.profiles.avatar_path is 'Private Storage object path, never a permanent public URL.';

create table public.courier_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  enabled boolean not null default false,
  rules_accepted_at timestamptz,
  suspended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint courier_enabled_requires_terms check (not enabled or rules_accepted_at is not null),
  constraint courier_suspended_not_enabled check (suspended_at is null or not enabled)
);

create table public.user_blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint user_blocks_not_self check (blocker_id <> blocked_id)
);

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.profile_contacts (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  email text,
  phone_e164 text,
  updated_at timestamptz not null default now(),
  constraint profile_contacts_phone_format check (phone_e164 is null or phone_e164 ~ '^\\+[1-9][0-9]{7,14}$')
);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function private.set_updated_at();
create trigger courier_profiles_set_updated_at before update on public.courier_profiles
for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email_verified, phone_verified)
  values (new.id, new.email_confirmed_at is not null, new.phone_confirmed_at is not null)
  on conflict (id) do nothing;

  insert into private.profile_contacts (user_id, email, phone_e164)
  values (new.id, new.email, new.phone)
  on conflict (user_id) do update
    set email = excluded.email,
        phone_e164 = excluded.phone_e164,
        updated_at = now();
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

create or replace function private.handle_user_verification_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set email_verified = new.email_confirmed_at is not null,
      phone_verified = new.phone_confirmed_at is not null,
      status = case
        when display_name is not null and city is not null and avatar_path is not null
          and terms_accepted_at is not null and privacy_accepted_at is not null
          and new.email_confirmed_at is not null and new.phone_confirmed_at is not null
          then 'complete'::public.profile_status
        else 'pending_verification'::public.profile_status
      end
  where id = new.id;
  update private.profile_contacts
  set email = new.email, phone_e164 = new.phone, updated_at = now()
  where user_id = new.id;
  return new;
end;
$$;

revoke all on function private.handle_user_verification_change() from public, anon, authenticated;
create trigger on_auth_user_verification_changed
after update of email, phone, email_confirmed_at, phone_confirmed_at on auth.users
for each row execute function private.handle_user_verification_change();

create index profiles_city_idx on public.profiles (city) where status = 'complete';
create index user_blocks_blocked_idx on public.user_blocks (blocked_id);
