/* ──────────────────────────────────────────────────────────────
   UNDEAD ORDINALS — content / lore data
   Voice sourced from the official copy deck. Keeping copy as data
   means the pages stay pure layout; wording edits happen here.
   ────────────────────────────────────────────────────────────── */
import { FACTION_COLOR, ASSET } from "./theme";

export type Faction = {
  id: keyof typeof FACTION_COLOR;
  name: string;
  identity: string;
  design: string;
  color: string;
  image: string;
};

/* 04 — PICK YOUR POISON. */
export const FACTIONS: Faction[] = [
  {
    id: "phantom",
    name: "Phase-Shift Phantoms",
    identity: "Probably not supposed to exist.",
    design:
      "Glitched, unstable, and running on unconfirmed logic. They move between fragments of the blockchain like ghosts with unfinished business.",
    color: FACTION_COLOR.phantom,
    image: ASSET.phantom,
  },
  {
    id: "berserker",
    name: "Coronal Berserkers",
    identity: "Born from computational heat.",
    design:
      "They burn, rage, and turn every expedition into a potential disaster. Cooling down was never part of the design.",
    color: FACTION_COLOR.berserker,
    image: ASSET.berserker,
  },
  {
    id: "neomancer",
    name: "Synthesized Neomancers",
    identity: "Half machine. Half nightmare. Fully questionable.",
    design:
      "Cybernetic undead powered by strange technology and forbidden computation. Rebuilt to outthink the chain, or die trying. Again.",
    color: FACTION_COLOR.neomancer,
    image: ASSET.neomancer,
  },
  {
    id: "warden",
    name: "Titanium Wardens",
    identity: "Built to survive what everything else couldn't.",
    design:
      "Armored guardians of the Catacombs, sealed in metal that refuses to break. Breaking them is your problem, not theirs.",
    color: FACTION_COLOR.warden,
    image: ASSET.warden,
  },
];

/* 05 — HOW IT WORKS (a true 6-step sequence). */
export type Step = { title: string; body: string };
export const STEPS: Step[] = [
  { title: "Pick your Undead",  body: "Connect your Bitcoin wallet and choose the unfortunate soul you're sending into the depths." },
  { title: "Choose your grave", body: "Select an expedition by its risk, entry fee, duration and potential rewards." },
  { title: "Pay the price",     body: "Commit your $GRAVE entry fee. The Catacombs don't accept good intentions." },
  { title: "Let fate decide",   body: "The outcome resolves from published rules: a server commitment, your nonce, and future Bitcoin block data." },
  { title: "Claim your loot",   body: "Survive, and collect eligible $GRAVE, materials or rare relics." },
  { title: "Do it again",       body: "Upgrade. Evolve. Explore deeper. Or make the same mistake twice. Your choice." },
];

/* 05 — FOUR WAYS TO DISAPPOINT YOURSELF (expedition tiers). */
export type Tier = {
  name: string;
  risk: string;
  blurb: string;
  fee: string;
  duration: string;
  cooldown: string;
  relic: string;
};

export const TIERS: Tier[] = [
  { name: "Forgotten Crypt",    risk: "Low",     blurb: "A nice little walk through the graveyard.",        fee: "10 $GRAVE",  duration: "1 hour",   cooldown: "4 hours",  relic: "1%" },
  { name: "Haunted Chamber",    risk: "Medium",  blurb: "Something is definitely following you.",           fee: "25 $GRAVE",  duration: "4 hours",  cooldown: "12 hours", relic: "3%" },
  { name: "Cursed Tomb",        risk: "High",    blurb: "Maybe don't bring your last 10 $GRAVE.",           fee: "60 $GRAVE",  duration: "12 hours", cooldown: "24 hours", relic: "5%" },
  { name: "Abyss of Consensus", risk: "Extreme", blurb: "No refunds for questionable life choices.",        fee: "150 $GRAVE", duration: "24 hours", cooldown: "48 hours", relic: "7%" },
];

/* 06 — FIVE WAYS THE CATACOMBS CAN GET WEIRD. */
export type Chamber = { numeral: string; name: string; effect: string; chance: string };
export const CHAMBERS: Chamber[] = [
  { numeral: "I",   name: "Wild Reanimation",     effect: "Death isn't always the end. Trigger one extra reward roll.",         chance: "8%" },
  { numeral: "II",  name: "Coronal Surge",        effect: "The universe makes a mistake in your favor. A $GRAVE multiplier.",   chance: "3%" },
  { numeral: "III", name: "Consensus Conjunction", effect: "When one disaster isn't enough. Multiple modifiers collide.",       chance: "1%" },
  { numeral: "IV",  name: "Glitch Cleansing",     effect: "Bad loot? Not today. The lowest tier is cut and odds recalculate.",  chance: "6%" },
  { numeral: "V",   name: "Mempool Dilation",     effect: "More chaos, more combinations. An extra material joins the pool.",   chance: "6%" },
];

/* 08 — DEATH IS PERMANENT. YOUR LOOK ISN'T. */
export const EVOLUTION: string[] = [
  "Titanium armor and reinforced skeletons",
  "Burning crowns and supernatural flames",
  "Cybernetic enhancements",
  "Laser eyes and corrupted visual effects",
  "Faction-specific accessories",
  "Rare transformations",
];

/* 09 — THE $GRAVE RUNE. */
export const RUNE_SPECS: [string, string][] = [
  ["Name", "$GRAVE"],
  ["Protocol", "Bitcoin Runes"],
  ["Max supply", "21,000,000"],
  ["Divisibility", "2"],
  ["Issuance", "Published addresses"],
  ["Further issuance", "None"],
];

export const DISTRIBUTION: { label: string; pct: number }[] = [
  { label: "Expedition rewards", pct: 45 },
  { label: "Staking rewards",    pct: 20 },
  { label: "Liquidity",          pct: 15 },
  { label: "Ecosystem treasury", pct: 10 },
  { label: "Development & team",  pct: 10 },
];

export const FEE_SPLIT: { label: string; pct: number }[] = [
  { label: "Permanently burned",     pct: 40 },
  { label: "Back to reward reserve", pct: 40 },
  { label: "Operations",             pct: 20 },
];

/* 10 — WHAT LIVES WHERE (Bitcoin-native, not Bitcoin cosplay). */
export const LIVES_WHERE: [string, string][] = [
  ["Bitcoin Ordinals",   "Your original Undead artwork and inscription history."],
  ["Bitcoin Runes",      "$GRAVE balances and transfers."],
  ["Wallet verification","Signed ownership challenges and inscription checks."],
  ["Our game engine",    "Expeditions, cooldowns, reward calculations, progression."],
  ["Companion metadata", "Evolved appearances and extra character information."],
];

/* 12 — FROM THE GRAVE TO ETERNITY. */
export type RoadmapPhase = { numeral: string; title: string; points: string[] };
export const ROADMAP: RoadmapPhase[] = [
  {
    numeral: "I", title: "Resurrection",
    points: [
      "Finalize the 3,232 Undead collection",
      "Publish traits and rarity methodology",
      "Launch the website and documentation",
      "Test wallet verification",
      "Inscribe and launch the collection",
    ],
  },
  {
    numeral: "II", title: "Awakening",
    points: [
      "Launch holder verification",
      "Introduce soft staking",
      "Open the Grave Points dashboard",
      "Begin Catacombs internal testing",
    ],
  },
  {
    numeral: "III", title: "The Catacombs",
    points: [
      "Release the expedition game",
      "Publish final odds and chamber rules",
      "Enable reward claims",
      "Introduce materials, relics and evolution",
    ],
  },
  {
    numeral: "IV", title: "The Grave Economy",
    points: [
      "Publish tokenomics simulation results",
      "Deploy the $GRAVE Rune",
      "Announce Grave Points conversion rules",
      "Activate token-based expeditions and evolution",
    ],
  },
  {
    numeral: "V", title: "Eternal Expansion",
    points: [
      "New expedition environments",
      "Seasonal content",
      "Expanded character evolution",
      "Faction content and Bitcoin ecosystem collaborations",
    ],
  },
];

export type Faq = { q: string; a: string };
export const FAQ: Faq[] = [
  {
    q: "Do I have to connect my wallet to register?",
    a: "No. We never ask you to connect a wallet, sign a transaction, or share a seed phrase to join the whitelist. You paste your public address and we check it. Nothing can touch your funds.",
  },
  {
    q: "What am I actually buying?",
    a: "One of 3,232 Undead inscribed on Bitcoin using the Ordinals protocol. The original artwork lives on Bitcoin and never changes. Holding one gives access to eligible ecosystem features under their published rules.",
  },
  {
    q: "What is the Catacombs of Consensus?",
    a: "The core game. Holders send an Undead on an expedition, pay a $GRAVE entry fee, and receive an outcome from published odds and chamber modifiers. Only token deposits and withdrawals are Bitcoin transactions; the game logic is reproducible from public records.",
  },
  {
    q: "What is $GRAVE?",
    a: "The ecosystem utility Rune, issued with Bitcoin's Runes protocol. Max supply 21,000,000. It fuels expeditions, staking rewards and evolution. It is not an investment — no price, return or appreciation is promised.",
  },
  {
    q: "Does evolution burn my NFT?",
    a: "Never. Evolution consumes materials earned in expeditions and $GRAVE. Your original inscription is never rewritten — only the companion metadata layer changes.",
  },
  {
    q: "Is any of this trustless?",
    a: "We won't call something trustless just because it sounds good in a tweet. Bitcoin secures ownership and token balances; the game engine and verifier are operated by us, with public logs so you can check our work. Less trust me bro, more show me the data.",
  },
];

/* 11 — TRUST IS EARNED, NOT INSCRIBED. */
export const TRUST = [
  { component: "Undead artwork",        where: "Bitcoin (Ordinals)",  trust: "Bitcoin consensus only. Immutable." },
  { component: "$GRAVE balances",       where: "Bitcoin (Runes)",     trust: "Bitcoin consensus + the Runes indexer you use." },
  { component: "Ownership proof",       where: "Signed challenge",    trust: "Our verifier plus the indexer's view of Bitcoin." },
  { component: "Soft staking & points", where: "Our servers, public", trust: "We calculate eligibility correctly; logs let you check." },
  { component: "Expedition outcomes",   where: "Our game engine",     trust: "Published algorithm, seeded by Bitcoin block data. Reproducible." },
  { component: "Evolved appearance",    where: "Companion metadata",  trust: "The inscription is unaffected if our service ever goes dark." },
];
