# UNDEAD ORDINALS

**The Dead Don't Stay Dead on Bitcoin.**

Official Whitepaper

*Items in [square brackets] are placeholders only the team can confirm. Numbers marked "proposed" are working values pending simulation and legal review.*

## 1. Executive Summary

Bitcoin was built to last forever. So were we.

Undead Ordinals is a collection of **3,232 undead artifacts inscribed on Bitcoin**, and the foundation of a Bitcoin-native gaming ecosystem. Holders send their Undead into the **Catacombs of Consensus**, a risk-and-reward expedition game, earn materials and rewards, **evolve** their characters, and take part in an economy powered by the **$GRAVE Rune**.

Three ideas drive the project:

- **Permanence.** The original artwork lives on Bitcoin and never changes.
- **Play.** Expeditions, progression and evolution give holders reasons to return after the mint.
- **Clarity.** Every rule that matters (fees, odds, emissions, vesting) is written down in this document, and we say plainly which parts run on Bitcoin and which run on our servers.

**3,232 Undead. One Blockchain. An Eternal Legacy.**

| Detail | Specification |
|---|---|
| Project | Undead Ordinals |
| Blockchain | Bitcoin Mainnet |
| Supply | 3,232 inscriptions |
| Ecosystem token | $GRAVE (Runes Protocol), max supply 21,000,000 |
| Core experience | Catacombs of Consensus expedition game |
| Category | Digital collectibles, gaming, Bitcoin-native ecosystem |
| Mint price / date | [TBA] |

## 2. Trust Model at a Glance

Bitcoin secures ownership and token balances. It does not run game logic. This table shows exactly what lives where.

| Component | Where it lives | What you are trusting |
|---|---|---|
| Undead artwork | Bitcoin (Ordinals inscription) | Bitcoin consensus only. Immutable. |
| $GRAVE balances and transfers | Bitcoin (Runes) | Bitcoin consensus and the Runes indexer you use. |
| Wallet ownership proof | Signed challenge, checked by our verifier | Our verifier plus the indexer's view of Bitcoin. |
| Soft staking and points | Our servers, public logs | We calculate eligibility correctly; logs let you check. |
| Expedition resolution | Our game engine, seeded with Bitcoin block data | We follow the published algorithm; results are reproducible. |
| Evolved appearance and stats | Companion metadata service | Our service stays online; the original inscription is unaffected if it does not. |

We do not call any component audited, trustless or exploit-proof until a completed review supports the claim.


## 3. Principles

- **Bitcoin-native assets.** The collection and $GRAVE are built on Bitcoin infrastructure.
- **You keep your Undead.** No deposits, no custody, no staking contracts holding your inscription.
- **Published rules.** Fees, odds, modifiers, cooldowns and caps are public and versioned.
- **Progression without rewriting history.** Evolution changes the companion layer, never the inscription.
- **Budgeted economics.** Rewards are capped and modeled. Nothing is a guaranteed return.
- **Core loop first.** We ship and test expeditions before expanding.


## 4. Lore: Rise of the Undead

Deep beneath the Bitcoin blockchain lies a forgotten world known as the **Catacombs of Consensus**.

It is where abandoned transactions, forgotten satoshis and lost digital fragments have gathered since Bitcoin's earliest days. For years, it remained silent.

Then came the **Sat Mortis**: a mysterious awakening that stirred the fragments of Bitcoin's history.

From the depths emerged 3,232 Undead Ordinals, each carrying the scars of the digital afterlife. Some flicker with unstable energy. Some burn with the heat of computation. Others were rebuilt with strange machinery or sealed in armor that refuses to break.

They were not created to disappear. They were resurrected to explore, evolve and conquer the chain.

*The lore defines the world and look of the collection. Game mechanics, rewards and token rules are governed by the published rules in this document, not by the story.*


## 5. The Collection

3,232 unique inscriptions on Bitcoin Mainnet using the Ordinals protocol. Each inscription is intended to preserve the collectible's core artwork on Bitcoin. If recursive inscriptions are used for any layers, dependencies and fallback behavior will be documented.

| Attribute | Details |
|---|---|
| Collection | Undead Ordinals |
| Supply | 3,232 |
| Network | Bitcoin Mainnet |
| Format | Ordinals inscriptions |
| Art direction | Undead, cyberpunk, dark fantasy |
| Utility | Expeditions, soft staking, evolution, ecosystem access |
| Mint price and date | [TBA] |
| Reserved supply (team, giveaways, partners) | [confirm count] |

### The Four Factions

| Faction | Identity | Design |
|---|---|---|
| Phase-Shift Phantoms | The unstable and elusive | Glitched skeletons, cyan laser eyes, visual artifacts inspired by unconfirmed transactions |
| Coronal Berserkers | The burning and relentless | Flame-covered warriors inspired by mining heat and raw computation |
| Synthesized Neomancers | The augmented and arcane | Cybernetic undead, exposed brains, computational enhancements |
| Titanium Wardens | The resilient and defensive | Armored guardians representing strength, security and resistance |

Faction counts: [Phantoms / Berserkers / Neomancers / Wardens, confirm]. Trait categories and the rarity methodology will be published before mint. Traits may affect staking weight (see Section 8); every such effect is disclosed and capped. No trait gives hidden advantages in expedition outcomes.

Holding an Undead gives access to eligible ecosystem features, subject to each feature's published rules. Ownership does not guarantee rewards, future value or access to features that have not launched.


## 6. The Catacombs of Consensus

The Catacombs of Consensus is the core game. Holders send an Undead on an expedition, pay an entry fee in $GRAVE, and receive an outcome determined by published odds and chamber modifiers.

### The expedition loop

1. **Select** an eligible Undead from a verified wallet.
2. **Choose** a tier and review its fee, duration, cooldown and odds.
3. **Commit** the entry fee in $GRAVE.
4. **Resolve.** Outcome is generated by the process in "Fair outcome resolution" below.
5. **Claim** rewards: $GRAVE, materials or relics. A failed run consumes the entry fee and is not refundable.
6. **Reinvest** materials and rewards into new expeditions or evolution.

Player actions (select, enter, claim) are handled off-chain in the game engine. Only $GRAVE deposits and withdrawals are Bitcoin transactions.

### Expedition tiers (proposed v0 parameters)

| Tier | Risk | Entry fee | Duration | Cooldown per Undead |
|---|---|---|---|---|
| Forgotten Crypt | Low | 10 $GRAVE | 1 hour | 4 hours |
| Haunted Chamber | Medium | 25 $GRAVE | 4 hours | 12 hours |
| Cursed Tomb | High | 60 $GRAVE | 12 hours | 24 hours |
| Abyss of Consensus | Extreme | 150 $GRAVE | 24 hours | 48 hours |

### Outcome odds per run (proposed v0, before chamber modifiers)

| Tier | Fail (fee consumed) | Materials | $GRAVE payout | Relic |
|---|---|---|---|---|
| Forgotten Crypt | 35% | 40% | 24% | 1% |
| Haunted Chamber | 40% | 30% | 27% | 3% |
| Cursed Tomb | 45% | 20% | 30% | 5% |
| Abyss of Consensus | 50% | 10% | 33% | 7% |

**Design target:** the expected $GRAVE returned to players across all tiers is proposed at **70–85% of fees paid**, with the remainder of player value delivered as materials and relics. This keeps the game a net token sink. Payout sizes, reward caps and per-wallet daily limits will be finalized by simulation and published before launch.

### Fair outcome resolution

Bitcoin block data is used as one input, never the only one. Proposed process:

1. **Server commitment.** Before an expedition locks, the game engine publishes a hash of a secret seed.
2. **Player entry.** The player's entry transaction locks the run and records a player nonce.
3. **Future block.** The outcome seed combines the server's revealed seed, the player nonce, and the hash of a Bitcoin block mined at least 6 blocks after lock.
4. **Reveal.** The server reveals its seed. Anyone can recompute the hash chain and the outcome from public data.

This prevents the server from changing outcomes after seeing the block, and prevents players from timing entries against a known block. A miner could in theory withhold a block to influence a result, but doing so forfeits a block reward that far exceeds any expedition prize at these fee levels. If a chain reorganization changes the seed block before 6 confirmations, the run re-resolves from the new block. A public block hash alone is never described as a complete randomness solution.


## 7. The Five Crypt Chambers

Chambers are modifiers that can trigger during an expedition. Trigger odds and caps below are proposed and will be finalized through testing.

| Chamber | Effect | Proposed rule |
|---|---|---|
| I. Wild Reanimation | Bonus reward roll | Adds one extra roll on the tier's reward table. Trigger chance 8%. |
| II. Coronal Surge | Reward multiplier 2× to 15× | Applies to $GRAVE payouts only. Trigger chance 3%. Multiplier odds weighted heavily to 2× to 4×; 15× is rare. Maximum payout per run capped at 20× the entry fee. |
| III. Consensus Conjunction | Multiple modifiers together | Allows at most two chambers per run, resolved in numeric order. Trigger chance 1%. |
| IV. Glitch Cleansing | Loot enhancement | Removes the lowest reward tier from the pool; remaining odds are rescaled proportionally. Trigger chance 6%. |
| V. Mempool Dilation | Expanded reward combinations | Adds one extra material type to the pool. Trigger chance 6%. |

Chamber effects are included in the published expected-return calculations. No chamber or multiplier is a guaranteed payout.


## 8. Wallet-Verified Soft Staking

Your Undead stays in your wallet. Staking is tracked, not custodial.

### How it works

1. Connect a supported Bitcoin wallet.
2. Sign a one-time challenge message with an expiry time and unique nonce (prevents replay).
3. Our verifier confirms that your inscription sits in an output controlled by that address, using the project's stated indexing rules.
4. Activate staking. Points accrue per hour while the condition holds.
5. If the inscription moves, the session ends at the last verified block.

### Rules

- **Rewards:** staking earns **Grave Points** during the pre-token phase. Points convert to $GRAVE at a published rate when the token launches, drawn from the staking allocation.
- **Weight:** base rate is equal for every Undead. Rarity may add a multiplier of **up to 1.5×**, set from the published rarity method.
- **Transfers:** monitored by block. A moved Undead cannot resume staking for 24 hours, which reduces wallet-hopping.
- **Indexer lag and reorgs:** points are finalized only after 6 confirmations. Disputed states pause accrual until resolved.
- **Honest boundary:** this is wallet-verified participation, not a trustless contract. It depends on our verifier and on Bitcoin indexers, and we publish how both behave.


## 9. Burn to Evolve

Evolution lets holders unlock new looks and eligible gameplay upgrades while the original inscription stays untouched.

### Possible evolutions

- Titanium armor and reinforced skeletal traits
- Burning crowns and supernatural flames
- Cybernetic enhancements and laser effects
- Faction-specific accessories
- Rare visual transformations

### What is burned

**The NFT is never burned.** Evolution consumes **materials earned in expeditions and $GRAVE**. Each upgrade lists its exact cost before you confirm. The $GRAVE portion follows the fee policy in Section 10 (partly burned).

### Companion metadata

Evolved appearances are stored in a companion metadata system and shown by supported marketplaces, our site and rendering tools. Before launch we publish:

- where the records are stored and how they are updated,
- how anyone can verify an Undead's evolution state,
- that upgrades follow the inscription to its new owner, and
- what happens if our service is unavailable (the original inscription still displays; evolved layers may not).

Evolution supports identity and progression. It does not promise higher market value.


## 10. $GRAVE: The Ecosystem Rune

$GRAVE is the utility token of the ecosystem, issued with Bitcoin's Runes protocol.

### Utility

- **Expedition fuel:** entry fees for the Catacombs.
- **Staking rewards:** holder incentives from the staking allocation.
- **Evolution:** costs for selected upgrades.
- **Ecosystem access:** designated events and activities.
- **Advisory votes:** community input if a governance process is introduced.

Not every utility will exist at token launch. The Runes protocol handles balances and transfers; it does not execute game rules.

### Rune parameters (proposed)

| Parameter | Value |
|---|---|
| Maximum supply | 21,000,000 $GRAVE |
| Divisibility | 2 (0.01 minimum unit), so small fees are practical |
| Issuance | Premine to published, project-controlled addresses; no further mint |
| Allocation addresses | Published before token launch |

### Allocation

| Allocation | Share | Amount |
|---|---|---|
| Expedition rewards | 45% | 9,450,000 |
| Staking rewards | 20% | 4,200,000 |
| Liquidity | 15% | 3,150,000 |
| Ecosystem treasury | 10% | 2,100,000 |
| Development and team | 10% | 2,100,000 |
| **Total** | **100%** | **21,000,000** |

### Emission schedule (proposed)

Reward pools release over 48 months on a declining curve to limit long-term inflation.

| Year | Share of pool | Expedition rewards | Staking rewards |
|---|---|---|---|
| 1 | 40% | 3,780,000 | 1,680,000 |
| 2 | 30% | 2,835,000 | 1,260,000 |
| 3 | 20% | 1,890,000 | 840,000 |
| 4 | 10% | 945,000 | 420,000 |

Unspent reward tokens are not re-released early. Any change to the schedule is announced in advance and is never retroactive to earned rewards.

### Vesting and custody (proposed)

- **Development and team (10%):** 6-month cliff from token launch, then linear monthly unlock over 24 months. Wallets published.
- **Ecosystem treasury (10%):** held in a multi-signature wallet ([3-of-5], signers disclosed or described). Quarterly spending report.
- **Liquidity (15%):** Runes have no native time-lock, so liquidity tokens are held in a published multisig and deployed to venues named in advance. Any withdrawal is announced before it occurs. We do not claim liquidity is "locked" unless a venue mechanism enforces it.
- **Reward pools (65%):** held in published addresses and released per the schedule above.

### Fee policy (proposed)

Every expedition and evolution fee is split:

| Share | Use |
|---|---|
| 40% | Permanently burned |
| 40% | Returned to the reward reserve |
| 20% | Operations and infrastructure |

Burns are reported publicly each month. Because the split is fixed here, burn is a stated policy, not a promise of rising price.

### Sustainability testing

Before launch, we simulate low, expected and high activity scenarios against the emission and fee policy and publish the results. Rewards and fees are tuned so emissions stay within budget even in the low-activity case. Token consumption alone does not guarantee a healthy economy.

$GRAVE is not an investment. No price, return, liquidity level or appreciation is promised.


## 11. Bitcoin-Native Architecture

| Layer | Role | Boundary |
|---|---|---|
| Ordinals | Permanent artwork and ownership history | Does not enforce game rules |
| Recursive inscriptions | Shared code and resources, where used | Dependencies and fallbacks documented |
| Runes | $GRAVE balances and transfers | Does not run off-chain logic |
| Ownership verification | Wallet signature plus inscription-to-output check | Indexers can lag or disagree; recovery process published |
| Off-chain game engine | Expeditions, cooldowns, points, rewards | Relies on our service; results reproducible from public records |
| Companion metadata | Evolved looks and stats | Original inscription unchanged |

We will publish which components the team operates, which records are public, how downtime is handled, and which claims users can verify themselves.

## 12. Fairness, Security and Abuse Prevention

We will document the controls actually deployed, not just planned ones.

- Challenge expiry and replay protection for wallet checks.
- Transfer monitoring and clear handling of pending or disputed ownership.
- Reproducible outcomes and published odds tables.
- Rate limits, cooldowns, reward caps and per-wallet daily limits.
- Clear treatment of interrupted expeditions, failed claims and outages.
- Public notice of material changes to rewards or token policy.
- A vulnerability reporting channel ([security contact]) and disclosure of any independent security review.

No system is called audited or exploit-proof unless a completed review supports it.


## 13. Roadmap

The roadmap is milestone-based. Dates are announced once scope and dependencies are firm.

**Phase I: Resurrection**
- Finalize collection, traits and rarity method.
- Publish faction counts and reserved supply.
- Launch website and documentation.
- Test inscription and wallet verification flows.
- Mint the collection.

**Phase II: Awakening**
- Release holder verification.
- Launch soft staking and the Grave Points dashboard.
- Begin internal Catacombs testing.

**Phase III: The Catacombs**
- Release a playable expedition prototype.
- Publish final odds, chamber rules and the outcome-resolution spec.
- Test claims, cooldowns and abuse prevention.
- Introduce the evolution framework after companion metadata is documented.

**Phase IV: The $GRAVE Economy**
- Publish simulation results and final parameters.
- Deploy the $GRAVE Rune.
- Convert Grave Points to $GRAVE.
- Enable token-based expeditions and evolution.

**Phase V: Eternal Expansion**
- Add new expedition environments and seasonal content.
- Expand evolution and faction content.
- Explore Bitcoin ecosystem collaborations.

Milestones are not guarantees of delivery on any date.


## 14. Long-Term Vision

Bitcoin NFTs can become more than static images when they connect to thoughtful, transparent and enjoyable experiences.

We imagine a persistent world where every Undead has an identity, expeditions are worth repeating, evolution gives characters a history, and a carefully managed token supports the economy around them.

The priority is not the number of features. It is a reliable core experience, clear ownership, and reasons for holders to stay after the mint.

The collection is the beginning. The world around it is what we build.


**UNDEAD ORDINALS**

Born from forgotten blocks. Resurrected on Bitcoin. Built to outlive the cycle.

**3,232 Undead. No Second Death.**
