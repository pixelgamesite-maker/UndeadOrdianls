# Supabase setup — Undead Ordinals

The site works with no backend (you can browse every page), but the
**raffle entry** and **holder verification** need Supabase. Here's the
full wiring, start to finish.

## 1. Create the project
1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Note the **Project URL** and the **anon public** key
   (Settings → API). These become the two `VITE_SUPABASE_*` env vars on
   the frontend (Railway variables — see the root `DEPLOY.md`).

## 2. Create the tables
Open **SQL Editor** → paste the contents of [`schema.sql`](./schema.sql)
→ **Run**. This creates `wl_applications`, `holder_eligibility` and
`spot_claims` with the right row-level-security policies.

## 3. Deploy the Edge Function
The claim flow is gated by an Edge Function so eligibility can't be
bypassed from the browser.

```bash
# one-time
npm i -g supabase
supabase login
supabase link --project-ref <your-project-ref>

# deploy
supabase functions deploy claim-spot
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected into the
function automatically — you do **not** set them yourself, and the
service-role key must **never** appear in the frontend.

## 4. Import the holder snapshot
This is what makes "verify without connecting a wallet" possible.

1. Pull each OG collection's current holders from an indexer
   (Ordinals: e.g. the Ordinals API / Magic Eden / Hiro; ETH: e.g.
   Alchemy / Reservoir). Export a CSV with **two columns**:

   ```csv
   address,community
   bc1p5d7rjq...sfr9rusxg3297,NodeMonkes
   0xabc...123,Basedangels
   ```

   - `community` must match a `COMMUNITIES[].key` in
     `src/lib/theme.ts` (case-insensitive).
   - EVM addresses: store **lowercase**. Bitcoin addresses:
     store **exactly** as the indexer reports (case-sensitive).

2. **Table Editor → `holder_eligibility` → Import data from CSV.**

Re-import / top up any time; the unique `(address, community)` constraint
means re-imports won't create duplicates (use *upsert* on import).

## 5. Done
- `wl_applications` fills as people enter the raffle/waitlist.
- `spot_claims` fills as verified holders claim — the `/verify` page
  shows the live count.
- Export either table as CSV whenever you need the mint list.

### Which address families are accepted
The format check accepts Bitcoin (`bc1p…` taproot, plus legacy/segwit)
and EVM (`0x…`). Verification only ever *succeeds* for an address that is
actually in `holder_eligibility`, so the snapshot is the real gate.
