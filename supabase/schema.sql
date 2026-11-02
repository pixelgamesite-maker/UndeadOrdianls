-- ════════════════════════════════════════════════════════════════
--  UNDEAD ORDINALS — Supabase schema
--  Run this once in the Supabase SQL editor (or `supabase db push`).
--  It creates three tables and the row-level-security policies that
--  make the no-wallet-connect verification safe.
-- ════════════════════════════════════════════════════════════════

-- ── 1. Public raffle / waitlist entries ─────────────────────────
--  The browser (anon key) may INSERT here and nothing else. Entries
--  can't be read back by the public, so the list can't be scraped.
create table if not exists public.wl_applications (
  id          bigint generated always as identity primary key,
  address     text not null unique,
  twitter     text not null,
  quote_url   text,
  comment_url text,
  phase       text not null default 'raffle',
  created_at  timestamptz not null default now()
);

alter table public.wl_applications enable row level security;

drop policy if exists "anon can insert applications" on public.wl_applications;
create policy "anon can insert applications"
  on public.wl_applications for insert
  to anon
  with check (true);
-- (No select/update/delete policy → anon cannot read, change or remove rows.)


-- ── 2. Holder snapshot (eligibility) ────────────────────────────
--  Imported from an indexer snapshot of each OG collection's holders.
--  NO anon policy at all → the browser can never read or write this.
--  Only the claim-spot Edge Function (service-role) can touch it.
create table if not exists public.holder_eligibility (
  id         bigint generated always as identity primary key,
  address    text not null,
  community  text not null,
  created_at timestamptz not null default now(),
  unique (address, community)
);

create index if not exists holder_eligibility_addr_idx
  on public.holder_eligibility (address);

alter table public.holder_eligibility enable row level security;
-- intentionally NO policies → locked to service-role only.


-- ── 3. Confirmed verified-holder spots ──────────────────────────
--  Written only by the Edge Function. Anon may read the COUNT (for the
--  live demand counter on /verify) but not insert/update/delete.
create table if not exists public.spot_claims (
  id          bigint generated always as identity primary key,
  spot_number bigint generated always as identity,
  address     text not null unique,
  community   text not null,
  created_at  timestamptz not null default now()
);

alter table public.spot_claims enable row level security;

drop policy if exists "anon can read claims" on public.spot_claims;
create policy "anon can read claims"
  on public.spot_claims for select
  to anon
  using (true);
-- (No insert/update/delete policy for anon → only the service-role
--  Edge Function can write a claim.)


-- ════════════════════════════════════════════════════════════════
--  Importing a holder snapshot
--  -----------------------------------------------------------------
--  Build a CSV with columns: address,community
--  e.g.
--     address,community
--     bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297,NodeMonkes
--     0xabc...123,Basedangels
--
--  Then in the Supabase dashboard:
--    Table editor → holder_eligibility → Import data from CSV.
--  The `community` value MUST match a COMMUNITIES[].key in
--  src/lib/theme.ts (compared case-insensitively by the function).
--
--  EVM addresses should be stored lowercase. Bitcoin addresses are
--  case-sensitive — store them exactly as the indexer reports them.
-- ════════════════════════════════════════════════════════════════
