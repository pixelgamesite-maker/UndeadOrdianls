import { Link } from "wouter";
import {
  Section, SectionHead, Plate, Btn, Wordmark, Reveal, Tag, Corners,
  C, display, serif,
} from "@/components/ui";
import { PROJECT, ACTIVE_PHASE, ASSET } from "@/lib/theme";
import { FACTIONS } from "@/lib/lore";

const RECORD: [string, string][] = [
  ["Supply", PROJECT.supply.toLocaleString()],
  ["Network", "Bitcoin"],
  ["Format", "Ordinals"],
  ["Factions", "Four"],
];

export default function Collection() {
  const cta = ACTIVE_PHASE === "raffle" || ACTIVE_PHASE === "minting"
    ? { label: "Verify holdings", to: "/verify" }
    : { label: "Join the horde", to: "/raffle" };

  return (
    <>
      <section style={{ padding: "clamp(56px,9vw,100px) clamp(18px,5vw,44px) clamp(28px,5vw,44px)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "inline-flex", marginBottom: 18 }}><Tag>The collection</Tag></div>
            <Wordmark size="clamp(1.8rem,6.5vw,3.4rem)" style={{ display: "block" }}>THE UNDEAD</Wordmark>
            <p className="standfirst" style={{ fontFamily: serif, fontSize: "clamp(1.1rem,2.6vw,1.4rem)", color: C.muted, maxWidth: "56ch", margin: "22px 0 0", lineHeight: 1.6 }}>
              {PROJECT.supply.toLocaleString()} unique inscriptions on Bitcoin Mainnet — undead, cyberpunk, dark fantasy,
              each carrying the scars of the digital afterlife. The original artwork lives on Bitcoin and never changes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* catalogue bar */}
      <div style={{ borderTop: `1px solid ${C.stoneUp}`, borderBottom: `1px solid ${C.stoneUp}`, background: C.slab }}>
        <div className="uo-record" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2,1fr)" }}>
          {RECORD.map(([label, value], i) => (
            <div key={label} style={{ padding: "20px clamp(18px,4vw,34px)", borderLeft: i % 2 ? `1px solid ${C.lineLo}` : "none", borderTop: i >= 2 ? `1px solid ${C.lineLo}` : "none" }}>
              <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.9rem", color: C.faint, margin: "0 0 5px" }}>{label}</p>
              <p style={{ fontFamily: display, fontSize: "clamp(1.05rem,2.6vw,1.5rem)", color: i === 0 ? C.ember : C.boneHi, margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* faction specimens */}
      <Section tone="ash" style={{ paddingTop: "clamp(44px,7vw,88px)" }}>
        <div style={{ display: "grid", gap: "clamp(44px,8vw,92px)" }}>
          {FACTIONS.map((f, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={f.id}>
                <div className="uo-spec" style={{ display: "grid", gap: "clamp(22px,4vw,52px)", gridTemplateColumns: "1fr", alignItems: "center" }}>
                  <div style={{ order: flip ? 2 : 1, position: "relative", maxWidth: 460, marginInline: "auto", width: "100%" }}>
                    <div style={{ position: "absolute", inset: "-9%", background: `radial-gradient(circle, ${f.color}22, transparent 66%)`, pointerEvents: "none" }} />
                    <div style={{ position: "relative", border: `1px solid ${f.color}`, background: C.slab, padding: 13 }}>
                      <Corners color={f.color} size={16} />
                      <img src={f.image} alt={f.name} style={{ width: "100%", display: "block" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.lineLo}` }}>
                        <span style={{ fontFamily: display, fontSize: "0.7rem", color: C.bone }}>Specimen UO-{String(1 + i * 808).padStart(4, "0")}</span>
                        <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.92rem", color: f.color }}>Faction {["I", "II", "III", "IV"][i]}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ order: flip ? 1 : 2 }}>
                    <div style={{ display: "inline-flex", marginBottom: 14 }}><Tag color={f.color}>{f.identity}</Tag></div>
                    <h3 style={{ fontFamily: display, fontSize: "clamp(1.1rem,3.2vw,1.7rem)", color: C.boneHi, margin: "0 0 16px", lineHeight: 1.3 }}>{f.name}</h3>
                    <p style={{ fontFamily: serif, fontSize: "1.08rem", color: C.muted, lineHeight: 1.85, margin: 0 }}>{f.design}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* rarity */}
      <Section tone="slab">
        <Reveal>
          <Plate corners={C.rune} pad={28}>
            <SectionHead designation="Traits & rarity" title="Disclosed, capped, and never hidden." color={C.ember} />
            <p style={{ fontFamily: serif, fontSize: "1.06rem", color: C.muted, lineHeight: 1.85, margin: 0 }}>
              Trait categories and the rarity method are published before mint. Traits may affect staking weight, and
              every such effect is disclosed and capped at up to 1.5×. No trait gives a hidden advantage in expedition
              outcomes. Faction counts and reserved supply for team, giveaways and partners are confirmed before mint.
            </p>
          </Plate>
        </Reveal>
      </Section>

      <Section tone="ash" style={{ textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: display, fontSize: "clamp(1.2rem,3.4vw,1.9rem)", color: C.boneHi, margin: "0 0 24px" }}>Claim one before the gates close.</h2>
          <div style={{ display: "flex", gap: 13, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={cta.to}><Btn>{cta.label}</Btn></Link>
            <Link href="/catacombs"><Btn tone="bone">See what they do</Btn></Link>
          </div>
        </Reveal>
      </Section>

      <style>{`
        @media (min-width: 760px) {
          .uo-spec { grid-template-columns: 1fr 1fr !important; }
          .uo-record > div:not(:first-child) { border-left: 1px solid ${C.lineLo} !important; border-top: none !important; }
        }
        @media (min-width: 640px) { .uo-record { grid-template-columns: repeat(4,1fr) !important; } }
      `}</style>
    </>
  );
}
