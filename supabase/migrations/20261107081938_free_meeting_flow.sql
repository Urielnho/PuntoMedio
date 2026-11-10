revoke insert, update, delete on public.meetings from authenticated;
revoke insert, update, delete on public.meeting_participants from authenticated;
revoke insert, update, delete on public.meeting_point_suggestions from authenticated;
drop policy if exists meetings_create_own on public.meetings;
drop policy if exists meeting_participants_creator_invites on public.meeting_participants;

alter table public.meeting_participants
  drop column approximate_origin_latitude,
  drop column approximate_origin_longitude,
  add column completed_at timestamptz;

alter table public.meetings
  drop column invitation_token_hash,
  drop column invitation_expires_at;

create table private.meeting_origins (
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  latitude numeric(8,5) not null check (latitude between -90 and 90),
  longitude numeric(8,5) not null check (longitude between -180 and 180),
  updated_at timestamptz not null default now(),
  primary key (meeting_id, user_id)
);

create table private.meeting_invitations (
  meeting_id uuid primary key references public.meetings(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  consumed_by uuid references public.profiles(id),
  consumed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint meeting_invitation_expiry check (expires_at > created_at),
  constraint meeting_invitation_consumption_pair check ((consumed_by is null) = (consumed_at is null))
);

alter table private.meeting_origins enable row level security;
alter table private.meeting_invitations enable row level security;

create or replace function public.create_meeting(p_title text, p_latitude numeric, p_longitude numeric)
returns public.meetings
language plpgsql
security definer
set search_path = ''
as $$
declare actor uuid := auth.uid(); result public.meetings;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  if not private.is_complete_user(actor) then raise exception 'complete_profile_required'; end if;
  if char_length(trim(p_title)) not between 2 and 100 then raise exception 'invalid_title'; end if;
  if p_latitude not between -90 and 90 or p_longitude not between -180 and 180 then raise exception 'invalid_origin'; end if;
  insert into public.meetings (creator_id, title) values (actor, trim(p_title)) returning * into result;
  insert into public.meeting_participants (meeting_id, user_id, status) values (result.id, actor, 'accepted');
  insert into private.meeting_origins (meeting_id, user_id, latitude, longitude) values (result.id, actor, p_latitude, p_longitude);
  return result;
end;
$$;

create or replace function public.create_meeting_invitation(p_meeting_id uuid, p_expected_revision bigint)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare actor uuid := auth.uid(); token text;
begin
  update public.meetings set status = 'invited', revision = revision + 1
  where id = p_meeting_id and creator_id = actor and status in ('created', 'invited') and revision = p_expected_revision;
  if not found then raise exception 'meeting_not_invitable_or_revision_conflict'; end if;
  token := encode(extensions.gen_random_bytes(18), 'hex');
  insert into private.meeting_invitations (meeting_id, token_hash, expires_at)
  values (p_meeting_id, encode(extensions.digest(token, 'sha256'), 'hex'), now() + interval '24 hours')
  on conflict (meeting_id) do update set token_hash = excluded.token_hash, expires_at = excluded.expires_at, consumed_by = null, consumed_at = null, created_at = now();
  return token;
end;
$$;

create or replace function public.accept_meeting_invitation(p_token text, p_latitude numeric, p_longitude numeric)
returns public.meetings
language plpgsql
security definer
set search_path = ''
as $$
declare actor uuid := auth.uid(); invitation private.meeting_invitations; result public.meetings;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  if not private.is_complete_user(actor) then raise exception 'complete_profile_required'; end if;
  if p_latitude not between -90 and 90 or p_longitude not between -180 and 180 then raise exception 'invalid_origin'; end if;
  select * into invitation from private.meeting_invitations
  where token_hash = encode(extensions.digest(trim(p_token), 'sha256'), 'hex') for update;
  if not found or invitation.expires_at <= now() or invitation.consumed_at is not null then raise exception 'invitation_unavailable'; end if;
  if exists (select 1 from public.meetings m where m.id = invitation.meeting_id and m.creator_id = actor) then raise exception 'creator_cannot_join_own_invitation'; end if;
  if (select count(*) from public.meeting_participants where meeting_id = invitation.meeting_id) >= 2 then raise exception 'meeting_full'; end if;
  insert into public.meeting_participants (meeting_id, user_id, status) values (invitation.meeting_id, actor, 'accepted');
  insert into private.meeting_origins (meeting_id, user_id, latitude, longitude) values (invitation.meeting_id, actor, p_latitude, p_longitude);
  update private.meeting_invitations set consumed_by = actor, consumed_at = now() where meeting_id = invitation.meeting_id;
  update public.meetings set status = 'accepted', revision = revision + 1 where id = invitation.meeting_id returning * into result;
  return result;
end;
$$;

create or replace function public.generate_geographic_suggestions(p_meeting_id uuid, p_expected_revision bigint)
returns setof public.meeting_point_suggestions
language plpgsql
security definer
set search_path = ''
as $$
declare actor uuid := auth.uid(); origin_count integer;
begin
  if not private.is_meeting_participant(p_meeting_id, actor) then raise exception 'participant_required'; end if;
  select count(*) into origin_count from private.meeting_origins where meeting_id = p_meeting_id;
  if origin_count <> 2 then raise exception 'two_origins_required'; end if;
  perform 1 from public.meetings where id = p_meeting_id and status = 'accepted' and revision = p_expected_revision for update;
  if not found then raise exception 'meeting_not_ready_or_revision_conflict'; end if;
  if exists (select 1 from public.meeting_participants where meeting_id = p_meeting_id and accepted_point_at is not null) then raise exception 'point_selection_already_started'; end if;
  delete from public.meeting_point_suggestions where meeting_id = p_meeting_id;
  insert into public.meeting_point_suggestions (
    meeting_id, point_id, rank, method, participant_one_distance_m, participant_two_distance_m
  )
  with origins as (
    select latitude::double precision lat, longitude::double precision lon, row_number() over (order by user_id) n
    from private.meeting_origins where meeting_id = p_meeting_id
  ), pair as (
    select max(lat) filter (where n = 1) lat1, max(lon) filter (where n = 1) lon1,
           max(lat) filter (where n = 2) lat2, max(lon) filter (where n = 2) lon2 from origins
  ), distances as (
    select mp.id point_id,
      round(6371000 * acos(least(
        1.0::double precision,
        sin(radians(pair.lat1)) * sin(radians(mp.latitude::double precision))
        + cos(radians(pair.lat1)) * cos(radians(mp.latitude::double precision))
        * cos(radians(mp.longitude::double precision - pair.lon1))
      )))::integer d1,
      round(6371000 * acos(least(
        1.0::double precision,
        sin(radians(pair.lat2)) * sin(radians(mp.latitude::double precision))
        + cos(radians(pair.lat2)) * cos(radians(mp.latitude::double precision))
        * cos(radians(mp.longitude::double precision - pair.lon2))
      )))::integer d2
    from public.meeting_points mp cross join pair
    where mp.active and lower(mp.city) = lower((
      select p.city from public.meetings m join public.profiles p on p.id = m.creator_id where m.id = p_meeting_id
    ))
  ), ranked as (
    select point_id, d1, d2, row_number() over (order by greatest(d1,d2) + abs(d1-d2), point_id) rank from distances
  )
  select p_meeting_id, point_id, rank::smallint, 'geographic_distance', d1, d2 from ranked where rank <= 3;
  return query select * from public.meeting_point_suggestions where meeting_id = p_meeting_id order by rank;
end;
$$;

create or replace function public.accept_meeting_point(p_meeting_id uuid, p_point_id uuid, p_expected_revision bigint)
returns public.meetings
language plpgsql
security definer
set search_path = ''
as $$
declare actor uuid := auth.uid(); accepted_count integer; result public.meetings;
begin
  if not private.is_meeting_participant(p_meeting_id, actor) then raise exception 'participant_required'; end if;
  perform 1 from public.meeting_point_suggestions where meeting_id = p_meeting_id and point_id = p_point_id;
  if not found then raise exception 'suggested_point_required'; end if;
  perform 1 from public.meetings where id = p_meeting_id and revision = p_expected_revision and status in ('accepted', 'point_selected') and (selected_point_id is null or selected_point_id = p_point_id) for update;
  if not found then raise exception 'point_conflict_or_revision_conflict'; end if;
  update public.meeting_participants set accepted_point_at = now() where meeting_id = p_meeting_id and user_id = actor;
  select count(*) into accepted_count from public.meeting_participants where meeting_id = p_meeting_id and accepted_point_at is not null;
  update public.meetings set selected_point_id = p_point_id, status = case when accepted_count = 2 then 'point_selected'::public.meeting_status else 'accepted'::public.meeting_status end, revision = revision + 1 where id = p_meeting_id returning * into result;
  return result;
end;
$$;

create or replace function public.mark_meeting_arrival(p_meeting_id uuid, p_expected_revision bigint)
returns public.meetings language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); result public.meetings;
begin
  if not private.is_meeting_participant(p_meeting_id, actor) then raise exception 'participant_required'; end if;
  perform 1 from public.meetings where id = p_meeting_id and revision = p_expected_revision and status in ('point_selected','in_progress') for update;
  if not found then raise exception 'arrival_not_allowed_or_revision_conflict'; end if;
  update public.meeting_participants set arrived_at = coalesce(arrived_at, now()) where meeting_id = p_meeting_id and user_id = actor;
  update public.meetings set status = 'in_progress', revision = revision + 1 where id = p_meeting_id returning * into result;
  return result;
end; $$;

create or replace function public.complete_meeting(p_meeting_id uuid, p_expected_revision bigint)
returns public.meetings language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); finished integer; result public.meetings;
begin
  if not private.is_meeting_participant(p_meeting_id, actor) then raise exception 'participant_required'; end if;
  perform 1 from public.meetings where id = p_meeting_id and revision = p_expected_revision and status = 'in_progress' for update;
  if not found then raise exception 'completion_not_allowed_or_revision_conflict'; end if;
  if exists (select 1 from public.meeting_participants where meeting_id = p_meeting_id and arrived_at is null) then raise exception 'both_arrivals_required'; end if;
  update public.meeting_participants set completed_at = coalesce(completed_at, now()) where meeting_id = p_meeting_id and user_id = actor;
  select count(*) into finished from public.meeting_participants where meeting_id = p_meeting_id and completed_at is not null;
  update public.meetings set status = case when finished = 2 then 'completed'::public.meeting_status else 'in_progress'::public.meeting_status end, revision = revision + 1 where id = p_meeting_id returning * into result;
  if finished = 2 then
    update public.profiles set completed_services = completed_services + 1
    where id in (select user_id from public.meeting_participants where meeting_id = p_meeting_id);
  end if;
  return result;
end; $$;

create or replace function public.cancel_meeting(p_meeting_id uuid, p_expected_revision bigint)
returns public.meetings language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); result public.meetings;
begin
  if not private.is_meeting_participant(p_meeting_id, actor) then raise exception 'participant_required'; end if;
  update public.meetings set status = 'cancelled', revision = revision + 1
  where id = p_meeting_id and revision = p_expected_revision and status not in ('completed','cancelled') returning * into result;
  if result.id is null then raise exception 'cancellation_not_allowed_or_revision_conflict'; end if;
  return result;
end; $$;

do $$ declare signature text; begin
  foreach signature in array array[
    'public.create_meeting(text,numeric,numeric)', 'public.create_meeting_invitation(uuid,bigint)',
    'public.accept_meeting_invitation(text,numeric,numeric)', 'public.generate_geographic_suggestions(uuid,bigint)',
    'public.accept_meeting_point(uuid,uuid,bigint)', 'public.mark_meeting_arrival(uuid,bigint)',
    'public.complete_meeting(uuid,bigint)', 'public.cancel_meeting(uuid,bigint)'
  ] loop execute 'revoke all on function ' || signature || ' from public'; execute 'grant execute on function ' || signature || ' to authenticated'; end loop;
end $$;
