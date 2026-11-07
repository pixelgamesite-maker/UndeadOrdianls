-- ════════════════════════════════════════════════════════════════
--  UNDEAD ORDINALS — Supabase schema (whitelist)
--  Run this once in the Supabase SQL editor (or `supabase db push`).
-- ════════════════════════════════════════════════════════════════

-- ── Whitelist registrations ─────────────────────────────────────
--  The browser (anon key) may INSERT here and nothing else. Rows
--  can't be read, changed or deleted by the public, so the list
--  can't be scraped. Export it from the Supabase Table Editor when
--  you need the mint list.
create table if not exists public.wl_applications (
  id          bigint generated always as identity primary key,
  address     text not null unique,            -- mint address (bc1p… or 0x…)
  twitter     text not null,                   -- X handle (without the @)
  quote_url   text,                            -- their quote-post link
  comment_url text,                            -- their comment link
  phase       text not null default 'raffle',  -- campaign phase at entry
  created_at  timestamptz not null default now()
);

alter table public.wl_applications enable row level security;

drop policy if exists "anon can insert applications" on public.wl_applications;
create policy "anon can insert applications"
  on public.wl_applications for insert
  to anon
  with check (true);
-- (No select/update/delete policy → anon cannot read, change or remove rows.)


-- ── Whitelist allocations (eligibility checker) ─────────────────
--  The published mint allocation list. Two categories:
--    GTD  — guaranteed allocation
--    FCFS — first come, first served
--  Populate it from the Table Editor (or a CSV import) before mint.
create table if not exists public.wl_allocations (
  address    text primary key,                 -- mint address (bc1p… or 0x…)
  tier       text not null check (tier in ('GTD','FCFS')),
  note       text,                              -- optional (community, round…)
  created_at timestamptz not null default now()
);

alter table public.wl_allocations enable row level security;
-- No policies at all → the public (anon) CANNOT select the table
-- directly, so the full list can't be scraped. Lookups go through the
-- function below, which only ever returns one address at a time.

-- Single-address eligibility lookup. SECURITY DEFINER lets it read the
-- table past RLS, but it only returns the tier for the exact address
-- the caller passes in. Case/space-insensitive on the address.
create or replace function public.check_allocation(addr text)
returns text
language sql
security definer
set search_path = public
as $$
  select tier
  from public.wl_allocations
  where lower(address) = lower(trim(addr))
  limit 1;
$$;

revoke all on function public.check_allocation(text) from public;
grant execute on function public.check_allocation(text) to anon, authenticated;

-- Example rows (delete these; add the real list before launch):
-- insert into public.wl_allocations (address, tier, note) values
--   ('bc1pexamplegtdaddressxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'GTD',  'OG raffle'),
--   ('bc1pexamplefcfsaddressxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'FCFS', 'public');
