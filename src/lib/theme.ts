/* ──────────────────────────────────────────────────────────────
   UNDEAD ORDINALS — design tokens & project config

   One cold black base. A single electric "blue-flame" cyan as the
   primary (it's the colour of the logo skull), with the four faction
   heats as accents. Nothing here is a neutral grey — every dark value
   is tinted cold, every light value is bone.

   EVERYTHING a non-engineer would want to change (supply, dates,
   links, which campaign phase is live) lives in this file.
   ────────────────────────────────────────────────────────────── */

export const C = {
  void:   "#05060A",  // page base — cold black
  crypt:  "#0A0C13",  // raised panels
  tomb:   "#11141F",  // borders, inputs
  tombUp: "#1B2030",  // hover borders
  ice:    "#37E0FF",  // PRIMARY — phantom blue-flame (actions, links)
  iceDim: "#1C7E96",  // dim cyan, used for rims/seams
  volt:   "#8A6CFF",  // arcane violet — secondary glow
  ember:  "#FF4332",  // berserker heat — value, danger, alerts
  gold:   "#F4B740",  // relic / $GRAVE accent
  bone:   "#F2EAD9",  // text
  muted:  "rgba(242,234,217,0.56)",
  faint:  "rgba(242,234,217,0.30)",
  line:   "rgba(242,234,217,0.09)",
} as const;

/** The four factions, each with its signature heat. */
export const FACTION_COLOR = {
  phantom:   "#37E0FF", // Phase-Shift Phantoms — glitch cyan
  berserker: "#FF5A2E", // Coronal Berserkers — flame
  neomancer: "#B14DFF", // Synthesized Neomancers — arcane violet
  warden:    "#8FB2CC", // Titanium Wardens — cold steel
} as const;

/* ── Typography ───────────────────────────────────────────────
   Three tiers:
   - display : "Press Start 2P"  — arcade impact, used sparingly
   - body    : "Pixelify Sans"   — readable pixel face for prose/UI
   - mono    : "VT323"           — terminal readouts, data, addresses
   (The <link> is already in index.html so there's no FOUC.)        */
export const display = "'Press Start 2P', 'Courier New', monospace";
export const body = "'Pixelify Sans', 'Trebuchet MS', sans-serif";
export const mono = "'VT323', 'Courier New', monospace";

/* ════════════════════════════════════════════════════════════════
   PROJECT CONSTANTS — edit these, not the components.
   ════════════════════════════════════════════════════════════════ */

export const PROJECT = {
  name: "Undead Ordinals",
  tagline: "The Dead Don't Stay Dead on Bitcoin.",
  /* Supply: the whitepaper fixes this at 3,232. The campaign note says
     "6K or less, final number TBC" — change this one value and it
     updates everywhere on the site. */
  supply: 3232,
  chain: "Bitcoin",
  token: "$GRAVE",
  tokenSupply: "21,000,000",
} as const;

/* ── Links ── (swap these for the real accounts before launch) ── */
export const X_URL = "https://x.com/UndeadOrdinals";
export const X_HANDLE = "@UndeadOrdinals";
/* The pinned post everyone likes / quotes / comments on during the raffle. */
export const PINNED_URL = "https://x.com/UndeadOrdinals";
export const MAGICEDEN = "https://magiceden.io/ordinals";
export const DISCORD = ""; // optional — leave "" to hide the Discord link

/* ── Assets in /public ── */
export const ASSET = {
  logo:      "/LOGO.jpg",
  phantom:   "/SKELETON_ONE.png", // cyan laser-eye skeleton
  berserker: "/skull_2.png",      // red-flame skeleton
  neomancer: "/skull_4.png",      // exposed-brain cyber skeleton
  warden:    "/LOGO.jpg",         // blue-flame skull (stand-in until Warden art lands)
} as const;

/* ════════════════════════════════════════════════════════════════
   CAMPAIGN PHASE CONTROL

   The whole mint runs in ordered phases. `ACTIVE_PHASE` decides what
   the site pushes people toward (the hero CTA, the /raffle gate).
   Flip this one string as each phase opens — no code changes needed.

     "teaser"   — pre-launch. No entry yet; collect interest / hype.
     "raffle"   — OG Ordinals + ETH verified-holder raffle is LIVE.
     "waitlist" — public waitlist is LIVE (open to everyone).
     "minting"  — mint is live.
     "minted"   — sold out / post-mint.

   Each phase is independent, so you can re-order the campaign
   (e.g. open the public waitlist before the raffle) just by changing
   this value and redeploying.
   ════════════════════════════════════════════════════════════════ */
export type Phase = "teaser" | "raffle" | "waitlist" | "minting" | "minted";
export const ACTIVE_PHASE: Phase = "raffle";

/* ── Supabase table / function names (see supabase/schema.sql) ── */
export const DB = {
  applications: "wl_applications", // public raffle / waitlist entries (anon insert)
  eligibility: "holder_eligibility", // imported holder snapshot (edge-function only)
  claims: "spot_claims", // confirmed verified-holder spots (edge-function only)
  claimFunction: "claim-spot",
} as const;

/* ── Verified-holder spot pool (the /verify page) ──
   Per the strategy, we do NOT publicly announce how many OG spots
   exist before demand is seen. The UI therefore shows a live "claimed"
   count and heat, never a remaining number, unless you set
   SHOW_REMAINING true. CLAIM_TOTAL is only the hard ceiling the edge
   function enforces. */
export const CLAIM_TOTAL = 6000;
export const SHOW_REMAINING = false;

/* Communities eligible in the verified-holder raffle. `key` MUST match
   the "community" value in the holder snapshot exactly (compared
   case-insensitively by the edge function). */
export type Community = {
  key: string;
  name: string;
  kind: "ordinals" | "eth";
};
export const COMMUNITIES: Community[] = [
  { key: "NodeMonkes",       name: "NodeMonkes",        kind: "ordinals" },
  { key: "Bitcoin Puppets",  name: "Bitcoin Puppets",   kind: "ordinals" },
  { key: "Quantum Cats",     name: "Quantum Cats",      kind: "ordinals" },
  { key: "Runestone",        name: "Runestone",         kind: "ordinals" },
  { key: "OMB",              name: "Ordinal Maxi Biz",  kind: "ordinals" },
  { key: "Bitcoin Frogs",    name: "Bitcoin Frogs",     kind: "ordinals" },
  { key: "Pizza Ninjas",     name: "Pizza Ninjas",      kind: "ordinals" },
  { key: "Basedangels",      name: "Based Angels",      kind: "eth" },
  { key: "Miladys",          name: "Milady Maker",      kind: "eth" },
  { key: "Lilpudgys",        name: "Lil Pudgys",        kind: "eth" },
];
