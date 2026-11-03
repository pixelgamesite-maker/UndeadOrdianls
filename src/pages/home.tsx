import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Section, SectionHead, Btn, Wordmark, Sigil, Reveal, Tag, Seq, Corners, Cobweb, Spider, Fog,
  C, display, serif,
} from "@/components/ui";
import { HeroScan } from "@/components/Effects";
import { PROJECT, ACTIVE_PHASE, ASSET } from "@/lib/theme";
import { FACTIONS, ROADMAP, TRUST } from "@/lib/lore";

function phaseLine() {
  switch (ACTIVE_PHASE) {
    case "teaser":   return { status: "Gathering", live: false, text: "", cta: "Join the horde", to: "/raffle" };
    case "raffle":   return { status: "Raffle open", live: true, text: "", cta: "Verify holdings", to: "/verify" };
    case "waitlist": return { status: "Waitlist open", live: true, text: "", cta: "Join waitlist", to: "/raffle" };
    case "minting":  return { status: "Minting", live: true, text: "", cta: "Mint", to: "/verify" };
    case "minted":   return { status: "Minted out", live: false, text: "", cta: "View collection", to: "/collection" };
  }
}

const RECORD: [string, string][] = [
  ["Designation", PROJECT.supply.toLocaleString()],
  ["Chain", "Bitcoin"],
  ["Rune", PROJECT.token],
  ["Factions", "Four"],
];

export default function Home() {
  const p = phaseLine();

  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section style={{ position: "relative", padding: "clamp(40px,7vw,86px) clamp(18px,5vw,44px) clamp(48px,7vw,80px)", overflow: "hidden" }}>
        <Cobweb corner="tl" size={160} opacity={0.11} />
        <div style={{ position: "absolute", top: 0, right: "6%" }}><Spider drop={104} /></div>
        <Cobweb corner="tr" size={130} opacity={0.08} />
        <Fog />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1120, margin: "0 auto", display: "grid", gap: "clamp(32px,5vw,60px)", gridTemplateColumns: "1fr", alignItems: "center" }} className="uo-hero">
          <div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <div style={{ display: "inline-flex", marginBottom: 20 }}><Tag color={p.live ? C.ember : C.rune}>{p.status}</Tag></div>
              <Wordmark size="clamp(2.3rem,8.5vw,5rem)" style={{ display: "block" }}>UNDEAD</Wordmark>
              <Wordmark size="clamp(2.3rem,8.5vw,5rem)" style={{ display: "block", marginTop: 2 }}>ORDINALS</Wordmark>

              <p className="standfirst" style={{ fontFamily: serif, fontSize: "clamp(1.2rem,3vw,1.6rem)", color: C.bone, margin: "22px 0 0", lineHeight: 1.5, maxWidth: "24ch" }}>
                {PROJECT.tagline}
              </p>
              <p style={{ fontFamily: serif, fontSize: "1.08rem", color: C.muted, lineHeight: 1.75, margin: "18px 0 0", maxWidth: "46ch" }}>
                {PROJECT.supply.toLocaleString()} undead artifacts, inscribed on Bitcoin and resurrected to explore the
                Catacombs of Consensus, a gaming economy powered by the {PROJECT.token} Rune.
              </p>

              <div style={{ display: "flex", gap: 13, flexWrap: "wrap", margin: "30px 0 0" }}>
                <Link href={p.to}><Btn>{p.cta}</Btn></Link>
                <Link href="/collection"><Btn tone="bone">Meet the undead</Btn></Link>
              </div>
            </motion.div>
          </div>

          {/* mounted film reel */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div style={{ position: "relative", maxWidth: 520, marginInline: "auto" }}>
              <div style={{ position: "absolute", inset: "-12%", background: `radial-gradient(circle, ${C.ember}24, transparent 66%)`, pointerEvents: "none" }} />
              <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.slab, padding: 13 }}>
                <Corners color={C.ember} size={16} />
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <video src={ASSET.video} autoPlay muted loop playsInline poster={ASSET.logo} aria-label="An Undead crossing the Catacombs toward the Bitcoin moon"
                    style={{ width: "100%", display: "block", animation: "develop 1.8s ease-out 0.2s both" }} />
                  <HeroScan />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.lineLo}` }}>
                  <span style={{ fontFamily: display, fontSize: "0.72rem", color: C.bone }}>Catacombs reel 01</span>
                  <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.95rem", color: C.rune }}>Crossing the Styx of Consensus</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────────── CATALOGUE BAR ───────────── */}
      <div style={{ borderTop: `1px solid ${C.stoneUp}`, borderBottom: `1px solid ${C.stoneUp}`, background: C.slab }}>
        <div className="uo-record" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2,1fr)" }}>
          {RECORD.map(([label, value], i) => (
            <div key={label} style={{ padding: "22px clamp(18px,4vw,34px)", borderLeft: i % 2 ? `1px solid ${C.lineLo}` : "none", borderTop: i >= 2 ? `1px solid ${C.lineLo}` : "none" }}>
              <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.92rem", color: C.faint, margin: "0 0 6px" }}>{label}</p>
              <p style={{ fontFamily: display, fontSize: "clamp(1.1rem,3vw,1.7rem)", color: i === 0 ? C.ember : C.boneHi, margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────── LORE ───────────── */}
      <Section tone="ash">
        <div className="uo-split" style={{ display: "grid", gap: "clamp(28px,5vw,60px)", gridTemplateColumns: "1fr", alignItems: "center" }}>
          <Reveal>
            <SectionHead designation="Origin" title="Deep beneath the chain, the forgotten began to move."
              standfirst="The Catacombs of Consensus held abandoned transactions and lost satoshis in silence, until the Sat Mortis." />
            <div style={{ fontFamily: serif, fontSize: "1.08rem", color: C.muted, lineHeight: 1.85 }}>
              <p style={{ marginTop: 0 }}>
                From the depths rose {PROJECT.supply.toLocaleString()} Undead Ordinals, each carrying the scars of the
                digital afterlife. Some flicker with unstable energy. Some burn with the heat of computation. Others were
                rebuilt with strange machinery, or sealed in armour that refuses to break.
              </p>
              <p style={{ color: C.bone, fontStyle: "italic", fontSize: "1.2rem" }}>
                They were not created to disappear. They were resurrected to explore, evolve and conquer the chain.
              </p>
            </div>
            <div style={{ marginTop: 26 }}><Link href="/catacombs"><Btn tone="ghost" color={C.rune}>Read the lore</Btn></Link></div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ position: "relative", maxWidth: 420, marginInline: "auto" }}>
              <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.slab, padding: 12 }}>
                <Corners color={FACTIONS[1].color} size={15} />
                <img src={ASSET.berserker} alt="A Coronal Berserker" style={{ width: "100%", display: "block" }} />
                <p style={{ fontFamily: display, fontSize: "0.72rem", color: C.bone, margin: "12px 2px 0" }}>Specimen UO 0719</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ───────────── FACTIONS ───────────── */}
      <Section tone="slab">
        <SectionHead designation="Taxonomy" title="Four ways to come back wrong." color={C.rune}
          standfirst="Every Undead belongs to one of four factions, a lineage written into its look and its lot." />
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))" }}>
          {FACTIONS.map((f, i) => (
            <Reveal key={f.id} delay={i * 0.06}>
              <Link href="/collection">
                <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.stone, cursor: "pointer", transition: "border-color .22s, transform .22s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.stoneUp; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <Corners color={f.color} />
                  <div style={{ aspectRatio: "1", overflow: "hidden", borderBottom: `1px solid ${C.stoneUp}` }}>
                    <img src={f.image} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "15px 16px 18px" }}>
                    <p style={{ fontFamily: display, fontSize: "0.76rem", color: C.boneHi, margin: "0 0 7px", lineHeight: 1.45 }}>{f.name}</p>
                    <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1rem", color: f.color, margin: 0 }}>{f.identity}</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ───────────── TRUST LEDGER ───────────── */}
      <Section tone="ash">
        <SectionHead designation="Disclosure" title="We say exactly what lives where."
          standfirst="Bitcoin secures ownership and token balances. It does not run game logic. Nothing is called audited or trustless until a completed review supports it." />
        <Reveal>
          <div style={{ border: `1px solid ${C.stoneUp}`, position: "relative" }}>
            <Corners color={C.rune} />
            {TRUST.map((t, i) => (
              <div key={t.component} className="uo-ledger-row" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 5, padding: "17px clamp(16px,3vw,24px)", borderTop: i ? `1px solid ${C.lineLo}` : "none" }}>
                <span style={{ fontFamily: display, fontSize: "0.82rem", color: C.boneHi }}>{t.component}</span>
                <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.98rem", color: C.ember }}>{t.where}</span>
                <span style={{ fontFamily: serif, fontSize: "0.98rem", color: C.muted, lineHeight: 1.55 }}>{t.trust}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ───────────── ROADMAP ───────────── */}
      <Section tone="slab">
        <SectionHead designation="The path back" title="Five phases. Core loop first." color={C.rune}
          standfirst="Milestone based, not date based. We ship and test the expedition loop before expanding the world around it." />
        <div style={{ display: "grid", gap: 12 }}>
          {ROADMAP.map((ph, i) => (
            <Reveal key={ph.numeral} delay={i * 0.04}>
              <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.stone, padding: "20px clamp(18px,3vw,26px)", display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(16px,3vw,28px)", alignItems: "start" }}>
                <Corners color={C.rune} />
                <div style={{ textAlign: "center", minWidth: 42 }}>
                  <Seq>{ph.numeral}</Seq>
                  <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.82rem", color: C.faint, margin: "4px 0 0" }}>phase</p>
                </div>
                <div>
                  <p style={{ fontFamily: display, fontSize: "0.92rem", color: C.boneHi, margin: "0 0 12px" }}>{ph.title}</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
                    {ph.points.map((pt) => (
                      <li key={pt} style={{ fontFamily: serif, fontSize: "1rem", color: C.muted, display: "flex", gap: 11, lineHeight: 1.5 }}>
                        <span style={{ color: C.ember, flexShrink: 0, fontFamily: display, fontSize: "0.7rem", marginTop: 3 }}>+</span>{pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ───────────── CTA ───────────── */}
      <section style={{ position: "relative", background: C.ash, borderTop: `1px solid ${C.stoneUp}`, padding: "clamp(60px,9vw,110px) clamp(18px,5vw,44px)", textAlign: "center", overflow: "hidden" }}>
        <Cobweb corner="tr" size={150} opacity={0.08} />
        <Fog />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}><Sigil size={56} color={C.ember} /></div>
            <Wordmark size="clamp(1.5rem,5vw,2.8rem)">NO SECOND DEATH</Wordmark>
            <p style={{ fontFamily: serif, fontSize: "1.12rem", color: C.muted, margin: "22px auto 32px", maxWidth: "48ch", lineHeight: 1.75 }}>
              The collection is the beginning; the world around it is what we build. Prove your holdings, claim your
              place, and rise with the horde.
            </p>
            <div style={{ display: "flex", gap: 13, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={p.to}><Btn>{p.cta}</Btn></Link>
              <Link href="/whitepaper"><Btn tone="bone">Read the whitepaper</Btn></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        @media (min-width: 860px) {
          .uo-hero { grid-template-columns: 1.05fr 0.95fr !important; }
          .uo-split { grid-template-columns: 1.1fr 0.9fr !important; }
          .uo-record { grid-template-columns: repeat(4,1fr) !important; }
          .uo-record > div:not(:first-child) { border-left: 1px solid ${C.lineLo} !important; border-top: none !important; }
          .uo-ledger-row { grid-template-columns: 1.1fr 1fr 1.6fr !important; gap: 20px !important; align-items: center; }
        }
      `}</style>
    </>
  );
}
