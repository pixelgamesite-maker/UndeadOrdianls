/* ──────────────────────────────────────────────────────────────
   UNDEAD ORDINALS — design tokens & project config

   Art direction: "Dead inside. Alive on Bitcoin." A Bitcoin-native
   crypt-game HUD. Two living lights fight the dark: NECRO-GREEN (the
   undead glow — expeditions, life-after-death, the toxin in the jars)
   and BITCOIN-ORANGE (currency, action, the orange chain). Everything
   else is grave-black and bone. Oxblood red is reserved for danger.

   Palette brief from the client: black, green, orange — "dark undead
   and btc vibes."

   EVERYTHING a non-engineer edits (supply, dates, links, phase) lives
   in this file.
   ────────────────────────────────────────────────────────────── */

export const C = {
  ash:     "#07110B",  // base — necro grave-black (green-tinted)
  stone:   "#0E1A12",  // raised plates / panels
  stoneUp: "#1D2E22",  // borders, hover, inputs
  slab:    "#040B07",  // recessed / deepest wells
  ember:   "#F7931A",  // Bitcoin orange — currency, action, the chain
  emberLo: "#B9690F",  // dim ember — rims, pressed states
  oxblood: "#C13A24",  // dried-blood red — danger, berserker heat
  rune:    "#3BE07B",  // PRIMARY accent — necro green, the undead glow
  runeLo:  "#148C42",  // dim green — rules, pressed, recessed
  gold:    "#F6C945",  // loot gold — item prices only
  bone:    "#E7E6D2",  // text + parchment relic surfaces
  boneHi:  "#F4F3E6",  // brightest bone
  muted:   "rgba(231,230,210,0.58)",
  faint:   "rgba(231,230,210,0.32)",
  line:    "rgba(231,230,210,0.12)",
  lineLo:  "rgba(231,230,210,0.06)",
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
  /* Collection supply is NOT finalised. Everything shown to users reads
     "TBA" (supplyText). The numeric `supply` is kept only for internal
     maths and is never displayed. Set supplyText to the real number when
     the supply is locked. */
  supplyText: "TBA",
  supply: 3232,
  chain: "Bitcoin",
  token: "$GRAVE",
  tokenSupply: "21,000,000",
} as const;

/* Pre-written share text for the Waitlist Passport post. The page fills
   in [FACTION], [PASS ID] and the site [LINK]. */
export const SHARE_TEMPLATE =
  `The living are sleeping. The Undead are awakening.\n\n` +
  `My ${"@UndeadOrdinals"} Passport secured.\n\n` +
  `[FACTION] | [PASS ID]\n\n` +
  `Your turn to rise.\n\n` +
  `Enter the afterlife: [LINK]`;

/* ── Links ── (swap for the real accounts before launch) ── */
export const X_URL = "https://x.com/UndeadOrdinals";
export const X_HANDLE = "@UndeadOrdinals";
export const PINNED_URL = "https://x.com/UndeadOrdinals";
export const MAGICEDEN = "https://magiceden.io/ordinals";
export const DISCORD = ""; // leave "" to hide

/* ── Assets in /public ── */
export const ASSET = {
  logo:      "/SKELETON_TWO.png",  // social / OG image
  hardLogo:  "/Undeadlogo.png",    // transparent skull — the header mark
  video:     "/paddling_boat.mp4", // hero / title animation (crossing to the Bitcoin moon)
  phantom:   "/SKELETON_ONE.png",  // cyan laser-eye skeleton
  berserker: "/skull_2.png",       // red-flame skeleton
  neomancer: "/skull_4.png",       // exposed-brain cyber skeleton
  warden:    "/SKELETON_TWO.png",  // stand-in until Warden art lands (same art as Phantom for now)
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

/* ── Supabase table names (see supabase/schema.sql) ── */
export const DB = {
  applications: "wl_applications",
  allocations:  "wl_allocations",
} as const;

/* Whitelist registration. When true, /whitelist runs the registration
   flow (and saves to Supabase when it's configured). Set false to show a
   clear "opens soon" status with a Follow-on-X action instead. */
export const WHITELIST_LIVE = true;
