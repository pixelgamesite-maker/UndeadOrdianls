import { Link } from "wouter";
import { motion } from "framer-motion";
import { Btn, Wordmark, Cobweb, Spider, Corners, C, display, serif, black } from "@/components/ui";
import { PROJECT } from "@/lib/theme";

const RECORD: [string, string][] = [
  ["Supply", PROJECT.supply.toLocaleString()],
  ["Chain", "Bitcoin"],
  ["Rune", PROJECT.token],
  ["Factions", "Four"],
];

const PATHS: [string, string, string][] = [
  ["The Undead", "/collection", "Meet the four factions risen from the chain."],
  ["The Catacombs", "/crypts", "Four crypts below. One door is unsealing."],
  ["The Codex", "/whitepaper", "The lore, the rules, and what lives where."],
];

export default function Home() {
  return (
    <>
      {/* ───────── HERO — title over the fixed video ───────── */}
      <section style={{ position: "relative", minHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden", padding: "clamp(40px,7vw,80px) clamp(18px,5vw,44px)" }}>
        <Cobweb corner="tl" size={170} opacity={0.14} />
        <Cobweb corner="tr" size={150} opacity={0.11} />
        <div style={{ position: "absolute", top: 0, right: "9%" }}><Spider drop={130} /></div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "relative", zIndex: 1, maxWidth: 820 }}>
          <p style={{ fontFamily: display, fontWeight: 600, fontSize: "0.82rem", color: C.ember, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 20px", textShadow: "0 2px 12px #000" }}>
            {PROJECT.supply.toLocaleString()} undead inscribed on Bitcoin
          </p>
          <Wordmark size="clamp(3rem,13vw,7rem)" style={{ display: "block" }}>Undead</Wordmark>
          <Wordmark size="clamp(3rem,13vw,7rem)" style={{ display: "block", marginTop: -6 }}>Ordinals</Wordmark>

          <p style={{ fontFamily: serif, fontSize: "clamp(1.15rem,3vw,1.5rem)", color: C.bone, margin: "24px auto 0", maxWidth: "30ch", lineHeight: 1.5, textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>
            {PROJECT.tagline}
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", margin: "34px 0 0" }}>
            <Link href="/whitelist"><Btn>Register your Undead</Btn></Link>
            <Link href="/crypts"><Btn tone="bone">Enter the Catacombs</Btn></Link>
          </div>

          <p style={{ fontFamily: display, fontWeight: 600, fontSize: "0.72rem", color: C.faint, letterSpacing: "0.2em", textTransform: "uppercase", margin: "44px 0 0", animation: "blink 2.4s infinite" }}>
            ▼ descend
          </p>
        </motion.div>
      </section>

      {/* ───────── CATALOGUE STRIP ───────── */}
      <div style={{ borderTop: `1px solid ${C.stoneUp}`, borderBottom: `1px solid ${C.stoneUp}`, background: "rgba(11,9,16,0.84)" }}>
        <div className="uo-record" style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2,1fr)" }}>
          {RECORD.map(([label, value], i) => (
            <div key={label} style={{ padding: "20px clamp(18px,4vw,30px)", textAlign: "center", borderLeft: i % 2 ? `1px solid ${C.lineLo}` : "none", borderTop: i >= 2 ? `1px solid ${C.lineLo}` : "none" }}>
              <p style={{ fontFamily: display, fontSize: "clamp(1.2rem,3vw,1.8rem)", fontWeight: 700, color: i === 0 ? C.ember : C.boneHi, margin: "0 0 4px" }}>{value}</p>
              <p style={{ fontFamily: display, fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ───────── CHOOSE YOUR PATH ───────── */}
      <section style={{ position: "relative", padding: "clamp(56px,9vw,100px) clamp(18px,5vw,44px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ fontFamily: black, fontSize: "clamp(1.8rem,5vw,2.8rem)", color: C.boneHi, textAlign: "center", margin: "0 0 clamp(28px,4vw,44px)", lineHeight: 1.1 }}>Choose your path</h2>
          <div className="uo-paths" style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr" }}>
            {PATHS.map(([title, to, desc], i) => (
              <motion.div key={to} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.07 }}>
                <Link href={to}>
                  <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: "rgba(25,21,33,0.86)", padding: "26px 24px 24px", height: "100%", cursor: "pointer", transition: "border-color .2s, transform .2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.ember; e.currentTarget.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.stoneUp; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <Corners color={C.rune} />
                    <h3 style={{ fontFamily: black, fontSize: "1.7rem", color: C.boneHi, margin: "0 0 10px", lineHeight: 1.1 }}>{title}</h3>
                    <p style={{ fontFamily: serif, fontSize: "1.02rem", color: C.muted, lineHeight: 1.6, margin: "0 0 16px" }}>{desc}</p>
                    <span style={{ fontFamily: display, fontWeight: 600, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", color: C.ember }}>Enter ▸</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 640px) { .uo-record { grid-template-columns: repeat(4,1fr) !important; } .uo-record > div:not(:first-child) { border-left: 1px solid ${C.lineLo} !important; border-top: none !important; } }
        @media (min-width: 820px) { .uo-paths { grid-template-columns: repeat(3,1fr) !important; } }
      `}</style>
    </>
  );
}
