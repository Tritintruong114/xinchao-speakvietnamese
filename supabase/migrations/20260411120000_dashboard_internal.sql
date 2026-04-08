-- Internal dashboard secrets & secondary admin accounts (service role only; RLS on, no public policies).

create table if not exists public.dashboard_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.dashboard_admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.dashboard_settings enable row level security;
alter table public.dashboard_admins enable row level security;
