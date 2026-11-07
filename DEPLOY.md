# Undead Ordinals — build, run & deploy

A pixel-horror site for the Undead Ordinals mint. **Vite + React + TypeScript**,
animated with framer-motion, backed by **Supabase**, deployed on **Railway**.

- Title-screen intro, game menu, background music + click SFX
- Whitelist registration (gamified X-engagement flow → Supabase)
- Catacombs stage-select (crypts), collection, Codex
- One primary CTA that routes into the whitelist application

---

## 1. Run it locally

```bash
npm install
npm run dev        # http://localhost:8080
```

The site renders fully with no backend — only saving whitelist
registrations needs Supabase (see below).

```bash
npm run build      # production build → dist/
npm run serve      # serve the production build (what Railway runs)
npm run typecheck  # tsc, no emit
```

## 2. Configure (one file)

**Almost everything a non-engineer edits lives in [`src/lib/theme.ts`](./src/lib/theme.ts):**

| Thing | Constant |
|---|---|
| Collection supply | `PROJECT.supply` |
| X account / handle / pinned post | `X_URL`, `X_HANDLE`, `PINNED_URL` |
| Which campaign phase is live | `ACTIVE_PHASE` |
| Whitelist open vs "opens soon" | `WHITELIST_LIVE` |
| Character / scene art mapping | `ASSET`, `TIER_IMG` |

Lore/copy (factions, tiers, chambers, roadmap, FAQ) lives in
[`src/lib/lore.ts`](./src/lib/lore.ts).

### Campaign phases
`ACTIVE_PHASE` is one of `teaser | raffle | waitlist | minting | minted`.
It changes the hero banner and the primary CTA across the whole site, so you
can **re-order the campaign** (e.g. open the public waitlist before the OG
raffle) by changing one string and redeploying. Phases are independent.

## 3. Supabase (whitelist registrations)

Full step-by-step in [`supabase/README.md`](./supabase/README.md). Short version:

1. Create a Supabase project; grab the **Project URL** + **anon** key.
2. SQL Editor → run [`supabase/schema.sql`](./supabase/schema.sql). It
   creates two tables: `wl_applications` (whitelist registrations) and
   `wl_allocations` (the GTD/FCFS eligibility list the `/check` page
   reads, via a one-address-at-a-time lookup function).
3. Populate `wl_allocations` before mint (Table Editor or CSV import):
   one row per address with `tier` set to `GTD` or `FCFS`. Until it's
   connected the `/check` page runs in a clearly-labelled preview mode.
4. Set the two `VITE_SUPABASE_*` vars on Railway (step 4) and redeploy.

> The browser only gets the **anon** key, which can **insert** a
> registration and nothing else — it can't read, edit or delete rows, so
> the list can't be scraped. Export entries from the Supabase Table
> Editor. Until Supabase is connected the whitelist flow still runs
> locally; it just doesn't persist.

## 4. Deploy to Railway

1. **New Project → Deploy from GitHub repo** → pick this repo.
2. Railway reads [`railway.json`](./railway.json):
   - Build: `npm ci && npm run build`
   - Start: `npm run serve` (serves `dist/` on `$PORT`)
3. Add service **Variables**:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
   > Vite bakes these in at **build** time — after changing them, trigger a
   > redeploy, not just a restart.
4. Deploy, then add your custom domain under the service's **Settings → Networking**.

That's it — Railway builds on every push to the default branch.

## 5. Go-live checklist

- [ ] `PROJECT.supply` set to the final number
- [ ] `X_URL` / `X_HANDLE` / `PINNED_URL` point at the real account + pinned post
- [ ] `WHITELIST_LIVE` set (true = registration open, false = "opens soon")
- [ ] `ACTIVE_PHASE` set to the phase you're opening with
- [ ] Supabase table created + env vars set in Railway; redeployed
- [ ] Replace the Warden art in `ASSET.warden` once final art lands
- [ ] Swap favicon / OG image if desired (`public/favicon.png`, `public/LOGO.jpg`)

## Stack notes
- No wallet library (wagmi/RainbowKit). The whitelist takes a pasted mint
  address; users never connect a wallet or sign anything.
- Holder-verification (snapshot / eligibility / claims) was intentionally
  removed — it's a later build.
- `public/1.png`, `2.png`, `3.png`, `5.png` are art-tool screenshots and are
  **not** used by the site; the finished art is `LOGO.jpg`, `skull_2.png`,
  `skull_4.png`, `SKELETON_ONE.png`.
