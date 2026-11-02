import { useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  Section, Kicker, Heading, Btn, Panel, Reveal, GlitchText, notch,
  C, display, body, mono,
} from "@/components/ui";
import { AshField } from "@/components/Effects";
import { PROJECT, X_URL } from "@/lib/theme";
import { FAQ, TRUST } from "@/lib/lore";

const PRINCIPLES = [
  ["Bitcoin-native assets", "The collection and $GRAVE are built on Bitcoin infrastructure."],
  ["You keep your Undead", "No deposits, no custody, no staking contracts holding your inscription."],
  ["Published rules", "Fees, odds, modifiers, cooldowns and caps are public and versioned."],
  ["Progression without rewriting history", "Evolution changes the companion layer, never the inscription."],
  ["Budgeted economics", "Rewards are capped and modeled. Nothing is a guaranteed return."],
  ["Core loop first", "We ship and test expeditions before expanding."],
];

function Accordion({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ border: `2px solid ${open ? C.btc : C.tomb}`, background: C.crypt, transition: "border-color .2s" }}>
      <button onClick={onToggle} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14,
        background: "transparent", border: "none", cursor: "pointer", padding: "17px 18px", textAlign: "left",
      }}>
        <span style={{ fontFamily: mono, fontSize: "1.2rem", color: open ? C.btc : C.bone, letterSpacing: "0.03em" }}>{q}</span>
        <span style={{ fontFamily: display, fontSize: "0.7rem", color: open ? C.btc : C.muted, flexShrink: 0 }}>{open ? "–" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
            <p style={{ fontFamily: body, fontSize: "0.98rem", color: C.muted, lineHeight: 1.8, margin: 0, padding: "0 18px 18px" }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Whitepaper() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      {/* header */}
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(70px,11vw,120px) clamp(18px,5vw,40px) clamp(40px,7vw,60px)", textAlign: "center" }}>
        <AshField density={20} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 820, margin: "0 auto" }}>
          <Kicker><span style={{ marginInline: "auto" }}>Official Whitepaper</span></Kicker>
          <GlitchText size="clamp(1.5rem,6vw,3rem)">THE RECORD</GlitchText>
          <p style={{ fontFamily: body, fontSize: "clamp(0.98rem,2.4vw,1.1rem)", color: C.muted, maxWidth: "58ch", margin: "22px auto 0", lineHeight: 1.8 }}>
            Every rule that matters — fees, odds, emissions, vesting — written down. We say plainly which parts run
            on Bitcoin and which run on our servers. Items in [brackets] are placeholders only the team can confirm.
          </p>
        </div>
      </section>

      {/* executive summary */}
      <Section tone="crypt" style={{ paddingTop: 0 }}>
        <Reveal>
          <Panel color={C.tombUp} glow={C.btc}>
            <Kicker color={C.btc}>Executive Summary</Kicker>
            <p style={{ fontFamily: body, fontSize: "1.05rem", color: C.bone, lineHeight: 1.85, margin: "0 0 14px" }}>
              Bitcoin was built to last forever. So were we.
            </p>
            <p style={{ fontFamily: body, fontSize: "1.0rem", color: C.muted, lineHeight: 1.85, margin: 0 }}>
              Undead Ordinals is a collection of <strong style={{ color: C.bone }}>{PROJECT.supply.toLocaleString()} undead
              artifacts inscribed on Bitcoin</strong>, and the foundation of a Bitcoin-native gaming ecosystem. Holders
              send their Undead into the Catacombs of Consensus, earn materials and rewards, evolve their characters,
              and take part in an economy powered by the {PROJECT.token} Rune. Three ideas drive the project:
              <strong style={{ color: C.btc }}> permanence</strong> (the artwork lives on Bitcoin and never changes),
              <strong style={{ color: C.volt }}> play</strong> (reasons to return after the mint), and
              <strong style={{ color: C.gold }}> clarity</strong> (every rule is written down).
            </p>
          </Panel>
        </Reveal>
      </Section>

      {/* principles */}
      <Section tone="void">
        <Reveal style={{ marginBottom: 30 }}>
          <Kicker color={C.volt}>Principles</Kicker>
          <Heading size="md">Six commitments we hold ourselves to.</Heading>
        </Reveal>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))" }}>
          {PRINCIPLES.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.05}>
              <Panel color={C.tomb} pad={18} style={{ height: "100%" }}>
                <p style={{ fontFamily: mono, fontSize: "1.2rem", color: C.btc, letterSpacing: "0.03em", margin: "0 0 7px" }}>{t}</p>
                <p style={{ fontFamily: body, fontSize: "0.94rem", color: C.muted, lineHeight: 1.6, margin: 0 }}>{d}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* trust table */}
      <Section tone="crypt">
        <Reveal style={{ marginBottom: 24 }}>
          <Kicker color={C.gold}>Trust Model at a Glance</Kicker>
          <Heading size="md">What you are actually trusting.</Heading>
        </Reveal>
        <Reveal>
          <div style={{ border: `2px solid ${C.tomb}`, overflow: "hidden" }}>
            {TRUST.map((t, i) => (
              <div key={t.component} className="uo-trow" style={{
                display: "grid", gridTemplateColumns: "1fr", gap: 4,
                padding: "14px 16px", background: i % 2 ? C.void : C.crypt,
                borderTop: i ? `1px solid ${C.line}` : "none",
              }}>
                <span style={{ fontFamily: mono, fontSize: "1.1rem", color: C.bone, letterSpacing: "0.03em" }}>{t.component}</span>
                <span style={{ fontFamily: mono, fontSize: "0.98rem", color: C.btc, letterSpacing: "0.06em", textTransform: "uppercase" }}>{t.where}</span>
                <span style={{ fontFamily: body, fontSize: "0.92rem", color: C.muted, lineHeight: 1.5 }}>{t.trust}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section tone="void">
        <Reveal style={{ marginBottom: 24 }}>
          <Kicker color={C.btc}>FAQ</Kicker>
          <Heading size="md">The questions that actually matter.</Heading>
        </Reveal>
        <div style={{ display: "grid", gap: 10, maxWidth: 760 }}>
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <Accordion q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* closing */}
      <Section tone="crypt" style={{ textAlign: "center" }}>
        <Reveal>
          <GlitchText size="clamp(1.2rem,4.5vw,2.2rem)">BUILT TO OUTLIVE THE CYCLE</GlitchText>
          <p style={{ fontFamily: body, fontSize: "1rem", color: C.muted, margin: "18px auto 28px", maxWidth: "52ch", lineHeight: 1.75 }}>
            Born from forgotten blocks. Resurrected on Bitcoin. {PROJECT.supply.toLocaleString()} Undead. No Second Death.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/verify"><Btn color={C.btc}>Verify & Claim</Btn></Link>
            <Btn href={X_URL} tone="ghost" color={C.bone}>Follow on X</Btn>
          </div>
        </Reveal>
      </Section>

      <style>{`
        @media (min-width: 720px) {
          .uo-trow { grid-template-columns: 1fr 1fr 1.4fr !important; align-items: center; }
        }
      `}</style>
    </>
  );
}
