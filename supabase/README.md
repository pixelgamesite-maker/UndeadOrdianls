# Supabase setup — Undead Ordinals whitelist

The site works with no backend (you can browse every page and the
whitelist flow runs locally). To actually **capture whitelist
registrations**, connect Supabase. One table, three steps.

## 1. Create the project
1. [supabase.com](https://supabase.com) → **New project**.
2. Note the **Project URL** and the **anon public** key
   (Settings → API). These become the two `VITE_SUPABASE_*` env vars on
   the Railway service.

## 2. Create the table
Open **SQL Editor** → paste the contents of [`schema.sql`](./schema.sql)
→ **Run**. This creates `wl_applications` with a row-level-security
policy that lets the browser insert registrations but never read, edit
or delete them (so the list can't be scraped).

## 3. Point the site at it
Set these on the Railway service and redeploy (Vite bakes them in at
**build** time, so a redeploy is required — not just a restart):

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## Done
Each whitelist submission inserts a row into `wl_applications`. Read them
back in **Table Editor → wl_applications** and export to CSV for the mint
list. The unique constraint on `address` stops the same address
registering twice.
