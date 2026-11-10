create table public.meeting_points (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  category text not null check (char_length(trim(category)) between 2 and 60),
  address_label text not null check (char_length(trim(address_label)) between 2 and 180),
  latitude numeric(9,6) not null check (latitude between -90 and 90),
  longitude numeric(9,6) not null check (longitude between -180 and 180),
  city text not null check (char_length(trim(city)) between 2 and 80),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id),
  title text not null check (char_length(trim(title)) between 2 and 100),
  status public.meeting_status not null default 'created',
  selected_point_id uuid references public.meeting_points(id),
  invitation_token_hash text unique,
  invitation_expires_at timestamptz,
  revision bigint not null default 0 check (revision >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint meetings_invitation_pair check ((invitation_token_hash is null) = (invitation_expires_at is null))
);

create table public.meeting_participants (
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  status public.participant_status not null default 'invited',
  approximate_origin_latitude numeric(8,5) check (approximate_origin_latitude is null or approximate_origin_latitude between -90 and 90),
  approximate_origin_longitude numeric(8,5) check (approximate_origin_longitude is null or approximate_origin_longitude between -180 and 180),
  accepted_point_at timestamptz,
  arrived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (meeting_id, user_id),
  constraint meeting_origin_pair check ((approximate_origin_latitude is null) = (approximate_origin_longitude is null))
);

create table public.meeting_point_suggestions (
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  point_id uuid not null references public.meeting_points(id),
  rank smallint not null check (rank between 1 and 3),
  method text not null check (method in ('route', 'geographic_distance')),
  participant_one_distance_m integer not null check (participant_one_distance_m >= 0),
  participant_two_distance_m integer not null check (participant_two_distance_m >= 0),
  participant_one_duration_s integer check (participant_one_duration_s is null or participant_one_duration_s >= 0),
  participant_two_duration_s integer check (participant_two_duration_s is null or participant_two_duration_s >= 0),
  created_at timestamptz not null default now(),
  primary key (meeting_id, point_id),
  unique (meeting_id, rank),
  constraint suggestions_route_duration check (
    (method = 'route' and participant_one_duration_s is not null and participant_two_duration_s is not null)
    or (method = 'geographic_distance' and participant_one_duration_s is null and participant_two_duration_s is null)
  )
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id),
  title text not null check (char_length(trim(title)) between 2 and 100),
  description text not null check (char_length(trim(description)) between 10 and 1200),
  category text not null check (char_length(trim(category)) between 2 and 60),
  declared_product_value_minor bigint check (declared_product_value_minor is null or declared_product_value_minor >= 0),
  currency text not null default 'MXN' check (currency = 'MXN'),
  product_payment_status public.product_payment_status not null,
  pickup_label text not null check (char_length(trim(pickup_label)) between 2 and 180),
  delivery_label text not null check (char_length(trim(delivery_label)) between 2 and 180),
  status public.job_status not null default 'published',
  revision bigint not null default 0 check (revision >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table private.job_locations (
  job_id uuid primary key references public.jobs(id) on delete cascade,
  pickup_latitude numeric(9,6) check (pickup_latitude is null or pickup_latitude between -90 and 90),
  pickup_longitude numeric(9,6) check (pickup_longitude is null or pickup_longitude between -180 and 180),
  delivery_latitude numeric(9,6) check (delivery_latitude is null or delivery_latitude between -90 and 90),
  delivery_longitude numeric(9,6) check (delivery_longitude is null or delivery_longitude between -180 and 180),
  pickup_private_note text,
  delivery_private_note text,
  constraint pickup_coordinates_pair check ((pickup_latitude is null) = (pickup_longitude is null)),
  constraint delivery_coordinates_pair check ((delivery_latitude is null) = (delivery_longitude is null))
);

create table public.bids (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  courier_id uuid not null references public.courier_profiles(user_id),
  proposed_fee_minor bigint not null check (proposed_fee_minor >= 0),
  currency text not null default 'MXN' check (currency = 'MXN'),
  note text check (note is null or char_length(note) <= 500),
  status public.bid_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, courier_id)
);

create table public.job_assignments (
  job_id uuid primary key references public.jobs(id) on delete cascade,
  bid_id uuid not null unique references public.bids(id),
  courier_id uuid not null references public.courier_profiles(user_id),
  assigned_by uuid not null references public.profiles(id),
  assigned_at timestamptz not null default now(),
  constraint assignment_requester_distinct check (courier_id <> assigned_by)
);

create trigger meeting_points_set_updated_at before update on public.meeting_points for each row execute function private.set_updated_at();
create trigger meetings_set_updated_at before update on public.meetings for each row execute function private.set_updated_at();
create trigger meeting_participants_set_updated_at before update on public.meeting_participants for each row execute function private.set_updated_at();
create trigger jobs_set_updated_at before update on public.jobs for each row execute function private.set_updated_at();
create trigger bids_set_updated_at before update on public.bids for each row execute function private.set_updated_at();

create index meeting_participants_user_idx on public.meeting_participants (user_id, meeting_id);
create index meetings_status_updated_idx on public.meetings (status, updated_at desc);
create index meeting_points_city_active_idx on public.meeting_points (city, active);
create index jobs_requester_status_idx on public.jobs (requester_id, status, updated_at desc);
create index jobs_open_idx on public.jobs (status, created_at desc) where status in ('published', 'bidding');
create index bids_job_status_idx on public.bids (job_id, status, created_at);
create index bids_courier_idx on public.bids (courier_id, created_at desc);
