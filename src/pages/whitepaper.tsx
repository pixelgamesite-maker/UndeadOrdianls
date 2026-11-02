import { useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  Section, SectionHead, Plate, Btn, Wordmark, Reveal, Tag, Sigil, Corners,
  C, display, serif,
} from "@/components/ui";
import { PROJECT, X_URL } from "@/lib/theme";
import { FAQ, TRUST } from "@/lib/lore";

const PRINCIPLES: [string, string][] = [
  ["Bitcoin-native assets", "The collection and $GRAVE are built on Bitcoin infrastructure."],
  ["You keep your Undead", "No deposits, no custody, no staking contract holding your inscription."],
  ["Published rules", "Fees, odds, modifiers, cooldowns and caps are public and versioned."],
  ["Progression without rewriting history", "Evolution changes the companion layer, never the inscription."],
  ["Budgeted economics", "Rewards are capped and modelled. Nothing is a guaranteed return."],
  ["Core loop first", "We ship and test expeditions before expanding."],
];

function Accordion({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ position: "relative", border: `1px solid ${open ? C.ember : C.stoneUp}`, background: C.stone, transition: "border-color .2s" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, background: "transparent", border: "none", cursor: "pointer", padding: "18px clamp(16px,3vw,22px)", textAlign: "left" }}>
        <span style={{ fontFamily: display, fontSize: "0.8rem", color: open ? C.ember : C.boneHi, lineHeight: 1.4 }}>{q}</span>
        <span style={{ fontFamily: display, fontSize: "0.9rem", color: open ? C.ember : C.muted, flexShrink: 0 }}>{open ? "–" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
            <p style={{ fontFamily: serif, fontSize: "1.04rem", color: C.muted, lineHeight: 1.8, margin: 0, padding: "0 clamp(16px,3vw,22px) 20px" }}>{a}</p>
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
      <section style={{ padding: "clamp(56px,9vw,100px) clamp(18px,5vw,44px) clamp(24px,5vw,40px)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "inline-flex", marginBottom: 18 }}><Tag>Official whitepaper</Tag></div>
            <Wordmark size="clamp(1.8rem,6.5vw,3.4rem)" style={{ display: "block" }}>THE RECORD</Wordmark>
            <p className="standfirst" style={{ fontFamily: serif, fontSize: "clamp(1.1rem,2.6vw,1.4rem)", color: C.muted, maxWidth: "58ch", margin: "22px 0 0", lineHeight: 1.6 }}>
              Every rule that matters — fees, odds, emissions, vesting — written down, with a plain line between what runs
              on Bitcoin and what runs on our servers.
            </p>
          </Reveal>
        </div>
      </section>

      <Section tone="slab" style={{ paddingTop: "clamp(30px,5vw,56px)" }}>
        <Reveal>
          <Plate corners={C.ember} pad={30}>
            <div style={{ display: "inline-flex", marginBottom: 16 }}><Tag color={C.ember}>Executive summary</Tag></div>
            <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1.3rem", color: C.boneHi, lineHeight: 1.5, margin: "0 0 16px" }}>
              Bitcoin was built to last forever. So were we.
            </p>
            <p style={{ fontFamily: serif, fontSize: "1.06rem", color: C.muted, lineHeight: 1.85, margin: 0 }}>
              Undead Ordinals is a collection of {PROJECT.supply.toLocaleString()} undead artifacts inscribed on Bitcoin,
              and the foundation of a Bitcoin-native gaming ecosystem. Holders send their Undead into the Catacombs of
              Consensus, earn materials and rewards, evolve their characters, and take part in an economy powered by the
              {" "}{PROJECT.token} Rune. Three ideas drive it: permanence, play, and clarity — the artwork lives on Bitcoin
              and never changes, the game gives holders reasons to return after the mint, and every rule that matters is
              written down.
            </p>
          </Plate>
        </Reveal>
      </Section>

      <Section tone="ash">
        <SectionHead designation="Principles" title="Six commitments we hold ourselves to." color={C.rune} />
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))" }}>
          {PRINCIPLES.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.04}>
              <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.stone, padding: 20, height: "100%" }}>
                <Corners color={C.rune} />
                <p style={{ fontFamily: display, fontSize: "0.78rem", color: C.boneHi, margin: "0 0 9px", lineHeight: 1.4 }}>{t}</p>
                <p style={{ fontFamily: serif, fontSize: "1rem", color: C.muted, lineHeight: 1.6, margin: 0 }}>{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="slab">
        <SectionHead designation="Trust model" title="What you are actually trusting." color={C.ember} />
        <Reveal>
          <div style={{ position: "relative", border: `1px solid ${C.stoneUp}` }}>
            <Corners color={C.rune} />
            {TRUST.map((t, i) => (
              <div key={t.component} className="uo-ledger-row" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 5, padding: "16px clamp(16px,3vw,24px)", background: i % 2 ? C.slab : "transparent", borderTop: i ? `1px solid ${C.lineLo}` : "none" }}>
                <span style={{ fontFamily: display, fontSize: "0.78rem", color: C.boneHi }}>{t.component}</span>
                <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.98rem", color: C.ember }}>{t.where}</span>
                <span style={{ fontFamily: serif, fontSize: "0.98rem", color: C.muted, lineHeight: 1.55 }}>{t.trust}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section tone="ash">
        <SectionHead designation="Questions" title="The ones that actually matter." color={C.rune} />
        <div style={{ display: "grid", gap: 10, maxWidth: 780 }}>
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.03}>
              <Accordion q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            </Reveal>
          ))}
        </div>
      </Section>

      <section style={{ background: C.slab, borderTop: `1px solid ${C.stoneUp}`, padding: "clamp(56px,9vw,100px) clamp(18px,5vw,44px)", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}><Sigil size={54} color={C.ember} /></div>
            <Wordmark size="clamp(1.3rem,4.6vw,2.3rem)">OUTLIVE THE CYCLE</Wordmark>
            <p style={{ fontFamily: serif, fontSize: "1.08rem", color: C.muted, margin: "20px auto 30px", maxWidth: "48ch", lineHeight: 1.75 }}>
              Born from forgotten blocks, resurrected on Bitcoin. {PROJECT.supply.toLocaleString()} undead, and no second death.
            </p>
            <div style={{ display: "flex", gap: 13, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/verify"><Btn>Verify holdings</Btn></Link>
              <Btn href={X_URL} tone="bone">Follow on X</Btn>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`@media (min-width: 720px) { .uo-ledger-row { grid-template-columns: 1.1fr 1fr 1.6fr !important; gap: 20px !important; align-items: center; } }`}</style>
    </>
  );
}
