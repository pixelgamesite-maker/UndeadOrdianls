/* ──────────────────────────────────────────────────────────────
   UNDEAD ORDINALS — design tokens & project config

   Art direction: "Exhumed relic, catalogued." The undead are cursed
   artifacts pulled off the chain and mounted like museum specimens —
   raw pixel-horror art in refined reliquary frames. Bone and crypt
   stone as surfaces, Bitcoin ember as the one source of living light,
   oxblood and verdigris as the colours of the dead.

   EVERYTHING a non-engineer edits (supply, dates, links, phase) lives
   in this file.
   ────────────────────────────────────────────────────────────── */

export const C = {
  ash:     "#100D16",  // base — crypt violet-black
  stone:   "#191521",  // raised plates / panels
  stoneUp: "#241E30",  // borders, hover, inputs
  slab:    "#0B0910",  // recessed / deepest wells
  ember:   "#F7931A",  // PRIMARY — Bitcoin ember, the living light
  emberLo: "#C06A15",  // dim ember — rims, pressed states
  oxblood: "#9A2B22",  // dried-blood red — danger, berserker heat
  rune:    "#5E8A86",  // verdigris patina — cold occult accent
  bone:    "#E8DDC6",  // text + parchment relic surfaces
  boneHi:  "#F3ECDA",  // brightest bone
  muted:   "rgba(232,221,198,0.56)",
  faint:   "rgba(232,221,198,0.30)",
  line:    "rgba(232,221,198,0.11)",
  lineLo:  "rgba(232,221,198,0.055)",
} as const;

/** The four factions, re-tuned to filmic/occult tones (not neon). */
export const FACTION_COLOR = {
  phantom:   "#63B6C6", // Phase-Shift Phantoms — muted steel-cyan
  berserker: "#D04B2C", // Coronal Berserkers — ember-oxblood
  neomancer: "#9068B8", // Synthesized Neomancers — muted violet
  warden:    "#9DAAB5", // Titanium Wardens — pale steel
} as const;

/* ── Typography ───────────────────────────────────────────────
   Two families only:
   - display : "DotGothic16"  — pixel-gothic; wordmark, headers, data
   - serif   : "Spectral"     — literary serif; all body prose
   The pixel identity lives in the display face + the art; prose is a
   grimoire serif so long text stays legible and the page reads crafted,
   not arcade. (Loaded in index.html — no FOUC.)                      */
export const display = "'DotGothic16', 'Courier New', monospace";
export const serif = "'Spectral', 'Iowan Old Style', Georgia, serif";
/* kept so existing imports resolve; data/addresses use the pixel face */
export const body = serif;
export const mono = display;

/* ════════════════════════════════════════════════════════════════
   PROJECT CONSTANTS — edit these, not the components.
   ════════════════════════════════════════════════════════════════ */

export const PROJECT = {
  name: "Undead Ordinals",
  tagline: "The dead don't stay dead on Bitcoin.",
  /* Whitepaper fixes supply at 3,232. Campaign note says "6K or less,
     TBC" — change this one value and it updates everywhere. */
  supply: 3232,
  chain: "Bitcoin",
  token: "$GRAVE",
  tokenSupply: "21,000,000",
} as const;

/* ── Links ── (swap for the real accounts before launch) ── */
export const X_URL = "https://x.com/UndeadOrdinals";
export const X_HANDLE = "@UndeadOrdinals";
export const PINNED_URL = "https://x.com/UndeadOrdinals";
export const MAGICEDEN = "https://magiceden.io/ordinals";
export const DISCORD = ""; // leave "" to hide

/* ── Assets in /public ── */
export const ASSET = {
  logo:      "/LOGO.jpg",          // flat logo (favicon / social card)
  hardLogo:  "/Undeadlogo.png",    // transparent skull — the header mark
  video:     "/paddling_boat.mp4", // hero animation (skeleton crossing to the Bitcoin moon)
  phantom:   "/SKELETON_ONE.png",  // cyan laser-eye skeleton
  berserker: "/skull_2.png",       // red-flame skeleton
  neomancer: "/skull_4.png",       // exposed-brain cyber skeleton
  warden:    "/SKELETON_TWO.png",  // armoured stand-in until Warden art lands
} as const;

/* ════════════════════════════════════════════════════════════════
   CAMPAIGN PHASE CONTROL — flip one string to re-point the whole site.
     "teaser" | "raffle" | "waitlist" | "minting" | "minted"
   ════════════════════════════════════════════════════════════════ */
export type Phase = "teaser" | "raffle" | "waitlist" | "minting" | "minted";
export const ACTIVE_PHASE: Phase = "raffle";

/* ── Supabase table / function names (see supabase/schema.sql) ── */
export const DB = {
  applications: "wl_applications",
  eligibility: "holder_eligibility",
  claims: "spot_claims",
  claimFunction: "claim-spot",
} as const;

/* ── Verified-holder spot pool (/verify) ── */
export const CLAIM_TOTAL = 6000;
export const SHOW_REMAINING = false;

/* Holder verification is gated until the snapshot is imported. While
   false, /verify shows the whitelisted collections as "coming soon"
   instead of a live claim form. Flip to true once the snapshot is in. */
export const VERIFY_LIVE = false;

/* OG Bitcoin Ordinals collections targeted for the verified-holder
   raffle. These are a strong, credible starter set — the ones with the
   most engaged, most-respected holder bases. Final list is confirmed
   before the snapshot. ETH collections open in a later phase. */
export type Community = { key: string; name: string; kind: "ordinals" | "eth" };
export const COMMUNITIES: Community[] = [
  { key: "NodeMonkes",      name: "NodeMonkes",       kind: "ordinals" },
  { key: "Bitcoin Puppets", name: "Bitcoin Puppets",  kind: "ordinals" },
  { key: "Taproot Wizards", name: "Taproot Wizards",  kind: "ordinals" },
  { key: "Quantum Cats",    name: "Quantum Cats",     kind: "ordinals" },
  { key: "Runestone",       name: "Runestone",        kind: "ordinals" },
  { key: "OMB",             name: "Ordinal Maxi Biz", kind: "ordinals" },
  { key: "Ordinal Punks",   name: "Ordinal Punks",    kind: "ordinals" },
  { key: "Bitcoin Frogs",   name: "Bitcoin Frogs",    kind: "ordinals" },
  { key: "Pizza Ninjas",    name: "Pizza Ninjas",     kind: "ordinals" },
  { key: "RSIC",            name: "RSIC Genesis",     kind: "ordinals" },
  { key: "Basedangels",     name: "Based Angels",     kind: "eth" },
  { key: "Miladys",         name: "Milady Maker",     kind: "eth" },
  { key: "Lilpudgys",       name: "Lil Pudgys",       kind: "eth" },
];
