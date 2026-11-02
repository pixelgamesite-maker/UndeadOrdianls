import { Link } from "wouter";
import {
  Section, Kicker, Heading, Btn, Panel, Reveal, Pill, GlitchText,
  C, display, body, mono,
} from "@/components/ui";
import { AshField } from "@/components/Effects";
import { PROJECT, ACTIVE_PHASE } from "@/lib/theme";
import { FACTIONS } from "@/lib/lore";

export default function Collection() {
  const cta = ACTIVE_PHASE === "raffle" || ACTIVE_PHASE === "minting"
    ? { label: "Verify & Claim", to: "/verify" }
    : { label: "Join the Horde", to: "/raffle" };

  return (
    <>
      {/* header */}
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(70px,11vw,120px) clamp(18px,5vw,40px) clamp(40px,7vw,64px)", textAlign: "center" }}>
        <AshField density={22} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 820, margin: "0 auto" }}>
          <Kicker color={C.btc}><span style={{ marginInline: "auto" }}>The Collection</span></Kicker>
          <GlitchText size="clamp(1.5rem,6vw,3rem)">THE UNDEAD</GlitchText>
          <p style={{ fontFamily: body, fontSize: "clamp(0.98rem,2.4vw,1.1rem)", color: C.muted, maxWidth: "58ch", margin: "22px auto 0", lineHeight: 1.8 }}>
            {PROJECT.supply.toLocaleString()} unique inscriptions on Bitcoin Mainnet using the Ordinals protocol.
            Undead, cyberpunk, dark fantasy — each one carrying the scars of the digital afterlife.
            The original artwork lives on Bitcoin and never changes.
          </p>
        </div>
      </section>

      {/* collection stats */}
      <Section tone="crypt" style={{ paddingTop: 0 }}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))" }}>
          {[
            ["SUPPLY", PROJECT.supply.toLocaleString()],
            ["NETWORK", "Bitcoin"],
            ["FORMAT", "Ordinals"],
            ["FACTIONS", "4"],
          ].map(([l, v]) => (
            <Panel key={l} color={C.tomb} style={{ textAlign: "center" }} pad={16}>
              <p style={{ fontFamily: display, fontSize: "clamp(0.85rem,2.4vw,1.2rem)", color: C.btc, margin: "0 0 7px" }}>{v}</p>
              <p style={{ fontFamily: mono, fontSize: "0.95rem", letterSpacing: "0.18em", color: C.muted, margin: 0 }}>{l}</p>
            </Panel>
          ))}
        </div>
      </Section>

      {/* faction showcases */}
      <Section tone="void" style={{ paddingTop: "clamp(30px,5vw,60px)" }}>
        <div style={{ display: "grid", gap: "clamp(40px,7vw,76px)" }}>
          {FACTIONS.map((f, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={f.id}>
                <div className="uo-faction" style={{ display: "grid", gap: "clamp(22px,4vw,48px)", gridTemplateColumns: "1fr", alignItems: "center" }}>
                  <div style={{ position: "relative", order: flip ? 2 : 1 }}>
                    <div style={{ position: "absolute", inset: "-10%", background: `radial-gradient(circle, ${f.color}22, transparent 65%)`, pointerEvents: "none" }} />
                    <img src={f.image} alt={f.name} style={{
                      position: "relative", width: "100%", display: "block",
                      border: `3px solid ${f.color}`, boxShadow: `0 0 50px ${f.color}44, inset 0 0 30px #000`,
                    }} />
                  </div>
                  <div style={{ order: flip ? 1 : 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <span style={{ width: 12, height: 12, background: f.color, boxShadow: `0 0 14px ${f.color}` }} />
                      <Pill color={f.color}>Faction {["I", "II", "III", "IV"][i]}</Pill>
                    </div>
                    <h3 style={{ fontFamily: display, fontSize: "clamp(0.95rem,3vw,1.5rem)", color: C.bone, margin: "0 0 10px", lineHeight: 1.35 }}>{f.name}</h3>
                    <p style={{ fontFamily: mono, fontSize: "1.3rem", color: f.color, letterSpacing: "0.05em", margin: "0 0 16px" }}>{f.identity}</p>
                    <p style={{ fontFamily: body, fontSize: "1.03rem", color: C.muted, lineHeight: 1.85, margin: 0 }}>{f.design}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* rarity / traits note */}
      <Section tone="crypt">
        <Reveal>
          <Panel color={C.tombUp} glow={C.btc}>
            <Kicker color={C.gold}>Traits & Rarity</Kicker>
            <p style={{ fontFamily: body, fontSize: "1.02rem", color: C.muted, lineHeight: 1.85, margin: 0 }}>
              Trait categories and the rarity methodology will be published before mint. Traits may affect staking
              weight — every such effect is disclosed and capped at up to <strong style={{ color: C.bone }}>1.5×</strong>.
              <strong style={{ color: C.btc }}> No trait gives hidden advantages in expedition outcomes.</strong> Faction
              counts and reserved supply (team, giveaways, partners) are confirmed and published before mint.
            </p>
          </Panel>
        </Reveal>
      </Section>

      {/* cta */}
      <Section tone="void" style={{ textAlign: "center" }}>
        <Reveal>
          <Heading size="md">Claim an Undead before the gates close.</Heading>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
            <Link href={cta.to}><Btn color={C.btc}>{cta.label}</Btn></Link>
            <Link href="/catacombs"><Btn tone="ghost" color={C.bone}>See what they do</Btn></Link>
          </div>
        </Reveal>
      </Section>

      <style>{`
        @media (min-width: 760px) {
          .uo-faction { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}
