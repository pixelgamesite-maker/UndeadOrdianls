import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Section, SectionHead, Btn, Sigil, Corners, Tag, C, display, serif, black } from "@/components/ui";
import { TIER_IMG } from "@/lib/theme";
import { TIERS } from "@/lib/lore";

function LockGlyph({ color = C.faint, size = 26 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="10" width="14" height="10" fill={color} />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke={color} strokeWidth="2" fill="none" />
      <rect x="11" y="13" width="2" height="4" fill={C.ash} />
    </svg>
  );
}

export default function Crypts() {
  const [locked, setLocked] = useState(false);

  return (
    <>
      <section style={{ padding: "clamp(52px,8vw,90px) clamp(18px,5vw,40px) clamp(20px,4vw,34px)", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Sigil size={54} color={C.ember} /></div>
          <h1 style={{ fontFamily: black, fontSize: "clamp(2.2rem,7vw,3.8rem)", color: C.boneHi, margin: 0, lineHeight: 1.05 }}>The Catacombs of Consensus</h1>
          <p style={{ fontFamily: serif, fontSize: "clamp(1.05rem,2.4vw,1.3rem)", color: C.muted, margin: "18px auto 0", maxWidth: "50ch", lineHeight: 1.6 }}>
            Four ways to disappoint yourself. Send an Undead in, pay the $GRAVE fee, and let the published rules and future
            Bitcoin blocks decide. One door is unsealing. The rest hold until their season.
          </p>
        </div>
      </section>

      <Section tone="slab" style={{ paddingTop: "clamp(20px,4vw,40px)" }}>
        <div className="uo-stages" style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
          {TIERS.map((t, i) => {
            const unlocked = i === 0; // only the Forgotten Crypt is selectable
            return (
              <div key={t.name} style={{ position: "relative", border: `1px solid ${unlocked ? C.ember : C.stoneUp}`, background: C.stone, overflow: "hidden", transition: "transform .2s, border-color .2s", filter: unlocked ? "none" : "grayscale(0.6)" }}
                onMouseEnter={unlocked ? (e) => { e.currentTarget.style.transform = "translateY(-4px)"; } : undefined}
                onMouseLeave={unlocked ? (e) => { e.currentTarget.style.transform = "translateY(0)"; } : undefined}>
                <Corners color={unlocked ? C.ember : C.faint} />
                <div style={{ position: "relative", height: 180, backgroundImage: `url(${TIER_IMG[i]})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                  <div style={{ position: "absolute", inset: 0, background: unlocked
                    ? "linear-gradient(to top, rgba(11,9,16,0.92), rgba(11,9,16,0.05) 55%, transparent)"
                    : "linear-gradient(to top, rgba(11,9,16,0.95), rgba(8,6,12,0.75))" }} />
                  <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Tag color={unlocked ? C.ember : C.faint}>Stage {String(i + 1).padStart(2, "0")}</Tag>
                    {!unlocked && <LockGlyph />}
                  </div>
                  {!unlocked && (
                    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                      <span style={{ fontFamily: display, fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.14em", color: C.faint }}>Sealed</span>
                    </div>
                  )}
                  <p style={{ position: "absolute", bottom: 11, left: 14, right: 14, fontFamily: black, fontSize: "1.3rem", color: unlocked ? C.boneHi : C.muted, margin: 0, lineHeight: 1.1, textShadow: "0 2px 10px #000" }}>{t.name}</p>
                </div>
                <div style={{ padding: "15px 16px 17px" }}>
                  <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.92rem", color: C.muted, margin: "0 0 12px", lineHeight: 1.45, minHeight: "2.6em" }}>{t.blurb}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontFamily: display, fontSize: "0.76rem", color: unlocked ? C.ember : C.faint }}>{t.fee}</span>
                    <span style={{ fontFamily: display, fontWeight: 600, fontSize: "0.78rem", color: unlocked ? C.rune : C.faint }}>relic {t.relic}</span>
                  </div>
                  {unlocked ? (
                    <button onClick={() => setLocked(true)}
                      style={{ width: "100%", fontFamily: display, fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em", color: C.ash, background: C.ember, border: `2px solid ${C.ember}`, padding: "13px", cursor: "pointer", boxShadow: `3px 3px 0 ${C.emberLo}` }}>
                      Enter the crypt
                    </button>
                  ) : (
                    <div style={{ width: "100%", fontFamily: display, fontWeight: 600, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em", color: C.faint, border: `1px solid ${C.stoneUp}`, padding: "13px", textAlign: "center", display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
                      <LockGlyph size={16} /> Locked
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ fontFamily: serif, fontSize: "0.98rem", color: C.faint, textAlign: "center", margin: "28px auto 0", maxWidth: "54ch", lineHeight: 1.6 }}>
          Not on the whitelist yet? <Link href="/whitelist" style={{ color: C.ember }}>Register your Undead</Link> to claim your place before the crypts open.
        </p>
      </Section>

      {/* "currently locked" gate */}
      <AnimatePresence>
        {locked && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLocked(false)}
            style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(8,6,12,0.88)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
            <motion.div initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: "relative", width: "100%", maxWidth: 460, background: "rgba(11,9,16,0.98)", border: `1px solid ${C.ember}`, padding: "32px 26px", textAlign: "center", boxShadow: `0 0 0 4px ${C.ash}, 0 0 50px ${C.ember}33` }}>
              <Corners color={C.ember} size={16} />
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><LockGlyph color={C.ember} size={44} /></div>
              <h3 style={{ fontFamily: black, fontSize: "clamp(1.5rem,5vw,2rem)", color: C.boneHi, margin: "0 0 12px", lineHeight: 1.1 }}>The crypt is currently locked</h3>
              <p style={{ fontFamily: serif, fontSize: "1.04rem", color: C.muted, lineHeight: 1.7, margin: "0 0 22px" }}>
                The Forgotten Crypt opens once the collection mints and the Catacombs go live. Hold your Undead, watch {" "}
                <a href="https://x.com/UndeadOrdinals" target="_blank" rel="noopener noreferrer" style={{ color: C.ember }}>X</a> for the unsealing.
              </p>
              <Btn onClick={() => setLocked(false)}>Back to the gate</Btn>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@media (max-width: 560px) { .uo-stages { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
}
