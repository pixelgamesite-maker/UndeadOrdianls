import { Link } from "wouter";
import { motion } from "framer-motion";
import { Btn, Wordmark, Sigil, Cobweb, Spider, Corners, Seq, C, display, serif, black } from "@/components/ui";
import { PROJECT, WHITELIST_LIVE, X_URL, X_HANDLE, ASSET } from "@/lib/theme";
import { hasSupabase } from "@/lib/supabase";
import { FACTIONS } from "@/lib/lore";

const liveReg = WHITELIST_LIVE && hasSupabase();

const LOOP: [string, string, string][] = [
  ["Register", "Join the whitelist and carve your name into the gate.", "/whitelist"],
  ["Mint", "Claim your Undead, inscribed on Bitcoin forever.", "/collection"],
  ["Raid", "Send it into the Catacombs for $GRAVE and relics.", "/crypts"],
];

const TRUST: [string, string][] = [
  ["On Bitcoin, forever", "The artwork is inscribed on-chain and never changes."],
  ["No wallet connect", "Prove holdings by address. You never sign a thing."],
  ["Never burned", "Evolution upgrades your Undead, never destroys it."],
  ["Open rules", "Fees, odds and caps are all published up front."],
];

function Status() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: display, fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", color: liveReg ? C.ember : C.rune }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: liveReg ? C.ember : C.rune, boxShadow: `0 0 10px ${liveReg ? C.ember : C.rune}`, animation: "flick 2.2s infinite" }} />
      {liveReg ? "Whitelist registration is live" : "Whitelist opens soon"}
    </span>
  );
}

export default function Home() {
  // ONE primary CTA. When registration is live it points at the whitelist;
  // otherwise the primary action is to follow X so nobody misses the open.
  const primary = liveReg
    ? { label: "Join the whitelist", to: "/whitelist", ext: false }
    : { label: `Follow ${X_HANDLE}`, to: X_URL, ext: true };

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section style={{ position: "relative", minHeight: "82vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden", padding: "clamp(40px,7vw,76px) clamp(18px,5vw,44px)" }}>
        <Cobweb corner="tl" size={160} opacity={0.13} />
        <Cobweb corner="tr" size={140} opacity={0.1} />
        <div style={{ position: "absolute", top: 0, right: "9%" }}><Spider drop={120} /></div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ position: "relative", zIndex: 1, maxWidth: 820 }}>
          <div style={{ marginBottom: 20 }}><Status /></div>
          <Wordmark size="clamp(3rem,13vw,7rem)" style={{ display: "block" }}>Undead</Wordmark>
          <Wordmark size="clamp(3rem,13vw,7rem)" style={{ display: "block", marginTop: -6 }}>Ordinals</Wordmark>

          <p style={{ fontFamily: serif, fontSize: "clamp(1.15rem,2.8vw,1.45rem)", color: C.bone, margin: "22px auto 0", maxWidth: "40ch", lineHeight: 1.5, textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>
            {PROJECT.supply.toLocaleString()} undead artifacts inscribed on Bitcoin, and a game to raid with them.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", alignItems: "center", margin: "32px 0 0" }}>
            {primary.ext
              ? <Btn href={primary.to}>{primary.label}</Btn>
              : <Link href={primary.to}><Btn>{primary.label}</Btn></Link>}
            {primary.ext
              ? <Link href="/collection"><Btn tone="bone">View the collection</Btn></Link>
              : <Btn href={X_URL} tone="bone">{`Follow ${X_HANDLE}`}</Btn>}
          </div>
        </motion.div>
      </section>

      {/* ───────── SPECIMEN SHOWCASE ───────── */}
      <section style={{ position: "relative", background: "rgba(11,9,16,0.84)", borderTop: `1px solid ${C.stoneUp}`, padding: "clamp(50px,8vw,90px) clamp(18px,5vw,44px)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(28px,4vw,44px)" }}>
            <h2 style={{ fontFamily: black, fontSize: "clamp(2rem,6vw,3.2rem)", color: C.boneHi, margin: 0, lineHeight: 1.05 }}>Meet the Undead</h2>
            <p style={{ fontFamily: serif, fontSize: "1.1rem", color: C.muted, margin: "14px auto 0", maxWidth: "46ch", lineHeight: 1.5 }}>
              Four factions rose from the Catacombs of Consensus. Each wears its curse differently.
            </p>
          </div>
          <div className="uo-spec" style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(2,1fr)" }}>
            {FACTIONS.map((f) => (
              <div key={f.id}>
                <Link href="/collection">
                  <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.stone, cursor: "pointer", transition: "border-color .22s, transform .22s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.stoneUp; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <Corners color={f.color} />
                    <div style={{ aspectRatio: "1", overflow: "hidden", borderBottom: `1px solid ${C.stoneUp}` }}>
                      <img src={f.image} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "14px 15px 16px" }}>
                      <p style={{ fontFamily: display, fontWeight: 600, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.03em", color: C.boneHi, margin: "0 0 6px", lineHeight: 1.35 }}>{f.name}</p>
                      <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.98rem", color: f.color, margin: 0 }}>{f.identity}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/collection"><Btn tone="ghost" color={C.rune}>See all four factions</Btn></Link>
          </div>
        </div>
      </section>

      {/* ───────── 3-STEP LOOP ───────── */}
      <section style={{ position: "relative", padding: "clamp(50px,8vw,90px) clamp(18px,5vw,44px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontFamily: black, fontSize: "clamp(2rem,6vw,3.2rem)", color: C.boneHi, textAlign: "center", margin: "0 0 clamp(28px,4vw,44px)", lineHeight: 1.05 }}>How it works</h2>
          <div className="uo-loop" style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr" }}>
            {LOOP.map(([title, desc, to], i) => (
              <div key={title}>
                <Link href={to}>
                  <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: "rgba(25,21,33,0.86)", padding: "26px 22px", height: "100%", cursor: "pointer", transition: "border-color .2s, transform .2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.ember; e.currentTarget.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.stoneUp; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <Corners color={C.rune} />
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <span style={{ fontFamily: black, fontSize: "2rem", color: C.ember, lineHeight: 1 }}>{i + 1}</span>
                      <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.05em", color: C.boneHi, margin: 0 }}>{title}</h3>
                    </div>
                    <p style={{ fontFamily: serif, fontSize: "1.04rem", color: C.muted, lineHeight: 1.6, margin: 0 }}>{desc}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── TRUST STRIP ───────── */}
      <section style={{ position: "relative", background: "rgba(11,9,16,0.84)", borderTop: `1px solid ${C.stoneUp}`, borderBottom: `1px solid ${C.stoneUp}`, padding: "clamp(44px,7vw,72px) clamp(18px,5vw,44px)" }}>
        <div className="uo-trust" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 14, gridTemplateColumns: "repeat(2,1fr)" }}>
          {TRUST.map(([title, desc]) => (
            <div key={title} style={{ display: "flex", gap: 12 }}>
              <span style={{ color: C.ember, fontFamily: display, fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.3, flexShrink: 0 }}>✦</span>
              <div>
                <p style={{ fontFamily: display, fontWeight: 600, fontSize: "0.92rem", textTransform: "uppercase", letterSpacing: "0.03em", color: C.boneHi, margin: "0 0 5px" }}>{title}</p>
                <p style={{ fontFamily: serif, fontSize: "0.98rem", color: C.muted, lineHeight: 1.55, margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── FINAL CTA ───────── */}
      <section style={{ position: "relative", padding: "clamp(60px,9vw,110px) clamp(18px,5vw,44px)", textAlign: "center", overflow: "hidden" }}>
        <Cobweb corner="tr" size={140} opacity={0.08} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}><Sigil size={54} color={C.ember} /></div>
          <h2 style={{ fontFamily: black, fontSize: "clamp(1.9rem,6vw,3rem)", color: C.boneHi, margin: 0, lineHeight: 1.05 }}>No second death</h2>
          <p style={{ fontFamily: serif, fontSize: "1.1rem", color: C.muted, margin: "18px auto 28px", maxWidth: "42ch", lineHeight: 1.6 }}>
            {liveReg ? "Registration is open. Carve your name into the gate before the mint." : "The gate opens soon. Follow along so you don't miss it."}
          </p>
          <div style={{ display: "flex", gap: 13, justifyContent: "center", flexWrap: "wrap" }}>
            {primary.ext
              ? <Btn href={primary.to}>{primary.label}</Btn>
              : <Link href={primary.to}><Btn>{primary.label}</Btn></Link>}
            <Link href="/whitepaper"><Btn tone="bone">Read the codex</Btn></Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 720px) { .uo-trust { grid-template-columns: repeat(4,1fr) !important; } }
        @media (min-width: 760px) { .uo-spec { grid-template-columns: repeat(4,1fr) !important; } .uo-loop { grid-template-columns: repeat(3,1fr) !important; } }
      `}</style>
    </>
  );
}
