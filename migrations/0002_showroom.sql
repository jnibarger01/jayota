-- Digital showroom domain tables. Auth tables live in 0001_auth.sql.
-- user_id is TEXT to match Better Auth ids (preview uses 'dev-user').

create table if not exists configurations (
  id text primary key,
  user_id text,
  vehicle_id text not null,
  model_year integer not null,
  model text not null,
  grade_id text not null,
  owner_token_hash text not null,
  selections text not null,
  camera_state text,
  paint_studio text,
  revision integer not null default 1,
  schema_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists configurations_vehicle_idx on configurations (vehicle_id);
create index if not exists configurations_user_idx on configurations (user_id);

create table if not exists configuration_revisions (
  id text primary key,
  configuration_id text not null references configurations(id) on delete cascade,
  revision integer not null,
  selections text not null,
  camera_state text,
  paint_studio text,
  created_at timestamptz not null default now()
);
create index if not exists configuration_revisions_config_idx
  on configuration_revisions (configuration_id, revision);

create table if not exists leads (
  id text primary key,
  user_id text,
  kind text not null,
  name text not null,
  email text not null,
  phone text,
  vehicle_slug text,
  message text not null,
  status text not null default 'received',
  idempotency_key text unique,
  request_id text not null,
  created_at timestamptz not null default now()
);
create index if not exists leads_created_idx on leads (created_at desc);

create table if not exists service_appointments (
  id text primary key,
  user_id text,
  name text not null,
  email text not null,
  phone text,
  vin text,
  year text,
  model text,
  mileage text,
  service_type text not null,
  concern text not null,
  preferred_date text not null,
  preferred_window text not null,
  transportation text not null default 'unknown',
  notes text,
  status text not null default 'request_received',
  confirmation_source text not null default 'intake_only',
  idempotency_key text unique,
  request_id text not null,
  created_at timestamptz not null default now()
);
create index if not exists service_appointments_created_idx on service_appointments (created_at desc);

create table if not exists trade_in_requests (
  id text primary key,
  user_id text,
  name text not null,
  email text not null,
  phone text,
  vin text,
  year text,
  make text,
  model text,
  mileage text,
  condition text not null,
  notes text,
  status text not null default 'received',
  valuation_status text not null default 'unavailable',
  idempotency_key text unique,
  request_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists test_drive_requests (
  id text primary key,
  user_id text,
  name text not null,
  email text not null,
  phone text,
  vehicle_slug text not null,
  preferred_date text not null,
  preferred_window text not null,
  notes text,
  status text not null default 'received',
  idempotency_key text unique,
  request_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists saved_vehicles (
  id text primary key,
  user_id text not null,
  vehicle_slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, vehicle_slug)
);
create index if not exists saved_vehicles_user_idx on saved_vehicles (user_id);

create table if not exists saved_configurations (
  id text primary key,
  user_id text not null,
  configuration_id text not null,
  vehicle_slug text not null,
  label text,
  created_at timestamptz not null default now()
);
create index if not exists saved_configurations_user_idx on saved_configurations (user_id);

create table if not exists audit_events (
  id text primary key,
  request_id text not null,
  actor_user_id text,
  action text not null,
  entity_type text not null,
  entity_id text,
  created_at timestamptz not null default now()
);
create index if not exists audit_events_created_idx on audit_events (created_at desc);

create table if not exists content_blocks (
  id text primary key,
  slot text not null unique,
  title text,
  body text not null,
  image_url text,
  updated_at timestamptz not null default now()
);
