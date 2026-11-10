alter table public.profiles enable row level security;
alter table public.courier_profiles enable row level security;
alter table public.user_blocks enable row level security;
alter table public.meeting_points enable row level security;
alter table public.meetings enable row level security;
alter table public.meeting_participants enable row level security;
alter table public.meeting_point_suggestions enable row level security;
alter table public.jobs enable row level security;
alter table public.bids enable row level security;
alter table public.job_assignments enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.transactions enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;
alter table public.notifications enable row level security;

alter table private.profile_contacts enable row level security;
alter table private.job_locations enable row level security;
alter table private.handoff_codes enable row level security;

create or replace function private.is_complete_user(target_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select target_user is not null and exists (
    select 1 from public.profiles p
    where p.id = target_user and p.status = 'complete'
  );
$$;

create or replace function private.is_meeting_participant(target_meeting uuid, target_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select target_user is not null and exists (
    select 1 from public.meeting_participants mp
    where mp.meeting_id = target_meeting and mp.user_id = target_user
  );
$$;

create or replace function private.is_job_participant(target_job uuid, target_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select target_user is not null and exists (
    select 1 from public.jobs j where j.id = target_job and j.requester_id = target_user
  ) or exists (
    select 1 from public.job_assignments ja where ja.job_id = target_job and ja.courier_id = target_user
  );
$$;

create or replace function private.is_conversation_participant(target_conversation uuid, target_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select target_user is not null and exists (
    select 1 from public.conversations c
    where c.id = target_conversation
      and (
        (c.meeting_id is not null and private.is_meeting_participant(c.meeting_id, target_user))
        or (c.job_id is not null and private.is_job_participant(c.job_id, target_user))
      )
  );
$$;

revoke all on function private.is_complete_user(uuid) from public;
revoke all on function private.is_meeting_participant(uuid, uuid) from public;
revoke all on function private.is_job_participant(uuid, uuid) from public;
revoke all on function private.is_conversation_participant(uuid, uuid) from public;
grant usage on schema private to authenticated;
grant execute on function private.is_complete_user(uuid) to authenticated;
grant execute on function private.is_meeting_participant(uuid, uuid) to authenticated;
grant execute on function private.is_job_participant(uuid, uuid) to authenticated;
grant execute on function private.is_conversation_participant(uuid, uuid) to authenticated;

create policy profiles_read_self on public.profiles for select to authenticated
using ((select auth.uid()) = id);
create policy courier_profiles_read_self on public.courier_profiles for select to authenticated
using ((select auth.uid()) = user_id);
create policy user_blocks_manage_own on public.user_blocks for all to authenticated
using ((select auth.uid()) = blocker_id)
with check ((select auth.uid()) = blocker_id);

create policy meeting_points_read_active on public.meeting_points for select to authenticated
using (active and (select private.is_complete_user()));
create policy meetings_read_participant on public.meetings for select to authenticated
using (creator_id = (select auth.uid()) or (select private.is_meeting_participant(id)));
create policy meetings_create_own on public.meetings for insert to authenticated
with check ((select auth.uid()) = creator_id and (select private.is_complete_user()));
create policy meeting_participants_read_group on public.meeting_participants for select to authenticated
using ((select private.is_meeting_participant(meeting_id)));
create policy meeting_participants_creator_invites on public.meeting_participants for insert to authenticated
with check (exists (
  select 1 from public.meetings m
  where m.id = meeting_id and m.creator_id = (select auth.uid()) and m.status in ('created', 'invited')
));
create policy meeting_suggestions_read_group on public.meeting_point_suggestions for select to authenticated
using ((select private.is_meeting_participant(meeting_id)));

create policy jobs_read_involved_or_open on public.jobs for select to authenticated
using (
  requester_id = (select auth.uid())
  or (select private.is_job_participant(id))
  or (status in ('published', 'bidding') and (select private.is_complete_user()) and exists (
    select 1 from public.courier_profiles cp where cp.user_id = (select auth.uid()) and cp.enabled and cp.suspended_at is null
  ))
);
create policy jobs_create_own on public.jobs for insert to authenticated
with check (requester_id = (select auth.uid()) and (select private.is_complete_user()));
create policy bids_read_involved on public.bids for select to authenticated
using (courier_id = (select auth.uid()) or exists (
  select 1 from public.jobs j where j.id = job_id and j.requester_id = (select auth.uid())
));
create policy bids_create_own on public.bids for insert to authenticated
with check (courier_id = (select auth.uid()) and exists (
  select 1 from public.courier_profiles cp
  join public.jobs j on j.id = job_id
  where cp.user_id = (select auth.uid()) and cp.enabled and cp.suspended_at is null
    and j.requester_id <> (select auth.uid()) and j.status in ('published', 'bidding')
));
create policy bids_update_own on public.bids for update to authenticated
using (courier_id = (select auth.uid()) and status = 'active')
with check (courier_id = (select auth.uid()) and status in ('active', 'withdrawn'));
create policy assignments_read_involved on public.job_assignments for select to authenticated
using (courier_id = (select auth.uid()) or assigned_by = (select auth.uid()));

create policy conversations_read_participant on public.conversations for select to authenticated
using ((select private.is_conversation_participant(id)));
create policy messages_read_participant on public.messages for select to authenticated
using ((select private.is_conversation_participant(conversation_id)));
create policy messages_create_participant on public.messages for insert to authenticated
with check (sender_id = (select auth.uid()) and (select private.is_conversation_participant(conversation_id)));

create policy transactions_read_party on public.transactions for select to authenticated
using (payer_id = (select auth.uid()) or courier_id = (select auth.uid()));
create policy reviews_read_authenticated on public.reviews for select to authenticated
using (true);
create policy reviews_create_author on public.reviews for insert to authenticated
with check (author_id = (select auth.uid()) and (select private.is_complete_user()));
create policy reports_read_own on public.reports for select to authenticated
using (reporter_id = (select auth.uid()));
create policy reports_create_own on public.reports for insert to authenticated
with check (reporter_id = (select auth.uid()));
create policy notifications_read_own on public.notifications for select to authenticated
using (user_id = (select auth.uid()));
create policy notifications_update_own on public.notifications for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

revoke all on all tables in schema public from anon;
grant select on public.profiles, public.courier_profiles, public.user_blocks, public.meeting_points,
  public.meetings, public.meeting_participants, public.meeting_point_suggestions, public.jobs,
  public.bids, public.job_assignments, public.conversations, public.messages, public.transactions,
  public.reviews, public.reports, public.notifications to authenticated;
grant insert on public.user_blocks, public.meetings, public.meeting_participants, public.jobs,
  public.bids, public.messages, public.reviews, public.reports to authenticated;
grant update on public.bids, public.notifications to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('service-media', 'service-media', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy avatars_read_authenticated on storage.objects for select to authenticated
using (bucket_id = 'avatars');
create policy avatars_insert_own on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy avatars_update_own on storage.objects for update to authenticated
using (bucket_id = 'avatars' and owner_id = (select auth.uid())::text)
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy avatars_delete_own on storage.objects for delete to authenticated
using (bucket_id = 'avatars' and owner_id = (select auth.uid())::text);

create policy service_media_read_participant on storage.objects for select to authenticated
using (bucket_id = 'service-media' and exists (
  select 1 from public.conversations c
  where c.id::text = (storage.foldername(name))[1]
    and (select private.is_conversation_participant(c.id))
));
create policy service_media_insert_participant on storage.objects for insert to authenticated
with check (bucket_id = 'service-media' and exists (
  select 1 from public.conversations c
  where c.id::text = (storage.foldername(name))[1]
    and (select private.is_conversation_participant(c.id))
));
