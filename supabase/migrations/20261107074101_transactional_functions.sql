create or replace function public.update_my_profile(
  p_display_name text,
  p_city text,
  p_avatar_path text,
  p_accept_terms boolean default false,
  p_accept_privacy boolean default false
)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  result public.profiles;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  if char_length(trim(p_display_name)) not between 2 and 60 then raise exception 'invalid_display_name'; end if;
  if char_length(trim(p_city)) not between 2 and 80 then raise exception 'invalid_city'; end if;
  if p_avatar_path is not null and p_avatar_path not like actor::text || '/%' then raise exception 'invalid_avatar_path'; end if;

  update public.profiles p
  set display_name = trim(p_display_name),
      city = trim(p_city),
      avatar_path = p_avatar_path,
      terms_accepted_at = case when p_accept_terms then coalesce(p.terms_accepted_at, now()) else p.terms_accepted_at end,
      privacy_accepted_at = case when p_accept_privacy then coalesce(p.privacy_accepted_at, now()) else p.privacy_accepted_at end,
      status = case
        when p.email_verified and p.phone_verified and p_avatar_path is not null
          and (p_accept_terms or p.terms_accepted_at is not null)
          and (p_accept_privacy or p.privacy_accepted_at is not null)
          then 'complete'::public.profile_status
        else 'pending_verification'::public.profile_status
      end
  where p.id = actor
  returning p.* into result;
  return result;
end;
$$;

create or replace function public.get_public_profiles(profile_ids uuid[])
returns table (
  id uuid, display_name text, city text, avatar_path text,
  rating_average numeric, completed_services integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.display_name, p.city, p.avatar_path, p.rating_average, p.completed_services
  from public.profiles p
  where auth.uid() is not null
    and p.id = any(profile_ids)
    and p.status = 'complete'
    and not exists (
      select 1 from public.user_blocks b
      where (b.blocker_id = auth.uid() and b.blocked_id = p.id)
         or (b.blocker_id = p.id and b.blocked_id = auth.uid())
    );
$$;

create or replace function public.set_courier_enabled(p_enabled boolean, p_accept_rules boolean default false)
returns public.courier_profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  result public.courier_profiles;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  if p_enabled and not private.is_complete_user(actor) then raise exception 'complete_profile_required'; end if;

  insert into public.courier_profiles (user_id, enabled, rules_accepted_at)
  values (actor, p_enabled and p_accept_rules, case when p_accept_rules then now() end)
  on conflict (user_id) do update
    set enabled = case when excluded.enabled and public.courier_profiles.suspended_at is null then true else false end,
        rules_accepted_at = case when p_accept_rules then coalesce(public.courier_profiles.rules_accepted_at, now()) else public.courier_profiles.rules_accepted_at end
  returning * into result;
  return result;
end;
$$;

create or replace function public.assign_job_bid(p_job_id uuid, p_bid_id uuid, p_expected_revision bigint)
returns public.job_assignments
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  selected public.bids;
  result public.job_assignments;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  perform 1 from public.jobs j
  where j.id = p_job_id and j.requester_id = actor and j.status in ('published', 'bidding') and j.revision = p_expected_revision
  for update;
  if not found then raise exception 'job_not_assignable_or_revision_conflict'; end if;

  select * into selected from public.bids b
  where b.id = p_bid_id and b.job_id = p_job_id and b.status = 'active'
  for update;
  if not found then raise exception 'bid_not_available'; end if;

  insert into public.job_assignments (job_id, bid_id, courier_id, assigned_by)
  values (p_job_id, selected.id, selected.courier_id, actor)
  returning * into result;

  update public.bids set status = case when id = selected.id then 'accepted'::public.bid_status else 'rejected'::public.bid_status end
  where job_id = p_job_id and status = 'active';
  update public.jobs set status = 'assigned', revision = revision + 1 where id = p_job_id;
  return result;
end;
$$;

create or replace function public.confirm_simulated_payment(
  p_job_id uuid,
  p_platform_fee_minor bigint,
  p_optional_tip_minor bigint,
  p_idempotency_key uuid,
  p_expected_revision bigint
)
returns public.transactions
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  assignment public.job_assignments;
  accepted_bid public.bids;
  result public.transactions;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  if p_platform_fee_minor < 0 or p_optional_tip_minor < 0 then raise exception 'invalid_amount'; end if;

  select * into result from public.transactions where idempotency_key = p_idempotency_key;
  if found then
    if result.job_id <> p_job_id or result.payer_id <> actor then raise exception 'idempotency_key_conflict'; end if;
    return result;
  end if;

  perform 1 from public.jobs j
  where j.id = p_job_id and j.requester_id = actor and j.status = 'assigned' and j.revision = p_expected_revision
  for update;
  if not found then raise exception 'job_not_payable_or_revision_conflict'; end if;
  select * into assignment from public.job_assignments where job_id = p_job_id;
  select * into accepted_bid from public.bids where id = assignment.bid_id;

  insert into public.transactions (
    job_id, payer_id, courier_id, bid_id, service_fee_minor, platform_fee_minor,
    optional_tip_minor, idempotency_key, status, confirmed_at
  ) values (
    p_job_id, actor, assignment.courier_id, assignment.bid_id, accepted_bid.proposed_fee_minor,
    p_platform_fee_minor, p_optional_tip_minor, p_idempotency_key, 'confirmed', now()
  )
  on conflict (idempotency_key) do update set idempotency_key = excluded.idempotency_key
  returning * into result;

  if result.job_id <> p_job_id or result.payer_id <> actor then raise exception 'idempotency_key_conflict'; end if;
  update public.jobs set status = 'test_payment_confirmed', revision = revision + 1
  where id = p_job_id and status = 'assigned';
  return result;
end;
$$;

create or replace function public.issue_handoff_code(p_job_id uuid, p_stage public.handoff_stage)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  plain_code text;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  if not exists (select 1 from public.jobs j where j.id = p_job_id and j.requester_id = actor) then
    raise exception 'requester_required';
  end if;
  plain_code := lpad((floor(random() * 10000))::integer::text, 4, '0');
  insert into private.handoff_codes (job_id, stage, code_hash, expires_at, created_by)
  values (p_job_id, p_stage, encode(extensions.digest(plain_code, 'sha256'), 'hex'), now() + interval '10 minutes', actor)
  on conflict (job_id, stage) do update
    set code_hash = excluded.code_hash, expires_at = excluded.expires_at, attempts = 0,
        consumed_at = null, created_by = excluded.created_by, created_at = now();
  return plain_code;
end;
$$;

create or replace function public.confirm_handoff(
  p_job_id uuid,
  p_stage public.handoff_stage,
  p_code text,
  p_expected_revision bigint
)
returns public.jobs
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  code_row private.handoff_codes;
  result public.jobs;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  if not exists (select 1 from public.job_assignments a where a.job_id = p_job_id and a.courier_id = actor) then
    raise exception 'assigned_courier_required';
  end if;
  select * into code_row from private.handoff_codes
  where job_id = p_job_id and stage = p_stage for update;
  if not found or code_row.consumed_at is not null or code_row.expires_at <= now() or code_row.attempts >= code_row.max_attempts then
    raise exception 'code_unavailable';
  end if;
  if code_row.code_hash <> encode(extensions.digest(p_code, 'sha256'), 'hex') then
    update private.handoff_codes set attempts = attempts + 1 where id = code_row.id;
    return null;
  end if;
  update private.handoff_codes set consumed_at = now() where id = code_row.id;
  update public.jobs
  set status = case p_stage when 'pickup' then 'picked_up'::public.job_status else 'delivered'::public.job_status end,
      revision = revision + 1
  where id = p_job_id and revision = p_expected_revision
    and ((p_stage = 'pickup' and status = 'pickup_in_progress') or (p_stage = 'delivery' and status = 'delivery_in_progress'))
  returning * into result;
  if result.id is null then raise exception 'invalid_state_or_revision_conflict'; end if;
  return result;
end;
$$;

revoke all on function public.update_my_profile(text, text, text, boolean, boolean) from public;
revoke all on function public.get_public_profiles(uuid[]) from public;
revoke all on function public.set_courier_enabled(boolean, boolean) from public;
revoke all on function public.assign_job_bid(uuid, uuid, bigint) from public;
revoke all on function public.confirm_simulated_payment(uuid, bigint, bigint, uuid, bigint) from public;
revoke all on function public.issue_handoff_code(uuid, public.handoff_stage) from public;
revoke all on function public.confirm_handoff(uuid, public.handoff_stage, text, bigint) from public;

grant execute on function public.update_my_profile(text, text, text, boolean, boolean) to authenticated;
grant execute on function public.get_public_profiles(uuid[]) to authenticated;
grant execute on function public.set_courier_enabled(boolean, boolean) to authenticated;
grant execute on function public.assign_job_bid(uuid, uuid, bigint) to authenticated;
grant execute on function public.confirm_simulated_payment(uuid, bigint, bigint, uuid, bigint) to authenticated;
grant execute on function public.issue_handoff_code(uuid, public.handoff_stage) to authenticated;
grant execute on function public.confirm_handoff(uuid, public.handoff_stage, text, bigint) to authenticated;
