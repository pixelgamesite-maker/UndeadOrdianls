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
   A dungeon-game stack:
   - black   : "Jacquard 24"   — pixel blackletter; the wordmark + big titles
   - display : "Pixelify Sans" — pixel UI; menu, labels, buttons, data
   - body    : "Pixelify Sans" — readable pixel body for prose
   (Loaded in index.html — no FOUC.)                                   */
export const black = "'Jacquard 24', 'DotGothic16', monospace";
export const display = "'Pixelify Sans', 'Courier New', monospace";
export const body = "'Pixelify Sans', 'Trebuchet MS', sans-serif";
/* kept so existing imports resolve */
export const serif = body;
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
  video:     "/paddling_boat.mp4", // hero / title animation (crossing to the Bitcoin moon)
  phantom:   "/SKELETON_ONE.png",  // cyan laser-eye skeleton
  berserker: "/skull_2.png",       // red-flame skeleton
  neomancer: "/skull_4.png",       // exposed-brain cyber skeleton
  warden:    "/LOGO.jpg",          // blue-flame skull stand-in until Warden art lands (keeps 4 specimens distinct)
  // dungeon atmosphere + audio (public/assets)
  wall:      "/assets/undeadbackground.jpg", // mossy dungeon-brick page background
  doorShut:  "/assets/closed.PNG",           // whitelist: locked door
  doorOpen:  "/assets/open.PNG",             // whitelist: open door (registered)
  music:     "/assets/backgroundmusic.mp3",  // looping ambient score
  sfx:       "/assets/select.mp3",           // UI click / select sound
} as const;

/* Expedition-tier scene art (Catacombs level select). Order matches
   TIERS in lore.ts: Forgotten, Haunted, Cursed, Abyss. */
export const TIER_IMG = [
  "/assets/forgotten.jpg",
  "/assets/haunted.jpg",
  "/assets/cursed.jpg",
  "/assets/abyss.jpg",
] as const;

/* ════════════════════════════════════════════════════════════════
   CAMPAIGN PHASE CONTROL — flip one string to re-point the whole site.
     "teaser" | "raffle" | "waitlist" | "minting" | "minted"
   ════════════════════════════════════════════════════════════════ */
export type Phase = "teaser" | "raffle" | "waitlist" | "minting" | "minted";
export const ACTIVE_PHASE: Phase = "raffle";

/* ── Supabase table name (see supabase/schema.sql) ── */
export const DB = {
  applications: "wl_applications",
} as const;

/* Whitelist registration. When true, /whitelist runs the registration
   flow (and saves to Supabase when it's configured). Set false to show a
   clear "opens soon" status with a Follow-on-X action instead. */
export const WHITELIST_LIVE = true;
