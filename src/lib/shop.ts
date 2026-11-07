/* ──────────────────────────────────────────────────────────────
   UNDEAD ORDINALS — loot data
   The Black Market (shop) items, the Armory (swords) and the
   Apothecary (jars). Art lives in /public/shop, /public/sword,
   /public/jars. Prices are in $GRAVE (the "gold" shown on each card).

   This is DATA — a non-engineer can edit names, prices and blurbs
   here without touching any layout. Swords and jars are NOT sold in
   the store; they live on the body of the site.
   ────────────────────────────────────────────────────────────── */

export type ItemCategory =
  | "Weapons" | "Armor" | "Relics" | "Potions" | "Materials" | "Valuables";

export type ShopItem = {
  slug: string;        // file in /public/shop/<slug>.png
  name: string;
  category: ItemCategory;
  price: number;       // $GRAVE
  blurb: string;
};

/* 48 items. Kept intentionally terse + darkly funny, per brand voice. */
export const SHOP_ITEMS: ShopItem[] = [
  // ── Valuables ──────────────────────────────────────────────
  { slug: "gold-coin",     name: "Grave Coin",       category: "Valuables", price: 5,   blurb: "Spends the same whether you're alive or not." },
  { slug: "golden-goblet", name: "Golden Goblet",    category: "Valuables", price: 120, blurb: "Drink deep. It won't bring you back." },
  { slug: "ruby-ring",     name: "Ruby Ring",        category: "Valuables", price: 140, blurb: "Pried off a finger that no longer needed it." },
  { slug: "red-gemstone",  name: "Blood Gem",        category: "Valuables", price: 95,  blurb: "Warm to the touch. Nobody asks why." },
  { slug: "orange-crystal",name: "Ember Crystal",    category: "Valuables", price: 80,  blurb: "A splinter of the orange chain." },
  { slug: "yellow-crystal",name: "Sulphur Crystal",  category: "Valuables", price: 72,  blurb: "Smells like a bad decision." },
  { slug: "drinking-horn", name: "Drinking Horn",    category: "Valuables", price: 34,  blurb: "For toasts to the recently departed." },

  // ── Weapons ────────────────────────────────────────────────
  { slug: "short-sword",    name: "Short Sword",     category: "Weapons", price: 60,  blurb: "Reliable. Boring. Still works on the dead." },
  { slug: "spear",          name: "Bone Spear",      category: "Weapons", price: 70,  blurb: "Reach out and ruin someone's expedition." },
  { slug: "war-hammer",     name: "War Hammer",      category: "Weapons", price: 110, blurb: "Subtlety is for the living." },
  { slug: "hunting-knife",  name: "Hunting Knife",   category: "Weapons", price: 38,  blurb: "Field-dresses relics and regrets alike." },
  { slug: "throwing-knives",name: "Throwing Knives", category: "Weapons", price: 52,  blurb: "Three chances to miss. Usually enough." },
  { slug: "curved-hook",    name: "Curved Hook",     category: "Weapons", price: 44,  blurb: "Grabs loot. Grabs you back sometimes." },
  { slug: "monster-claw",   name: "Monster Claw",    category: "Weapons", price: 66,  blurb: "Taken from something that regretted it." },
  { slug: "monster-tooth",  name: "Monster Tooth",   category: "Weapons", price: 40,  blurb: "Still sharp. Still angry." },
  { slug: "fang",           name: "Cursed Fang",     category: "Weapons", price: 48,  blurb: "Bites down on its own accord." },

  // ── Armor ──────────────────────────────────────────────────
  { slug: "chainmail",     name: "Rusted Chainmail", category: "Armor", price: 90,  blurb: "Heavy, loud, and better than dying twice." },
  { slug: "iron-gauntlet", name: "Iron Gauntlet",    category: "Armor", price: 58,  blurb: "For holding $GRAVE you'll immediately lose." },
  { slug: "iron-helmet",   name: "Iron Helmet",      category: "Armor", price: 54,  blurb: "Protects a skull you don't technically need." },
  { slug: "undead-helmet", name: "Undead Helm",      category: "Armor", price: 100, blurb: "Grown, not forged. Don't ask." },
  { slug: "leather-boot",  name: "Leather Boots",    category: "Armor", price: 30,  blurb: "For running away with dignity." },
  { slug: "leather-glove", name: "Leather Gloves",   category: "Armor", price: 26,  blurb: "Grip relics without catching the curse." },
  { slug: "wooden-sheild", name: "Wooden Shield",    category: "Armor", price: 36,  blurb: "Blocks exactly one bad idea." },
  { slug: "dark-cloak",    name: "Dark Cloak",       category: "Armor", price: 76,  blurb: "You look mysterious. You're just cold." },
  { slug: "horseshoe",     name: "Rusted Horseshoe", category: "Armor", price: 18,  blurb: "Luck not included. Never was." },

  // ── Potions ────────────────────────────────────────────────
  { slug: "health-potion",  name: "Health Potion",   category: "Potions", price: 25,  blurb: "Restores you to 'barely'." },
  { slug: "healing-potion", name: "Healing Draught", category: "Potions", price: 40,  blurb: "Tastes like copper and second chances." },
  { slug: "dark-potion",    name: "Dark Potion",     category: "Potions", price: 68,  blurb: "Does something. Results may vary. Wildly." },

  // ── Relics ─────────────────────────────────────────────────
  { slug: "bronze-key",      name: "Bronze Key",        category: "Relics", price: 22,  blurb: "Opens the cheap doors. Still locked, though." },
  { slug: "silver-key",      name: "Silver Key",        category: "Relics", price: 85,  blurb: "Opens the doors worth regretting." },
  { slug: "silver-screw",    name: "Silver Screw",      category: "Relics", price: 12,  blurb: "Holds the Catacombs together. Barely." },
  { slug: "locked-spellbook",name: "Locked Spellbook",  category: "Relics", price: 160, blurb: "Knowledge it very much does not want to share." },
  { slug: "occult-book",     name: "Occult Tome",       category: "Relics", price: 150, blurb: "Read it twice and you'll see why we don't." },
  { slug: "crafting-scroll", name: "Crafting Scroll",   category: "Relics", price: 55,  blurb: "Instructions for things better left un-made." },
  { slug: "bloody-letter",   name: "Bloody Letter",     category: "Relics", price: 28,  blurb: "Someone's last words. Poor penmanship." },
  { slug: "lantern",         name: "Grave Lantern",     category: "Relics", price: 46,  blurb: "Keeps the dark at exactly arm's length." },
  { slug: "hourglass",       name: "Cursed Hourglass",  category: "Relics", price: 130, blurb: "Counts down to nothing good." },
  { slug: "loot-bag",        name: "Loot Bag",          category: "Relics", price: 20,  blurb: "Holds more disappointment than you'd think." },
  { slug: "rope",            name: "Frayed Rope",       category: "Relics", price: 10,  blurb: "Climb down. Climbing back up is your problem." },
  { slug: "coiled-chain",    name: "Coiled Chain",      category: "Relics", price: 24,  blurb: "For binding things. Or being bound. Depends." },

  // ── Materials ──────────────────────────────────────────────
  { slug: "bone",           name: "Bone Shard",      category: "Materials", price: 6,   blurb: "The Catacombs' most abundant currency." },
  { slug: "ivory-bone",     name: "Ivory Bone",      category: "Materials", price: 16,  blurb: "Cleaner than most. Still someone's." },
  { slug: "undead-fingers", name: "Undead Fingers",  category: "Materials", price: 14,  blurb: "They point. You really shouldn't follow." },
  { slug: "undead-skull",   name: "Undead Skull",    category: "Materials", price: 44,  blurb: "Low on ideas, high on ambience." },
  { slug: "dark-ore",       name: "Dark Ore",        category: "Materials", price: 50,  blurb: "Mined from the deepest, dumbest expeditions." },
  { slug: "bricks",         name: "Crypt Bricks",    category: "Materials", price: 8,   blurb: "Build a tomb. You'll need it eventually." },
  { slug: "firewood",       name: "Firewood",        category: "Materials", price: 5,   blurb: "Warmth is temporary. The dark is not." },
  { slug: "wheat",          name: "Grave Wheat",     category: "Materials", price: 4,   blurb: "Grows where nothing should. Tastes like it." },
];

/* ── The Armory — six sword rarities (on the body, never in the store) ── */
export type Sword = {
  slug: string;     // /public/sword/<slug>.png
  name: string;
  rarity: string;
  color: string;    // rarity glow
  drop: string;     // where it drops
};

export const SWORDS: Sword[] = [
  { slug: "common-sword",    name: "Rustblade",     rarity: "Common",    color: "#8A938C", drop: "Forgotten Crypt" },
  { slug: "uncommon-sword",  name: "Gravecut",      rarity: "Uncommon",  color: "#3BE07B", drop: "Forgotten Crypt" },
  { slug: "rare-sword",      name: "Frostmourn",    rarity: "Rare",      color: "#46B4E8", drop: "Haunted Chamber" },
  { slug: "epic-sword",      name: "Soulrender",    rarity: "Epic",      color: "#A368E0", drop: "Cursed Tomb" },
  { slug: "legendary-sword", name: "Satoshi's Edge",rarity: "Legendary", color: "#F7931A", drop: "Abyss of Consensus" },
  { slug: "mythic-sword",    name: "Sat Mortis",    rarity: "Mythic",    color: "#FF4D4D", drop: "Abyss · 0.1% roll" },
];

/* ── The Apothecary — five jars / elixirs (on the body, not sold) ── */
export type Jar = {
  slug: string;     // /public/jars/<slug>.png
  name: string;
  effect: string;
  color: string;
};

export const JARS: Jar[] = [
  { slug: "jar-1", name: "Grave Essence",     effect: "Base expedition fuel. Mildly toxic.",        color: "#3BE07B" },
  { slug: "jar-2", name: "Ember Draught",     effect: "Burns hot. Pairs well with bad decisions.",  color: "#F7931A" },
  { slug: "jar-3", name: "Phantom Tincture",  effect: "You phase out. Sometimes you phase back.",   color: "#46B4E8" },
  { slug: "jar-4", name: "Oxblood Vial",      effect: "For berserkers who skipped the warning.",    color: "#C13A24" },
  { slug: "jar-5", name: "Consensus Elixir",  effect: "The rarest brew. Nobody agrees what it does.",color: "#A368E0" },
];

export const SHOP_CATEGORIES: ItemCategory[] = [
  "Weapons", "Armor", "Potions", "Relics", "Materials", "Valuables",
];

/* Signature glow per category — keeps the loot on-palette (green /
   orange / gold / red) with one magic purple for potions. */
export const CAT_GLOW: Record<ItemCategory, string> = {
  Weapons:   "#C13A24", // oxblood
  Armor:     "#3BE07B", // necro green
  Potions:   "#A368E0", // alchemy purple
  Relics:    "#F7931A", // bitcoin orange
  Materials: "#9DAA98", // bone-grey
  Valuables: "#F6C945", // gold
};

/* A curated 8 for the homepage "drop" preview. */
export const FEATURED = [
  "golden-goblet", "war-hammer", "undead-helmet", "dark-potion",
  "occult-book", "ruby-ring", "undead-skull", "lantern",
];
