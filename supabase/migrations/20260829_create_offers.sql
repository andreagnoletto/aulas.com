create extension if not exists "uuid-ossp";

create table public.offers (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  amount text,
  message text,
  lang text not null default 'pt'
);

alter table public.offers enable row level security;
-- No policies: only service role can write
