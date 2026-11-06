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
