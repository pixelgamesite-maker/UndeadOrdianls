# Undead Ordinals — build, run & deploy

A pixel-horror site for the Undead Ordinals mint. **Vite + React + TypeScript**,
animated with framer-motion, backed by **Supabase**, deployed on **Railway**.

- Raffle / public-waitlist entry (gamified X-engagement flow)
- No-wallet-connect holder verification (address checked against a snapshot)
- Live demand counter, lore, collection, Catacombs game explainer, whitepaper
- One campaign-phase switch drives the whole site's CTAs

---

## 1. Run it locally

```bash
npm install
npm run dev        # http://localhost:8080
```

The site renders fully with no backend — only the raffle submit and the
verify/claim need Supabase (see below).

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
| Eligible OG communities | `COMMUNITIES` |
| Spot ceiling / show-remaining | `CLAIM_TOTAL`, `SHOW_REMAINING` |
| Character art mapping | `ASSET` |

Lore/copy (factions, tiers, chambers, roadmap, FAQ) lives in
[`src/lib/lore.ts`](./src/lib/lore.ts).

### Campaign phases
`ACTIVE_PHASE` is one of `teaser | raffle | waitlist | minting | minted`.
It changes the hero banner and the primary CTA across the whole site, so you
can **re-order the campaign** (e.g. open the public waitlist before the OG
raffle) by changing one string and redeploying. Phases are independent.

## 3. Supabase (raffle + verification)

Full step-by-step in [`supabase/README.md`](./supabase/README.md). Short version:

1. Create a Supabase project; grab the **Project URL** + **anon** key.
2. SQL Editor → run [`supabase/schema.sql`](./supabase/schema.sql).
3. Deploy the gated claim function:
   ```bash
   supabase link --project-ref <ref>
   supabase functions deploy claim-spot
   ```
4. Import your holder snapshot CSV (`address,community`) into
   `holder_eligibility`. This is what makes "verify without connecting a
   wallet" possible — the snapshot is the gate.

> The browser only ever gets the **anon** key. Eligibility is checked inside
> the Edge Function with the **service-role** key, so it can't be bypassed by
> calling the API directly. Never put the service-role key in the frontend.

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
- [ ] `COMMUNITIES` reflects the collections you're actually gating
- [ ] `holder_eligibility` imported from a fresh snapshot
- [ ] `claim-spot` function deployed; `TOTAL_SPOTS` in it matches `CLAIM_TOTAL`
- [ ] `ACTIVE_PHASE` set to the phase you're opening with
- [ ] Supabase env vars set in Railway; redeployed
- [ ] Replace the Warden art in `ASSET.warden` once final art lands
- [ ] Swap favicon / OG image if desired (`public/favicon.png`, `public/LOGO.jpg`)

## Stack notes
- No wallet library (wagmi/RainbowKit) — verification is address-paste against a
  snapshot, which is both safer for users and what the campaign calls for.
- `public/1.png`, `2.png`, `3.png`, `5.png` are art-tool screenshots and are
  **not** used by the site; the finished art is `LOGO.jpg`, `skull_2.png`,
  `skull_4.png`, `SKELETON_ONE.png`.
