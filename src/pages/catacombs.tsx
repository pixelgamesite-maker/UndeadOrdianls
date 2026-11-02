import { Link } from "wouter";
import {
  Section, Kicker, Heading, Btn, Panel, Reveal, Pill, GlitchText, notch,
  C, display, body, mono,
} from "@/components/ui";
import { AshField } from "@/components/Effects";
import { PROJECT } from "@/lib/theme";
import { TIERS, CHAMBERS } from "@/lib/lore";

const LOOP = [
  ["Select", "Pick an eligible Undead from a verified wallet."],
  ["Choose", "Review a tier's fee, duration, cooldown and odds."],
  ["Commit", "Pay the entry fee in $GRAVE."],
  ["Resolve", "Outcome from published odds, seeded by Bitcoin block data."],
  ["Claim", "$GRAVE, materials or relics — or the fee is consumed."],
  ["Reinvest", "Feed rewards back into expeditions or evolution."],
];

const ALLOC = [
  ["Expedition rewards", "45%", C.ice],
  ["Staking rewards", "20%", C.volt],
  ["Liquidity", "15%", C.gold],
  ["Ecosystem treasury", "10%", C.bone],
  ["Development & team", "10%", C.ember],
];

export default function Catacombs() {
  return (
    <>
      {/* header */}
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(70px,11vw,120px) clamp(18px,5vw,40px) clamp(40px,7vw,60px)", textAlign: "center" }}>
        <AshField density={24} hot={C.ember} cold={C.volt} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 860, margin: "0 auto" }}>
          <Kicker color={C.volt}><span style={{ marginInline: "auto" }}>The Core Game</span></Kicker>
          <GlitchText size="clamp(1.3rem,5.5vw,2.8rem)">CATACOMBS OF CONSENSUS</GlitchText>
          <p style={{ fontFamily: body, fontSize: "clamp(0.98rem,2.4vw,1.1rem)", color: C.muted, maxWidth: "60ch", margin: "22px auto 0", lineHeight: 1.8 }}>
            A risk-and-reward expedition game. Send an Undead into the dark, pay an entry fee in {PROJECT.token},
            and receive an outcome determined by published odds and chamber modifiers. Only token deposits and
            withdrawals touch Bitcoin — the game logic runs off-chain and is reproducible from public records.
          </p>
        </div>
      </section>

      {/* expedition loop */}
      <Section tone="crypt" style={{ paddingTop: 0 }}>
        <Reveal style={{ marginBottom: 34 }}>
          <Kicker>The Expedition Loop</Kicker>
          <Heading size="md">Six steps, repeated until the chain gives up its secrets.</Heading>
        </Reveal>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))" }}>
          {LOOP.map(([title, desc], i) => (
            <Reveal key={title} delay={i * 0.05}>
              <Panel color={C.tomb} pad={18} style={{ height: "100%" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 9 }}>
                  <span style={{ fontFamily: display, fontSize: "0.72rem", color: C.volt }}>{String(i + 1).padStart(2, "0")}</span>
                  <p style={{ fontFamily: display, fontSize: "0.62rem", color: C.bone, margin: 0, letterSpacing: "0.03em" }}>{title}</p>
                </div>
                <p style={{ fontFamily: body, fontSize: "0.94rem", color: C.muted, margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* tiers */}
      <Section tone="void">
        <Reveal style={{ marginBottom: 30 }}>
          <Kicker color={C.ember}>Expedition Tiers</Kicker>
          <Heading size="md">Four depths. More risk, more relic.</Heading>
          <p style={{ fontFamily: mono, fontSize: "1.05rem", color: C.faint, margin: 0, letterSpacing: "0.04em" }}>// proposed v0 parameters — finalized by simulation before launch</p>
        </Reveal>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))" }}>
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06}>
              <Panel color={C.tomb} glow={i === 3 ? C.ember : undefined} style={{ height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <Pill color={i === 3 ? C.ember : C.ice}>{t.risk}</Pill>
                  <span style={{ fontFamily: mono, fontSize: "1.15rem", color: C.gold }}>relic {t.relic}</span>
                </div>
                <p style={{ fontFamily: display, fontSize: "0.68rem", color: C.bone, margin: "0 0 16px", lineHeight: 1.4 }}>{t.name}</p>
                <div style={{ display: "grid", gap: 8 }}>
                  {[["Entry", t.fee], ["Duration", t.duration], ["Cooldown", t.cooldown]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${C.line}`, paddingTop: 7 }}>
                      <span style={{ fontFamily: mono, fontSize: "1rem", color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{k}</span>
                      <span style={{ fontFamily: mono, fontSize: "1.05rem", color: C.bone }}>{v}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <Panel color={C.tombUp} style={{ marginTop: 16 }} pad={18}>
            <p style={{ fontFamily: body, fontSize: "0.96rem", color: C.muted, margin: 0, lineHeight: 1.75 }}>
              <strong style={{ color: C.ice }}>Design target:</strong> expected {PROJECT.token} returned to players is
              ~70–85% of fees paid, with the rest delivered as materials and relics. This keeps the game a net token
              sink. Outcomes use a commit-reveal scheme seeded with a future Bitcoin block hash — anyone can recompute
              the result from public data. A block hash alone is never described as a complete randomness solution.
            </p>
          </Panel>
        </Reveal>
      </Section>

      {/* chambers */}
      <Section tone="crypt">
        <Reveal style={{ marginBottom: 30 }}>
          <Kicker color={C.volt}>The Five Crypt Chambers</Kicker>
          <Heading size="md">Modifiers that can trigger mid-expedition.</Heading>
        </Reveal>
        <div style={{ display: "grid", gap: 10 }}>
          {CHAMBERS.map((c, i) => (
            <Reveal key={c.numeral} delay={i * 0.05}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", border: `2px solid ${C.tomb}`, background: C.void, padding: "14px 16px" }}>
                <div style={{ flexShrink: 0, width: 46, height: 46, display: "grid", placeItems: "center", border: `2px solid ${C.tombUp}`, clipPath: notch(7), fontFamily: display, fontSize: "0.7rem", color: C.volt }}>{c.numeral}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: mono, fontSize: "1.2rem", color: C.bone, margin: "0 0 2px", letterSpacing: "0.04em" }}>{c.name}</p>
                  <p style={{ fontFamily: body, fontSize: "0.92rem", color: C.muted, margin: 0, lineHeight: 1.5 }}>{c.effect}</p>
                </div>
                <span style={{ flexShrink: 0, fontFamily: mono, fontSize: "1.15rem", color: C.ice }}>{c.chance}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* $GRAVE economy */}
      <Section tone="void">
        <div className="uo-grave" style={{ display: "grid", gap: "clamp(24px,4vw,48px)", gridTemplateColumns: "1fr", alignItems: "start" }}>
          <Reveal>
            <Kicker color={C.gold}>{PROJECT.token} — The Ecosystem Rune</Kicker>
            <Heading size="md">A capped, budgeted, Bitcoin-native token.</Heading>
            <p style={{ fontFamily: body, fontSize: "1.0rem", color: C.muted, lineHeight: 1.85 }}>
              {PROJECT.token} is the utility token of the ecosystem, issued with Bitcoin's Runes protocol.
              Max supply <strong style={{ color: C.gold }}>{PROJECT.tokenSupply}</strong>. It fuels expeditions,
              staking rewards and evolution. The Runes protocol handles balances and transfers — it does not
              execute game rules.
            </p>
            <Panel color={C.tomb} pad={16} style={{ marginTop: 18 }}>
              <p style={{ fontFamily: mono, fontSize: "1rem", color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px" }}>Fee Policy (proposed)</p>
              {[["40%", "Permanently burned"], ["40%", "Returned to reward reserve"], ["20%", "Operations & infrastructure"]].map(([pct, use]) => (
                <div key={use} style={{ display: "flex", gap: 12, alignItems: "center", padding: "5px 0" }}>
                  <span style={{ fontFamily: display, fontSize: "0.62rem", color: C.ember, width: 46 }}>{pct}</span>
                  <span style={{ fontFamily: body, fontSize: "0.95rem", color: C.bone }}>{use}</span>
                </div>
              ))}
            </Panel>
          </Reveal>
          <Reveal delay={0.1}>
            <Panel color={C.tombUp} glow={C.gold}>
              <p style={{ fontFamily: mono, fontSize: "1rem", color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>Allocation</p>
              {ALLOC.map(([name, pct, color]) => (
                <div key={name as string} style={{ marginBottom: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: body, fontSize: "0.95rem", color: C.bone }}>{name}</span>
                    <span style={{ fontFamily: mono, fontSize: "1.1rem", color: color as string }}>{pct}</span>
                  </div>
                  <div style={{ height: 8, background: C.void, border: `1px solid ${C.tomb}` }}>
                    <div style={{ height: "100%", width: pct as string, background: color as string, boxShadow: `0 0 12px ${color}88` }} />
                  </div>
                </div>
              ))}
            </Panel>
          </Reveal>
        </div>
      </Section>

      {/* evolution + staking */}
      <Section tone="crypt">
        <div className="uo-grave" style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr" }}>
          <Reveal>
            <Panel color={C.tomb} glow={C.ember} style={{ height: "100%" }}>
              <Kicker color={C.ember}>Burn to Evolve</Kicker>
              <p style={{ fontFamily: body, fontSize: "1rem", color: C.muted, lineHeight: 1.8, margin: "0 0 12px" }}>
                Evolution unlocks new looks and eligible upgrades — titanium armor, burning crowns, cybernetic
                enhancements, rare transformations. It consumes materials and {PROJECT.token}, never your NFT.
              </p>
              <p style={{ fontFamily: mono, fontSize: "1.15rem", color: C.ember, letterSpacing: "0.03em", margin: 0 }}>
                The inscription is never burned. The companion layer changes; the artwork on Bitcoin stays untouched.
              </p>
            </Panel>
          </Reveal>
          <Reveal delay={0.08}>
            <Panel color={C.tomb} glow={C.ice} style={{ height: "100%" }}>
              <Kicker color={C.ice}>Wallet-Verified Soft Staking</Kicker>
              <p style={{ fontFamily: body, fontSize: "1rem", color: C.muted, lineHeight: 1.8, margin: "0 0 12px" }}>
                Your Undead stays in your wallet. Staking is tracked, not custodial. Sign a one-time challenge and
                earn Grave Points per hour while the condition holds — no deposits, no contracts holding your inscription.
              </p>
              <p style={{ fontFamily: mono, fontSize: "1.15rem", color: C.ice, letterSpacing: "0.03em", margin: 0 }}>
                You keep your Undead. Points finalize after 6 confirmations.
              </p>
            </Panel>
          </Reveal>
        </div>
      </Section>

      {/* cta */}
      <Section tone="void" style={{ textAlign: "center" }}>
        <Reveal>
          <Heading size="md">The core loop ships first. Everything else is built on it.</Heading>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
            <Link href="/verify"><Btn color={C.volt}>Verify & Claim</Btn></Link>
            <Link href="/whitepaper"><Btn tone="ghost" color={C.bone}>Full whitepaper</Btn></Link>
          </div>
        </Reveal>
      </Section>

      <style>{`
        @media (min-width: 820px) {
          .uo-grave { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}
