-- Supabase Auth stores phone values without the leading plus sign. Keep the
-- private contact projection in canonical E.164 form required by its check.
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
  values (
    new.id,
    new.email,
    case
      when nullif(new.phone, '') is null then null
      when new.phone like '+%' then new.phone
      else '+' || new.phone
    end
  )
  on conflict (user_id) do update
    set email = excluded.email,
        phone_e164 = excluded.phone_e164,
        updated_at = now();
  return new;
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
          and new.email_confirmed_at is not null and new.phone_confirmed_at is not null
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

revoke all on function private.handle_new_user() from public, anon, authenticated;
revoke all on function private.handle_user_verification_change() from public, anon, authenticated;
