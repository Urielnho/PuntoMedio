drop policy if exists reviews_create_author on public.reviews;
revoke insert on public.reviews from authenticated;

create or replace function private.can_view_public_profile(target_user uuid, viewer uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select viewer is not null
    and exists (select 1 from public.profiles p where p.id = target_user and p.status = 'complete')
    and not exists (
      select 1 from public.user_blocks b
      where (b.blocker_id = viewer and b.blocked_id = target_user)
         or (b.blocker_id = target_user and b.blocked_id = viewer)
    );
$$;

revoke all on function private.can_view_public_profile(uuid, uuid) from public;
grant execute on function private.can_view_public_profile(uuid, uuid) to authenticated;

drop policy if exists reviews_read_authenticated on public.reviews;
create policy reviews_read_visible_profile on public.reviews for select to authenticated
using ((select private.can_view_public_profile(subject_id)));

drop policy if exists avatars_read_authenticated on storage.objects;
create policy avatars_read_visible_profile on storage.objects for select to authenticated
using (
  bucket_id = 'avatars'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (select private.can_view_public_profile(((storage.foldername(name))[1])::uuid))
  )
);

create or replace function public.submit_review(
  p_service_kind public.service_kind,
  p_meeting_id uuid,
  p_job_id uuid,
  p_subject_id uuid,
  p_rating smallint,
  p_comment text default null
)
returns public.reviews
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  allowed boolean := false;
  result public.reviews;
begin
  if actor is null then raise exception 'authentication_required'; end if;
  if actor = p_subject_id then raise exception 'self_review_not_allowed'; end if;
  if p_rating not between 1 and 5 then raise exception 'invalid_rating'; end if;

  if p_service_kind = 'meeting' then
    select exists (
      select 1 from public.meetings m
      where m.id = p_meeting_id and m.status = 'completed'
        and exists (select 1 from public.meeting_participants a where a.meeting_id = m.id and a.user_id = actor)
        and exists (select 1 from public.meeting_participants s where s.meeting_id = m.id and s.user_id = p_subject_id)
    ) into allowed;
  elsif p_service_kind = 'job' then
    select exists (
      select 1 from public.jobs j
      join public.job_assignments ja on ja.job_id = j.id
      where j.id = p_job_id and j.status = 'completed'
        and actor in (j.requester_id, ja.courier_id)
        and p_subject_id in (j.requester_id, ja.courier_id)
    ) into allowed;
  end if;

  if not allowed then raise exception 'completed_shared_service_required'; end if;
  insert into public.reviews (service_kind, meeting_id, job_id, author_id, subject_id, rating, comment)
  values (p_service_kind, p_meeting_id, p_job_id, actor, p_subject_id, p_rating, nullif(trim(p_comment), ''))
  returning * into result;
  return result;
end;
$$;

create or replace function private.refresh_profile_rating()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles p
  set rating_average = summary.average,
      rating_count = summary.total
  from (
    select round(avg(r.rating)::numeric, 2) as average, count(*)::integer as total
    from public.reviews r where r.subject_id = new.subject_id
  ) summary
  where p.id = new.subject_id;
  return new;
end;
$$;

revoke all on function public.submit_review(public.service_kind, uuid, uuid, uuid, smallint, text) from public;
grant execute on function public.submit_review(public.service_kind, uuid, uuid, uuid, smallint, text) to authenticated;
revoke all on function private.refresh_profile_rating() from public, anon, authenticated;

create trigger reviews_refresh_profile_rating
after insert on public.reviews
for each row execute function private.refresh_profile_rating();
