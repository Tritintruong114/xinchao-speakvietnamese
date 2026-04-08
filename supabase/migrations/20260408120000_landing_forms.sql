-- Landing page lead capture (inserts from Next.js API using service_role only).

create table if not exists public.landing_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  source text not null default 'landing-waitlist'
);

create index if not exists landing_waitlist_created_at_idx on public.landing_waitlist (created_at desc);

alter table public.landing_waitlist enable row level security;

create table if not exists public.landing_contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  source text not null default 'landing-contact'
);

create index if not exists landing_contact_submissions_created_at_idx
  on public.landing_contact_submissions (created_at desc);

alter table public.landing_contact_submissions enable row level security;

-- No policies: anon/authenticated cannot read/write. Service role bypasses RLS for server-side inserts.
