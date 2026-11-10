create or replace function public.create_meeting_invitation(p_meeting_id uuid, p_expected_revision bigint)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare actor uuid := auth.uid(); token text;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  update public.meetings set status = 'invited', revision = revision + 1
  where id = p_meeting_id and creator_id = actor and status in ('created', 'invited') and revision = p_expected_revision;
  if not found then raise exception 'meeting_not_invitable_or_revision_conflict'; end if;
  token := upper(encode(extensions.gen_random_bytes(5), 'hex'));
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
declare
  actor uuid := auth.uid();
  invitation private.meeting_invitations;
  result public.meetings;
  normalized_token text := upper(replace(trim(p_token), '-', ''));
begin
  if actor is null then raise exception 'authentication_required'; end if;
  if not private.is_complete_user(actor) then raise exception 'complete_profile_required'; end if;
  if p_latitude not between -90 and 90 or p_longitude not between -180 and 180 then raise exception 'invalid_origin'; end if;
  select * into invitation from private.meeting_invitations
  where token_hash in (
    encode(extensions.digest(trim(p_token), 'sha256'), 'hex'),
    encode(extensions.digest(normalized_token, 'sha256'), 'hex')
  ) for update;
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
