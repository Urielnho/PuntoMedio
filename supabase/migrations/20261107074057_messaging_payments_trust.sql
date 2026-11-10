create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  service_kind public.service_kind not null,
  meeting_id uuid unique references public.meetings(id) on delete cascade,
  job_id uuid unique references public.jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint conversation_exactly_one_service check (
    (service_kind = 'meeting' and meeting_id is not null and job_id is null)
    or (service_kind = 'job' and job_id is not null and meeting_id is null)
  )
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text,
  attachment_path text,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  constraint message_has_content check (nullif(trim(body), '') is not null or attachment_path is not null),
  constraint message_body_length check (body is null or char_length(body) <= 2000),
  constraint message_attachment_scope check (attachment_path is null or attachment_path like conversation_id::text || '/%')
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references public.jobs(id),
  payer_id uuid not null references public.profiles(id),
  courier_id uuid not null references public.courier_profiles(user_id),
  bid_id uuid not null unique references public.bids(id),
  mode text not null default 'simulated' check (mode = 'simulated'),
  service_fee_minor bigint not null check (service_fee_minor >= 0),
  platform_fee_minor bigint not null check (platform_fee_minor >= 0),
  optional_tip_minor bigint not null default 0 check (optional_tip_minor >= 0),
  total_minor bigint generated always as (service_fee_minor + platform_fee_minor + optional_tip_minor) stored,
  currency text not null default 'MXN' check (currency = 'MXN'),
  status public.transaction_status not null default 'pending',
  idempotency_key uuid not null unique,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transaction_parties_differ check (payer_id <> courier_id),
  constraint transaction_confirmation_pair check ((status = 'confirmed') = (confirmed_at is not null))
);

create table private.handoff_codes (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  stage public.handoff_stage not null,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0 check (attempts >= 0),
  max_attempts integer not null default 5 check (max_attempts between 1 and 10),
  consumed_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (job_id, stage),
  constraint handoff_expiry_future check (expires_at > created_at),
  constraint handoff_attempt_bounds check (attempts <= max_attempts)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  service_kind public.service_kind not null,
  meeting_id uuid references public.meetings(id),
  job_id uuid references public.jobs(id),
  author_id uuid not null references public.profiles(id),
  subject_id uuid not null references public.profiles(id),
  rating smallint not null check (rating between 1 and 5),
  comment text check (comment is null or char_length(comment) <= 800),
  created_at timestamptz not null default now(),
  constraint review_not_self check (author_id <> subject_id),
  constraint review_exactly_one_service check (
    (service_kind = 'meeting' and meeting_id is not null and job_id is null)
    or (service_kind = 'job' and job_id is not null and meeting_id is null)
  ),
  unique nulls not distinct (author_id, subject_id, meeting_id, job_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id),
  subject_id uuid references public.profiles(id),
  meeting_id uuid references public.meetings(id),
  job_id uuid references public.jobs(id),
  category text not null check (char_length(trim(category)) between 2 and 60),
  details text not null check (char_length(trim(details)) between 10 and 1500),
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint report_has_target check (subject_id is not null or meeting_id is not null or job_id is not null),
  constraint report_not_self check (subject_id is null or reporter_id <> subject_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (char_length(trim(kind)) between 2 and 60),
  title text not null check (char_length(trim(title)) between 2 and 120),
  body text not null check (char_length(trim(body)) between 2 and 500),
  service_kind public.service_kind,
  service_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create trigger transactions_set_updated_at before update on public.transactions for each row execute function private.set_updated_at();
create trigger reports_set_updated_at before update on public.reports for each row execute function private.set_updated_at();

create index messages_conversation_created_idx on public.messages (conversation_id, created_at desc);
create index transactions_payer_idx on public.transactions (payer_id, created_at desc);
create index transactions_courier_idx on public.transactions (courier_id, created_at desc);
create index reviews_subject_idx on public.reviews (subject_id, created_at desc);
create index reports_reporter_idx on public.reports (reporter_id, created_at desc);
create index notifications_user_unread_idx on public.notifications (user_id, created_at desc) where read_at is null;
