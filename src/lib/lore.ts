/* ──────────────────────────────────────────────────────────────
   UNDEAD ORDINALS, content/lore data
   Sourced from the whitepaper (README.md). Keeping it as data means
   the pages stay layout; copy edits happen here.
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

export const FACTIONS: Faction[] = [
  {
    id: "phantom",
    name: "Phase Shift Phantoms",
    identity: "The unstable and elusive.",
    design:
      "Glitched skeletons with cyan laser eyes and visual artifacts drawn from unconfirmed transactions. They flicker between states, never fully here.",
    color: FACTION_COLOR.phantom,
    image: ASSET.phantom,
  },
  {
    id: "berserker",
    name: "Coronal Berserkers",
    identity: "The burning and relentless.",
    design:
      "Flame covered warriors forged from mining heat and raw computation. They burn through the Catacombs and never cool down.",
    color: FACTION_COLOR.berserker,
    image: ASSET.berserker,
  },
  {
    id: "neomancer",
    name: "Synthesized Neomancers",
    identity: "The augmented and arcane.",
    design:
      "Cybernetic undead with exposed brains and computational enhancements. Half necromancer, half machine, rebuilt to outthink the chain.",
    color: FACTION_COLOR.neomancer,
    image: ASSET.neomancer,
  },
  {
    id: "warden",
    name: "Titanium Wardens",
    identity: "The resilient and defensive.",
    design:
      "Armored guardians sealed in metal that refuses to break. They represent strength, security and resistance, the wall the dead hide behind.",
    color: FACTION_COLOR.warden,
    image: ASSET.warden,
  },
];

export type Tier = {
  name: string;
  risk: string;
  fee: string;
  duration: string;
  cooldown: string;
  relic: string;
};

export const TIERS: Tier[] = [
  { name: "Forgotten Crypt",    risk: "Low",     fee: "10 $GRAVE",  duration: "1 hour",   cooldown: "4 hours",  relic: "1%" },
  { name: "Haunted Chamber",    risk: "Medium",  fee: "25 $GRAVE",  duration: "4 hours",  cooldown: "12 hours", relic: "3%" },
  { name: "Cursed Tomb",        risk: "High",    fee: "60 $GRAVE",  duration: "12 hours", cooldown: "24 hours", relic: "5%" },
  { name: "Abyss of Consensus", risk: "Extreme", fee: "150 $GRAVE", duration: "24 hours", cooldown: "48 hours", relic: "7%" },
];

export type Chamber = { numeral: string; name: string; effect: string; chance: string };

export const CHAMBERS: Chamber[] = [
  { numeral: "I",   name: "Wild Reanimation",     effect: "One extra roll on the reward table.",                 chance: "8%" },
  { numeral: "II",  name: "Coronal Surge",        effect: "$GRAVE payout multiplied 2× to 15× (capped at 20× fee).", chance: "3%" },
  { numeral: "III", name: "Consensus Conjunction", effect: "Up to two chambers trigger together.",                chance: "1%" },
  { numeral: "IV",  name: "Glitch Cleansing",     effect: "Removes the lowest reward tier; odds rescale.",        chance: "6%" },
  { numeral: "V",   name: "Mempool Dilation",     effect: "Adds an extra material type to the pool.",             chance: "6%" },
];

export type RoadmapPhase = {
  numeral: string;
  title: string;
  points: string[];
};

export const ROADMAP: RoadmapPhase[] = [
  {
    numeral: "I",
    title: "Resurrection",
    points: [
      "Finalize collection, traits and rarity method",
      "Publish faction counts and reserved supply",
      "Launch website and documentation",
      "Test inscription and wallet verification flows",
      "Mint the collection",
    ],
  },
  {
    numeral: "II",
    title: "Awakening",
    points: [
      "Release holder verification",
      "Launch soft staking and the Grave Points dashboard",
      "Begin internal Catacombs testing",
    ],
  },
  {
    numeral: "III",
    title: "The Catacombs",
    points: [
      "Release a playable expedition prototype",
      "Publish final odds, chamber rules and resolution spec",
      "Test claims, cooldowns and abuse prevention",
      "Introduce the evolution framework",
    ],
  },
  {
    numeral: "IV",
    title: "The $GRAVE Economy",
    points: [
      "Publish simulation results and final parameters",
      "Deploy the $GRAVE Rune",
      "Convert Grave Points to $GRAVE",
      "Enable token based expeditions and evolution",
    ],
  },
  {
    numeral: "V",
    title: "Eternal Expansion",
    points: [
      "Add new expedition environments and seasonal content",
      "Expand evolution and faction content",
      "Explore Bitcoin ecosystem collaborations",
    ],
  },
];

export type Faq = { q: string; a: string };

export const FAQ: Faq[] = [
  {
    q: "Do I have to connect my wallet to verify?",
    a: "No. We never ask you to connect a wallet, sign a transaction, or share a seed phrase. You paste your public address and we check it against the holder snapshot. That's the whole flow, nothing can touch your funds.",
  },
  {
    q: "What am I actually buying?",
    a: "An undead artifact inscribed on Bitcoin using the Ordinals protocol. The original artwork lives on Bitcoin and never changes. Holding one gives access to eligible ecosystem features under their published rules.",
  },
  {
    q: "What is the Catacombs of Consensus?",
    a: "The core game. Holders send an Undead on an expedition, pay a $GRAVE entry fee, and receive an outcome from published odds and chamber modifiers. Only token deposits and withdrawals are Bitcoin transactions; the game logic runs off chain and is reproducible from public records.",
  },
  {
    q: "What is $GRAVE?",
    a: "The ecosystem utility token, issued with Bitcoin's Runes protocol. Max supply 21,000,000. It fuels expeditions, staking rewards and evolution. It is not an investment, no price, return or appreciation is promised.",
  },
  {
    q: "Does evolution burn my NFT?",
    a: "Never. Evolution consumes materials earned in expeditions and $GRAVE. Your inscription is never burned, the companion metadata layer changes, the original artwork on Bitcoin stays untouched.",
  },
  {
    q: "Is any of this audited or trustless?",
    a: "We don't call anything audited, trustless or exploit proof until a completed review supports it. Bitcoin secures ownership and token balances; the game engine and verifier are operated by us, with public logs so you can check our work.",
  },
];

/* Trust model, what lives where. Honesty is a selling point in this
   market, so it gets its own section. */
export const TRUST = [
  { component: "Undead artwork",        where: "Bitcoin (Ordinals)",   trust: "Bitcoin consensus only. Immutable." },
  { component: "$GRAVE balances",       where: "Bitcoin (Runes)",      trust: "Bitcoin consensus + the Runes indexer you use." },
  { component: "Ownership proof",       where: "Signed challenge",     trust: "Our verifier plus the indexer's view of Bitcoin." },
  { component: "Soft staking & points", where: "Our servers, public",  trust: "We calculate eligibility correctly; logs let you check." },
  { component: "Expedition outcomes",   where: "Our game engine",      trust: "Published algorithm, seeded by Bitcoin block data. Reproducible." },
  { component: "Evolved appearance",    where: "Companion metadata",   trust: "Our service stays online; the inscription is unaffected if it doesn't." },
];
