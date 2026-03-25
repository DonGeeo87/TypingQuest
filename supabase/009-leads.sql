create table if not exists public.leads (
  id uuid primary key default extensions.uuid_generate_v4(),
  email text not null unique,
  source text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

drop policy if exists "Anyone can insert leads" on public.leads;
create policy "Anyone can insert leads"
  on public.leads for insert
  with check (true);

grant insert on public.leads to anon;
grant insert on public.leads to authenticated;

