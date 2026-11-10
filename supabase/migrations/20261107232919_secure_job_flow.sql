-- Etapa 5: flujo seguro de encargos "Van por mí".
-- Las ubicaciones exactas permanecen en private.job_locations y todas las
-- mutaciones de negocio pasan por RPC con autenticación y revisión optimista.

revoke insert, update, delete on public.jobs from authenticated;
revoke insert, update, delete on public.bids from authenticated;

drop policy if exists jobs_create_own on public.jobs;
drop policy if exists bids_create_own on public.bids;
drop policy if exists bids_update_own on public.bids;

create or replace function public.create_job(
  p_title text,
  p_description text,
  p_category text,
  p_declared_product_value_minor bigint,
  p_product_payment_status public.product_payment_status,
  p_pickup_label text,
  p_delivery_label text,
  p_pickup_latitude numeric,
  p_pickup_longitude numeric,
  p_delivery_latitude numeric,
  p_delivery_longitude numeric,
  p_pickup_private_note text default null,
  p_delivery_private_note text default null
)
returns public.jobs
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  result public.jobs;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  if not private.is_complete_user(actor) then raise exception 'complete_profile_required'; end if;
  if char_length(trim(p_title)) not between 2 and 100 then raise exception 'invalid_title'; end if;
  if char_length(trim(p_description)) not between 10 and 1200 then raise exception 'invalid_description'; end if;
  if char_length(trim(p_category)) not between 2 and 60 then raise exception 'invalid_category'; end if;
  if p_declared_product_value_minor is not null and p_declared_product_value_minor < 0 then raise exception 'invalid_declared_value'; end if;
  if char_length(trim(p_pickup_label)) not between 2 and 180 or char_length(trim(p_delivery_label)) not between 2 and 180 then
    raise exception 'invalid_location_label';
  end if;
  if p_pickup_latitude not between -90 and 90 or p_delivery_latitude not between -90 and 90
     or p_pickup_longitude not between -180 and 180 or p_delivery_longitude not between -180 and 180 then
    raise exception 'invalid_coordinates';
  end if;
  if char_length(coalesce(p_pickup_private_note, '')) > 500 or char_length(coalesce(p_delivery_private_note, '')) > 500 then
    raise exception 'private_note_too_long';
  end if;

  insert into public.jobs (
    requester_id, title, description, category, declared_product_value_minor,
    product_payment_status, pickup_label, delivery_label, status
  ) values (
    actor, trim(p_title), trim(p_description), trim(p_category), p_declared_product_value_minor,
    p_product_payment_status, trim(p_pickup_label), trim(p_delivery_label), 'published'
  ) returning * into result;

  insert into private.job_locations (
    job_id, pickup_latitude, pickup_longitude, delivery_latitude, delivery_longitude,
    pickup_private_note, delivery_private_note
  ) values (
    result.id, p_pickup_latitude, p_pickup_longitude, p_delivery_latitude, p_delivery_longitude,
    nullif(trim(p_pickup_private_note), ''), nullif(trim(p_delivery_private_note), '')
  );

  return result;
end;
$$;

create or replace function public.place_job_bid(
  p_job_id uuid,
  p_proposed_fee_minor bigint,
  p_note text,
  p_expected_revision bigint
)
returns public.bids
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  target public.jobs;
  result public.bids;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  if p_proposed_fee_minor < 0 then raise exception 'invalid_fee'; end if;
  if char_length(coalesce(p_note, '')) > 500 then raise exception 'note_too_long'; end if;
  if not exists (
    select 1 from public.courier_profiles cp
    where cp.user_id = actor and cp.enabled and cp.suspended_at is null and cp.rules_accepted_at is not null
  ) or not private.is_complete_user(actor) then raise exception 'courier_not_enabled'; end if;

  select * into target from public.jobs j where j.id = p_job_id for update;
  if not found or target.status not in ('published', 'bidding') or target.revision <> p_expected_revision then
    raise exception 'job_not_open_or_revision_conflict';
  end if;
  if target.requester_id = actor then raise exception 'requester_cannot_bid'; end if;
  if exists (
    select 1 from public.user_blocks b
    where (b.blocker_id = actor and b.blocked_id = target.requester_id)
       or (b.blocker_id = target.requester_id and b.blocked_id = actor)
  ) then raise exception 'interaction_unavailable'; end if;
  if exists (select 1 from public.bids b where b.job_id = p_job_id and b.courier_id = actor) then
    raise exception 'bid_already_exists';
  end if;

  insert into public.bids (job_id, courier_id, proposed_fee_minor, note)
  values (p_job_id, actor, p_proposed_fee_minor, nullif(trim(p_note), ''))
  returning * into result;
  update public.jobs set status = 'bidding', revision = revision + 1 where id = p_job_id;
  return result;
end;
$$;

create or replace function public.withdraw_job_bid(p_bid_id uuid, p_expected_revision bigint)
returns public.bids
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  target public.bids;
  result public.bids;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  select * into target from public.bids b where b.id = p_bid_id and b.courier_id = actor for update;
  if not found or target.status <> 'active' then raise exception 'bid_not_withdrawable'; end if;
  perform 1 from public.jobs j where j.id = target.job_id and j.revision = p_expected_revision and j.status in ('published', 'bidding') for update;
  if not found then raise exception 'job_not_open_or_revision_conflict'; end if;
  update public.bids set status = 'withdrawn' where id = p_bid_id returning * into result;
  update public.jobs j set
    status = case when exists (select 1 from public.bids b where b.job_id = j.id and b.status = 'active') then 'bidding'::public.job_status else 'published'::public.job_status end,
    revision = revision + 1
  where j.id = target.job_id;
  return result;
end;
$$;

create or replace function public.confirm_product_payment(p_job_id uuid, p_expected_revision bigint)
returns public.jobs
language plpgsql
security definer
set search_path = ''
as $$
declare actor uuid := auth.uid(); result public.jobs;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  update public.jobs set product_payment_status = 'declared_paid', revision = revision + 1
  where id = p_job_id and requester_id = actor and product_payment_status = 'awaiting_confirmation'
    and status = 'assigned' and revision = p_expected_revision
  returning * into result;
  if result.id is null then raise exception 'product_payment_not_confirmable_or_revision_conflict'; end if;
  return result;
end;
$$;

create or replace function public.start_job_pickup(p_job_id uuid, p_expected_revision bigint)
returns public.jobs
language plpgsql
security definer
set search_path = ''
as $$
declare actor uuid := auth.uid(); result public.jobs;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  update public.jobs j set status = 'pickup_in_progress', revision = revision + 1
  where j.id = p_job_id and j.status = 'assigned' and j.revision = p_expected_revision
    and j.product_payment_status <> 'awaiting_confirmation'
    and exists (select 1 from public.job_assignments a where a.job_id = j.id and a.courier_id = actor)
  returning * into result;
  if result.id is null then raise exception 'pickup_not_startable_or_revision_conflict'; end if;
  return result;
end;
$$;

create or replace function public.start_job_delivery(p_job_id uuid, p_expected_revision bigint)
returns public.jobs
language plpgsql
security definer
set search_path = ''
as $$
declare actor uuid := auth.uid(); result public.jobs;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  update public.jobs j set status = 'delivery_in_progress', revision = revision + 1
  where j.id = p_job_id and j.status = 'picked_up' and j.revision = p_expected_revision
    and exists (select 1 from public.job_assignments a where a.job_id = j.id and a.courier_id = actor)
  returning * into result;
  if result.id is null then raise exception 'delivery_not_startable_or_revision_conflict'; end if;
  return result;
end;
$$;

create or replace function public.complete_job(p_job_id uuid, p_expected_revision bigint)
returns public.jobs
language plpgsql
security definer
set search_path = ''
as $$
declare actor uuid := auth.uid(); result public.jobs; courier uuid;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  select a.courier_id into courier from public.job_assignments a where a.job_id = p_job_id;
  update public.jobs set status = 'completed', revision = revision + 1
  where id = p_job_id and requester_id = actor and status = 'delivered' and revision = p_expected_revision
  returning * into result;
  if result.id is null then raise exception 'job_not_completable_or_revision_conflict'; end if;
  update public.profiles set completed_services = completed_services + 1 where id in (actor, courier);
  return result;
end;
$$;

create or replace function public.cancel_job(p_job_id uuid, p_expected_revision bigint)
returns public.jobs
language plpgsql
security definer
set search_path = ''
as $$
declare actor uuid := auth.uid(); result public.jobs;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  update public.jobs set status = 'cancelled', revision = revision + 1
  where id = p_job_id and requester_id = actor and status in ('published', 'bidding') and revision = p_expected_revision
  returning * into result;
  if result.id is null then raise exception 'job_not_cancellable_or_revision_conflict'; end if;
  update public.bids set status = 'rejected' where job_id = p_job_id and status = 'active';
  return result;
end;
$$;

create or replace function public.get_job_private_location(p_job_id uuid)
returns table (
  pickup_latitude numeric, pickup_longitude numeric, delivery_latitude numeric, delivery_longitude numeric,
  pickup_private_note text, delivery_private_note text
)
language sql
stable
security definer
set search_path = ''
as $$
  select l.pickup_latitude, l.pickup_longitude, l.delivery_latitude, l.delivery_longitude,
         l.pickup_private_note, l.delivery_private_note
  from private.job_locations l
  where l.job_id = p_job_id and private.is_job_participant(p_job_id, auth.uid());
$$;

create or replace function public.assign_job_bid(p_job_id uuid, p_bid_id uuid, p_expected_revision bigint)
returns public.job_assignments
language plpgsql
security definer
set search_path = ''
as $$
declare actor uuid := auth.uid(); selected public.bids; result public.job_assignments;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  perform 1 from public.jobs j
  where j.id = p_job_id and j.requester_id = actor and j.status in ('published', 'bidding') and j.revision = p_expected_revision
  for update;
  if not found then raise exception 'job_not_assignable_or_revision_conflict'; end if;
  select * into selected from public.bids b
  where b.id = p_bid_id and b.job_id = p_job_id and b.status = 'active' for update;
  if not found then raise exception 'bid_not_available'; end if;
  if not exists (select 1 from public.courier_profiles cp where cp.user_id = selected.courier_id and cp.enabled and cp.suspended_at is null)
     or not private.is_complete_user(selected.courier_id) then raise exception 'courier_not_available'; end if;
  insert into public.job_assignments (job_id, bid_id, courier_id, assigned_by)
  values (p_job_id, selected.id, selected.courier_id, actor) returning * into result;
  update public.bids set status = case when id = selected.id then 'accepted'::public.bid_status else 'rejected'::public.bid_status end
  where job_id = p_job_id and status = 'active';
  update public.jobs set status = 'assigned', revision = revision + 1 where id = p_job_id;
  return result;
end;
$$;

create or replace function public.issue_handoff_code(p_job_id uuid, p_stage public.handoff_stage)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare actor uuid := auth.uid(); plain_code text; random_value bigint; expected public.job_status;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  expected := case p_stage when 'pickup' then 'pickup_in_progress'::public.job_status else 'delivery_in_progress'::public.job_status end;
  if not exists (select 1 from public.jobs j where j.id = p_job_id and j.requester_id = actor and j.status = expected) then
    raise exception 'handoff_code_not_available';
  end if;
  random_value := get_byte(extensions.gen_random_bytes(4), 0)::bigint * 16777216
    + get_byte(extensions.gen_random_bytes(4), 1)::bigint * 65536
    + get_byte(extensions.gen_random_bytes(4), 2)::bigint * 256
    + get_byte(extensions.gen_random_bytes(4), 3)::bigint;
  plain_code := lpad((random_value % 1000000)::text, 6, '0');
  insert into private.handoff_codes (job_id, stage, code_hash, expires_at, created_by)
  values (p_job_id, p_stage, encode(extensions.digest(plain_code, 'sha256'), 'hex'), now() + interval '10 minutes', actor)
  on conflict (job_id, stage) do update set
    code_hash = excluded.code_hash, expires_at = excluded.expires_at, attempts = 0,
    consumed_at = null, created_by = excluded.created_by, created_at = now();
  return plain_code;
end;
$$;

do $$
declare signature text;
begin
  foreach signature in array array[
    'public.create_job(text,text,text,bigint,public.product_payment_status,text,text,numeric,numeric,numeric,numeric,text,text)',
    'public.place_job_bid(uuid,bigint,text,bigint)',
    'public.withdraw_job_bid(uuid,bigint)',
    'public.confirm_product_payment(uuid,bigint)',
    'public.start_job_pickup(uuid,bigint)',
    'public.start_job_delivery(uuid,bigint)',
    'public.complete_job(uuid,bigint)',
    'public.cancel_job(uuid,bigint)',
    'public.get_job_private_location(uuid)',
    'public.assign_job_bid(uuid,uuid,bigint)',
    'public.issue_handoff_code(uuid,public.handoff_stage)'
  ] loop
    execute format('revoke all on function %s from public', signature);
    execute format('grant execute on function %s to authenticated', signature);
  end loop;
end $$;
