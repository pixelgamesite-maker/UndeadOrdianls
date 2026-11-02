import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Section, Kicker, Heading, Btn, Panel, GlitchText, Reveal, Pill, LiveDot, notch,
  C, display, body, mono,
} from "@/components/ui";
import { AshField } from "@/components/Effects";
import { PROJECT, ACTIVE_PHASE, ASSET } from "@/lib/theme";
import { FACTIONS, ROADMAP, TRUST } from "@/lib/lore";

const TICKER = [
  "THE DEAD DON'T STAY DEAD",
  "INSCRIBED ON BITCOIN",
  "ENTER THE CATACOMBS",
  "POWERED BY $GRAVE",
  "NO SECOND DEATH",
  "RESURRECTED ON-CHAIN",
];

function phaseBanner() {
  switch (ACTIVE_PHASE) {
    case "teaser":   return { dot: "SOON", text: "The horde is gathering. Join before the gates open.", cta: "Join the Horde", to: "/raffle" };
    case "raffle":   return { dot: "LIVE", text: "Verified-holder raffle is open. Prove your holdings — no wallet connect.", cta: "Verify & Claim", to: "/verify" };
    case "waitlist": return { dot: "LIVE", text: "Public waitlist is open to everyone. Secure your place in line.", cta: "Join Waitlist", to: "/raffle" };
    case "minting":  return { dot: "LIVE", text: "Mint is live. The Catacombs are open.", cta: "Mint Now", to: "/verify" };
    case "minted":   return { dot: "DONE", text: "Minted out. Explore the collection and the Catacombs.", cta: "View Collection", to: "/collection" };
  }
}

export default function Home() {
  const banner = phaseBanner();

  return (
    <>
      {/* ───────────────── HERO ───────────────── */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "92vh", display: "flex", alignItems: "center" }}>
        <AshField density={34} />
        {/* glow pool behind the skull */}
        <div aria-hidden style={{
          position: "absolute", top: "18%", left: "50%", transform: "translateX(-50%)",
          width: "min(80vw,620px)", height: "min(80vw,620px)",
          background: `radial-gradient(circle, ${C.ice}22, transparent 62%)`, pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1080, margin: "0 auto", padding: "80px clamp(18px,5vw,40px) 60px", textAlign: "center", width: "100%" }}>
          <motion.img
            src={ASSET.logo} alt="Undead Ordinals"
            width={200} height={200}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              width: "clamp(140px,26vw,220px)", height: "auto", margin: "0 auto 26px", display: "block",
              border: `3px solid ${C.tombUp}`, boxShadow: `0 0 50px ${C.ice}55, inset 0 0 20px #000`,
              animation: "float 6s ease-in-out infinite",
            }}
          />

          <div style={{ marginBottom: 14 }}>
            <Pill color={C.ice}>{PROJECT.supply.toLocaleString()} ON BITCOIN</Pill>
          </div>

          <GlitchText size="clamp(1.9rem,8vw,4.6rem)" style={{ display: "block", marginBottom: 6 }}>UNDEAD</GlitchText>
          <GlitchText size="clamp(1.9rem,8vw,4.6rem)" style={{ display: "block", marginBottom: 22 }}>ORDINALS</GlitchText>

          <p style={{ fontFamily: mono, fontSize: "clamp(1.2rem,3.4vw,1.7rem)", color: C.ice, letterSpacing: "0.08em", margin: "0 0 10px" }}>
            {PROJECT.tagline}
          </p>
          <p style={{ fontFamily: body, fontSize: "clamp(0.98rem,2.4vw,1.12rem)", color: C.muted, maxWidth: "58ch", margin: "0 auto 34px", lineHeight: 1.75 }}>
            {PROJECT.supply.toLocaleString()} undead artifacts inscribed on Bitcoin — and the foundation of a
            Bitcoin-native gaming ecosystem. Send your Undead into the Catacombs of Consensus,
            evolve them, and join an economy powered by the {PROJECT.token} Rune.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={banner.to}><Btn color={C.ice}>{banner.cta}</Btn></Link>
            <Link href="/collection"><Btn tone="ghost" color={C.bone}>Meet the Undead</Btn></Link>
          </div>

          {/* live phase chip */}
          <div style={{ marginTop: 30, display: "inline-flex", alignItems: "center", gap: 12, border: `1px solid ${C.tombUp}`, clipPath: notch(7), padding: "9px 16px", background: "rgba(10,12,19,0.7)" }}>
            <LiveDot label={banner.dot} color={banner.dot === "LIVE" ? C.ember : C.ice} />
            <span style={{ fontFamily: body, fontSize: "0.92rem", color: C.muted }}>{banner.text}</span>
          </div>
        </div>
      </section>

      {/* ───────────────── TICKER ───────────────── */}
      <div style={{ background: C.ice, color: C.void, overflow: "hidden", whiteSpace: "nowrap", borderTop: `2px solid ${C.void}`, borderBottom: `2px solid ${C.void}`, position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", animation: "marquee 22s linear infinite" }}>
          {[0, 1].map((rep) => (
            <div key={rep} style={{ display: "inline-flex", flexShrink: 0 }}>
              {TICKER.map((t, i) => (
                <span key={i} style={{ fontFamily: display, fontSize: "0.7rem", padding: "13px 26px", letterSpacing: "0.04em" }}>
                  {t} <span style={{ opacity: 0.4 }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────── STATS ───────────────── */}
      <Section tone="void">
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))" }}>
          {[
            ["SUPPLY", PROJECT.supply.toLocaleString(), C.ice],
            ["BLOCKCHAIN", "Bitcoin", C.bone],
            ["TOKEN", PROJECT.token, C.gold],
            ["FACTIONS", "4", C.volt],
          ].map(([label, value, color], i) => (
            <Reveal key={label} delay={i * 0.06}>
              <Panel color={C.tomb} glow={color} style={{ textAlign: "center" }}>
                <p style={{ fontFamily: display, fontSize: "clamp(1.1rem,3vw,1.7rem)", color: color as string, margin: "0 0 8px" }}>{value}</p>
                <p style={{ fontFamily: mono, fontSize: "1rem", letterSpacing: "0.2em", color: C.muted, margin: 0 }}>{label}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ───────────────── LORE ───────────────── */}
      <Section tone="crypt">
        <div style={{ display: "grid", gap: "clamp(28px,5vw,56px)", gridTemplateColumns: "1fr", alignItems: "center" }} className="uo-split">
          <Reveal>
            <Kicker>Rise of the Undead</Kicker>
            <Heading size="lg">Deep beneath the chain, the forgotten began to move.</Heading>
            <div style={{ fontFamily: body, fontSize: "1.04rem", color: C.muted, lineHeight: 1.85 }}>
              <p style={{ marginTop: 0 }}>
                The <strong style={{ color: C.bone }}>Catacombs of Consensus</strong> is where abandoned transactions,
                forgotten satoshis and lost digital fragments have gathered since Bitcoin's earliest days.
                For years, it remained silent.
              </p>
              <p>
                Then came the <strong style={{ color: C.ice }}>Sat Mortis</strong> — a mysterious awakening that
                stirred the fragments of Bitcoin's history. From the depths emerged {PROJECT.supply.toLocaleString()} Undead
                Ordinals, each carrying the scars of the digital afterlife.
              </p>
              <p style={{ color: C.bone, fontFamily: mono, fontSize: "1.25rem", letterSpacing: "0.04em" }}>
                They were not created to disappear. They were resurrected to explore, evolve and conquer the chain.
              </p>
            </div>
            <div style={{ marginTop: 26 }}>
              <Link href="/catacombs"><Btn tone="ghost" color={C.ice}>Enter the lore</Btn></Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ position: "relative" }}>
              <img src={ASSET.berserker} alt="A Coronal Berserker" style={{
                width: "100%", maxWidth: 440, margin: "0 auto", display: "block",
                border: `3px solid ${C.tombUp}`, boxShadow: `0 0 60px ${C.ember}33, inset 0 0 30px #000`,
              }} />
              <div style={{ position: "absolute", bottom: 12, left: 12 }}>
                <Pill color={C.ember}>Coronal Berserker</Pill>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ───────────────── FACTIONS PREVIEW ───────────────── */}
      <Section tone="void">
        <Reveal style={{ textAlign: "center", marginBottom: 44 }}>
          <Kicker color={C.volt}><span style={{ marginInline: "auto" }}>The Four Factions</span></Kicker>
          <Heading size="lg">Four ways to come back wrong.</Heading>
        </Reveal>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
          {FACTIONS.map((f, i) => (
            <Reveal key={f.id} delay={i * 0.07}>
              <Link href="/collection">
                <div style={{ position: "relative", overflow: "hidden", border: `2px solid ${C.tomb}`, background: C.crypt, cursor: "pointer", transition: "border-color .2s, transform .2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.tomb; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div style={{ aspectRatio: "1", overflow: "hidden", borderBottom: `2px solid ${C.tomb}` }}>
                    <img src={f.image} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.05)" }} />
                  </div>
                  <div style={{ padding: "14px 15px 17px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 9, height: 9, background: f.color, boxShadow: `0 0 10px ${f.color}` }} />
                      <p style={{ fontFamily: display, fontSize: "0.56rem", color: C.bone, margin: 0, lineHeight: 1.5 }}>{f.name}</p>
                    </div>
                    <p style={{ fontFamily: mono, fontSize: "1.02rem", color: f.color, margin: 0, letterSpacing: "0.04em" }}>{f.identity}</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ───────────────── TRUST MODEL ───────────────── */}
      <Section tone="crypt">
        <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
          <Kicker color={C.gold}><span style={{ marginInline: "auto" }}>No Smoke, No Mirrors</span></Kicker>
          <Heading size="lg">We tell you exactly what lives where.</Heading>
          <p style={{ fontFamily: body, color: C.muted, maxWidth: "62ch", margin: "0 auto", lineHeight: 1.75 }}>
            Bitcoin secures ownership and token balances. It does not run game logic. Here's the honest boundary —
            nothing is called audited, trustless or exploit-proof until a completed review supports it.
          </p>
        </Reveal>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
          {TRUST.map((t, i) => (
            <Reveal key={t.component} delay={i * 0.05}>
              <Panel color={C.tomb} pad={18} style={{ height: "100%" }}>
                <p style={{ fontFamily: mono, fontSize: "1.15rem", color: C.ice, letterSpacing: "0.04em", margin: "0 0 4px" }}>{t.component}</p>
                <p style={{ fontFamily: mono, fontSize: "0.98rem", color: C.gold, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px" }}>{t.where}</p>
                <p style={{ fontFamily: body, fontSize: "0.92rem", color: C.muted, margin: 0, lineHeight: 1.6 }}>{t.trust}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ───────────────── ROADMAP ───────────────── */}
      <Section tone="void">
        <Reveal style={{ textAlign: "center", marginBottom: 44 }}>
          <Kicker><span style={{ marginInline: "auto" }}>The Path Back</span></Kicker>
          <Heading size="lg">Five phases. Core loop first.</Heading>
        </Reveal>
        <div style={{ position: "relative" }}>
          {ROADMAP.map((p, i) => (
            <Reveal key={p.numeral} delay={i * 0.05}>
              <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ flexShrink: 0, width: 56, textAlign: "center" }}>
                  <div style={{ fontFamily: display, fontSize: "0.9rem", color: C.ice, border: `2px solid ${C.tombUp}`, padding: "12px 0", background: C.crypt, boxShadow: `0 0 18px ${C.ice}22` }}>{p.numeral}</div>
                  {i < ROADMAP.length - 1 && <div style={{ width: 2, height: 22, background: C.tombUp, margin: "0 auto" }} />}
                </div>
                <Panel color={C.tomb} pad={18} style={{ flex: 1, marginBottom: 14 }}>
                  <p style={{ fontFamily: display, fontSize: "0.72rem", color: C.bone, margin: "0 0 12px", letterSpacing: "0.03em" }}>
                    Phase {p.numeral}: {p.title}
                  </p>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 7 }}>
                    {p.points.map((pt) => (
                      <li key={pt} style={{ fontFamily: body, fontSize: "0.94rem", color: C.muted, display: "flex", gap: 9, lineHeight: 1.5 }}>
                        <span style={{ color: C.ice, flexShrink: 0 }}>▸</span>{pt}
                      </li>
                    ))}
                  </ul>
                </Panel>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ───────────────── CTA BAND ───────────────── */}
      <section style={{ position: "relative", overflow: "hidden", background: C.crypt, borderTop: `2px solid ${C.tomb}`, borderBottom: `2px solid ${C.tomb}` }}>
        <AshField density={20} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 820, margin: "0 auto", padding: "clamp(56px,9vw,100px) clamp(18px,5vw,40px)", textAlign: "center" }}>
          <Reveal>
            <GlitchText size="clamp(1.4rem,5vw,2.6rem)">NO SECOND DEATH</GlitchText>
            <p style={{ fontFamily: body, fontSize: "1.05rem", color: C.muted, margin: "20px auto 30px", maxWidth: "52ch", lineHeight: 1.75 }}>
              The collection is the beginning. The world around it is what we build. Prove your holdings,
              claim your place, and rise with the horde.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={banner.to}><Btn color={C.ember}>{banner.cta}</Btn></Link>
              <Link href="/whitepaper"><Btn tone="ghost" color={C.bone}>Read the whitepaper</Btn></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        @media (min-width: 820px) {
          .uo-split { grid-template-columns: 1.1fr 0.9fr !important; }
        }
      `}</style>
    </>
  );
}
