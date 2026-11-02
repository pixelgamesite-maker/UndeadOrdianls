import { Link } from "wouter";
import {
  Section, SectionHead, Plate, Btn, Wordmark, Reveal, Tag, Seq, Corners,
  C, display, serif,
} from "@/components/ui";
import { PROJECT } from "@/lib/theme";
import { TIERS, CHAMBERS } from "@/lib/lore";

const LOOP: [string, string][] = [
  ["Select", "Choose an eligible Undead from a verified wallet."],
  ["Commit", "Pick a tier, review its odds, and pay the entry fee in $GRAVE."],
  ["Resolve", "The outcome is generated from published odds, seeded by Bitcoin block data."],
  ["Claim", "Take $GRAVE, materials or a relic — or the fee is consumed on a failed run."],
  ["Reinvest", "Feed rewards back into new expeditions, or into evolution."],
];

const ALLOC: [string, string, string][] = [
  ["Expedition rewards", "45%", C.ember],
  ["Staking rewards", "20%", C.rune],
  ["Liquidity", "15%", C.bone],
  ["Ecosystem treasury", "10%", C.muted],
  ["Development & team", "10%", C.oxblood],
];

export default function Catacombs() {
  return (
    <>
      <section style={{ padding: "clamp(56px,9vw,100px) clamp(18px,5vw,44px) clamp(24px,5vw,40px)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "inline-flex", marginBottom: 18 }}><Tag color={C.rune}>The core game</Tag></div>
            <Wordmark size="clamp(1.5rem,5.6vw,3rem)" style={{ display: "block" }}>CATACOMBS OF</Wordmark>
            <Wordmark size="clamp(1.5rem,5.6vw,3rem)" style={{ display: "block", marginTop: 2 }}>CONSENSUS</Wordmark>
            <p className="standfirst" style={{ fontFamily: serif, fontSize: "clamp(1.1rem,2.6vw,1.4rem)", color: C.muted, maxWidth: "58ch", margin: "22px 0 0", lineHeight: 1.6 }}>
              A risk-and-reward expedition game. Send an Undead into the dark, pay a {PROJECT.token} fee, and take the
              outcome the published odds give you. Only token deposits and withdrawals touch Bitcoin — the game logic runs
              off-chain and stays reproducible from public records.
            </p>
          </Reveal>
        </div>
      </section>

      {/* expedition loop — true sequence */}
      <Section tone="slab" style={{ paddingTop: "clamp(36px,6vw,64px)" }}>
        <SectionHead designation="The expedition loop" title="Send them down. Bring back what the chain gives up." />
        <div style={{ display: "grid", gap: 12 }}>
          {LOOP.map(([title, desc], i) => (
            <Reveal key={title} delay={i * 0.04}>
              <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.stone, padding: "18px clamp(16px,3vw,24px)", display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "baseline" }}>
                <Corners color={C.rune} />
                <Seq>{String(i + 1).padStart(2, "0")}</Seq>
                <div>
                  <p style={{ fontFamily: display, fontSize: "0.82rem", color: C.boneHi, margin: "0 0 6px" }}>{title}</p>
                  <p style={{ fontFamily: serif, fontSize: "1.02rem", color: C.muted, margin: 0, lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* tiers */}
      <Section tone="ash">
        <SectionHead designation="Expedition tiers" title="Four depths. More risk buys more relic." color={C.oxblood}
          standfirst="Proposed v0 parameters, finalised by simulation before launch." />
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))" }}>
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.05}>
              <div style={{ position: "relative", border: `1px solid ${i === 3 ? C.oxblood : C.stoneUp}`, background: C.stone, padding: 22, height: "100%" }}>
                <Corners color={i === 3 ? C.oxblood : C.rune} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <Tag color={i === 3 ? C.oxblood : C.rune}>{t.risk}</Tag>
                  <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1rem", color: C.ember }}>relic {t.relic}</span>
                </div>
                <p style={{ fontFamily: display, fontSize: "0.88rem", color: C.boneHi, margin: "0 0 16px", lineHeight: 1.35 }}>{t.name}</p>
                <div style={{ display: "grid", gap: 9 }}>
                  {[["Entry", t.fee], ["Duration", t.duration], ["Cooldown", t.cooldown]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${C.lineLo}`, paddingTop: 8 }}>
                      <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.95rem", color: C.faint }}>{k}</span>
                      <span style={{ fontFamily: display, fontSize: "0.76rem", color: C.bone }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <Plate corners={C.rune} pad={20} style={{ marginTop: 16 }}>
            <p style={{ fontFamily: serif, fontSize: "1.02rem", color: C.muted, margin: 0, lineHeight: 1.8 }}>
              The design target returns roughly 70–85% of fees paid to players as {PROJECT.token}, with the rest delivered
              as materials and relics — so the game stays a net token sink. Outcomes use a commit-reveal scheme seeded with
              a future Bitcoin block hash, which anyone can recompute from public data. A block hash alone is never
              described as a complete randomness solution.
            </p>
          </Plate>
        </Reveal>
      </Section>

      {/* chambers */}
      <Section tone="slab">
        <SectionHead designation="The five crypt chambers" title="Modifiers that stir mid-expedition." color={C.rune} />
        <div style={{ display: "grid", gap: 10 }}>
          {CHAMBERS.map((c, i) => (
            <Reveal key={c.numeral} delay={i * 0.04}>
              <div style={{ position: "relative", display: "flex", gap: 18, alignItems: "center", border: `1px solid ${C.stoneUp}`, background: C.stone, padding: "15px clamp(16px,3vw,22px)" }}>
                <Corners color={C.rune} />
                <span style={{ flexShrink: 0, width: 40, fontFamily: display, fontSize: "0.9rem", color: C.rune, textAlign: "center" }}>{c.numeral}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: display, fontSize: "0.78rem", color: C.boneHi, margin: "0 0 4px" }}>{c.name}</p>
                  <p style={{ fontFamily: serif, fontSize: "1rem", color: C.muted, margin: 0, lineHeight: 1.5 }}>{c.effect}</p>
                </div>
                <span style={{ flexShrink: 0, fontFamily: display, fontSize: "0.82rem", color: C.ember }}>{c.chance}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* $GRAVE economy */}
      <Section tone="ash">
        <div className="uo-two" style={{ display: "grid", gap: "clamp(24px,4vw,48px)", gridTemplateColumns: "1fr", alignItems: "start" }}>
          <Reveal>
            <SectionHead designation={`${PROJECT.token} — the ecosystem Rune`} title="A capped, budgeted, Bitcoin-native token." color={C.ember} />
            <p style={{ fontFamily: serif, fontSize: "1.05rem", color: C.muted, lineHeight: 1.85 }}>
              Issued with Bitcoin's Runes protocol, maximum supply {PROJECT.tokenSupply}. It fuels expeditions, staking
              rewards and evolution. Runes handles balances and transfers; it does not execute game rules.
            </p>
            <Plate corners={C.rune} pad={20} style={{ marginTop: 20 }}>
              <p style={{ fontFamily: display, fontSize: "0.74rem", color: C.bone, margin: "0 0 14px" }}>Fee policy</p>
              {[["40%", "Permanently burned"], ["40%", "Returned to the reward reserve"], ["20%", "Operations & infrastructure"]].map(([pct, use]) => (
                <div key={use} style={{ display: "flex", gap: 14, alignItems: "baseline", padding: "6px 0" }}>
                  <span style={{ fontFamily: display, fontSize: "0.76rem", color: C.oxblood, width: 48 }}>{pct}</span>
                  <span style={{ fontFamily: serif, fontSize: "1rem", color: C.bone }}>{use}</span>
                </div>
              ))}
            </Plate>
          </Reveal>
          <Reveal delay={0.08}>
            <Plate corners={C.ember} pad={24}>
              <p style={{ fontFamily: display, fontSize: "0.74rem", color: C.bone, margin: "0 0 18px" }}>Allocation of {PROJECT.tokenSupply}</p>
              {ALLOC.map(([name, pct, color]) => (
                <div key={name} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: serif, fontSize: "1rem", color: C.bone }}>{name}</span>
                    <span style={{ fontFamily: display, fontSize: "0.76rem", color }}>{pct}</span>
                  </div>
                  <div style={{ height: 7, background: C.slab, border: `1px solid ${C.stoneUp}` }}>
                    <div style={{ height: "100%", width: pct, background: color }} />
                  </div>
                </div>
              ))}
            </Plate>
          </Reveal>
        </div>
      </Section>

      {/* evolution + staking */}
      <Section tone="slab">
        <div className="uo-two" style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr" }}>
          <Reveal>
            <Plate corners={C.oxblood} pad={24} style={{ height: "100%" }}>
              <div style={{ display: "inline-flex", marginBottom: 14 }}><Tag color={C.oxblood}>Burn to evolve</Tag></div>
              <p style={{ fontFamily: serif, fontSize: "1.05rem", color: C.muted, lineHeight: 1.8, margin: "0 0 14px" }}>
                Evolution unlocks new looks and eligible upgrades — titanium armour, burning crowns, cybernetic
                enhancements, rare transformations. It consumes materials and {PROJECT.token}, never your NFT.
              </p>
              <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1.12rem", color: C.bone, margin: 0, lineHeight: 1.5 }}>
                The inscription is never burned. The companion layer changes; the artwork on Bitcoin stays untouched.
              </p>
            </Plate>
          </Reveal>
          <Reveal delay={0.08}>
            <Plate corners={C.rune} pad={24} style={{ height: "100%" }}>
              <div style={{ display: "inline-flex", marginBottom: 14 }}><Tag color={C.rune}>Wallet-verified soft staking</Tag></div>
              <p style={{ fontFamily: serif, fontSize: "1.05rem", color: C.muted, lineHeight: 1.8, margin: "0 0 14px" }}>
                Your Undead stays in your wallet. Staking is tracked, not custodial — sign a one-time challenge and earn
                Grave Points per hour while the condition holds. No deposits, no contract holds your inscription.
              </p>
              <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1.12rem", color: C.bone, margin: 0, lineHeight: 1.5 }}>
                You keep your Undead. Points finalise after six confirmations.
              </p>
            </Plate>
          </Reveal>
        </div>
      </Section>

      <Section tone="ash" style={{ textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: display, fontSize: "clamp(1.2rem,3.4vw,1.9rem)", color: C.boneHi, margin: "0 0 24px", lineHeight: 1.35 }}>The core loop ships first. Everything is built on it.</h2>
          <div style={{ display: "flex", gap: 13, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/verify"><Btn>Verify holdings</Btn></Link>
            <Link href="/whitepaper"><Btn tone="bone">Full whitepaper</Btn></Link>
          </div>
        </Reveal>
      </Section>

      <style>{`@media (min-width: 820px) { .uo-two { grid-template-columns: 1fr 1fr !important; } }`}</style>
    </>
  );
}
