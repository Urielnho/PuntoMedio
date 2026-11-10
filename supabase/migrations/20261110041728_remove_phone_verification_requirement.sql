-- Phone numbers are no longer part of onboarding. Email ownership, profile
-- data, accepted policies and an avatar remain required for an operational
-- account. The phone projection is retained only for existing accounts.
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
        when p.email_verified and p_avatar_path is not null
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
          and new.email_confirmed_at is not null
          then 'complete'::public.profile_status
        else 'pending_verification'::public.profile_status
      end
  where id = new.id;

  update private.profile_contacts
  set email = new.email,
      phone_e164 = case
        when nullif(new.phone, '') is null then null
        when new.phone like '+%' then new.phone
        else '+' || new.phone
      end,
      updated_at = now()
  where user_id = new.id;
  return new;
end;
$$;

update public.profiles
set status = case
  when email_verified and display_name is not null and city is not null
    and avatar_path is not null and terms_accepted_at is not null
    and privacy_accepted_at is not null
    then 'complete'::public.profile_status
  else 'pending_verification'::public.profile_status
end
where status <> 'suspended';

revoke all on function private.handle_user_verification_change() from public, anon, authenticated;
