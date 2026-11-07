import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "wouter";
import {
  Btn, Wordmark, Sigil, Corners, Price, GlowSprite, ScrollCue, Tag,
  Cobweb, Spider, C, display, serif, black,
} from "@/components/ui";
import { PROJECT, WHITELIST_LIVE, X_URL, X_HANDLE } from "@/lib/theme";
import { FACTIONS, STEPS, TIERS } from "@/lib/lore";
import { SHOP_ITEMS, SWORDS, JARS, CAT_GLOW, FEATURED } from "@/lib/shop";

const liveReg = WHITELIST_LIVE;

/* ── scroll position, for the hero scroll-away ── */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const on = () => setY(window.scrollY);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return y;
}

/* ── a section band with varied backgrounds, so the site never reads
   as "one background the whole way down" ── */
type Bg = "black" | "green" | "orange" | "slab";
const BAND_BG: Record<Bg, string> = {
  black:  "linear-gradient(180deg, rgba(5,12,8,0.93), rgba(7,17,11,0.97))",
  green:  "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,224,123,0.10), transparent 60%), rgba(4,11,7,0.96)",
  orange: "radial-gradient(ellipse 80% 60% at 50% 12%, rgba(247,147,26,0.09), transparent 58%), rgba(6,13,9,0.97)",
  slab:   "linear-gradient(180deg, rgba(4,11,7,0.97), rgba(3,9,6,0.98))",
};

function Band({ bg = "black", children, id, style }: { bg?: Bg; children: ReactNode; id?: string; style?: CSSProperties }) {
  return (
    <section id={id} style={{ position: "relative", background: BAND_BG[bg], borderTop: `1px solid ${C.lineLo}`, padding: "clamp(56px,9vw,104px) clamp(18px,5vw,44px)", overflow: "hidden", ...style }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>{children}</div>
    </section>
  );
}

function Eyebrow({ children, color = C.rune }: { children: ReactNode; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
      <span style={{ width: 20, height: 2, background: color }} />
      <span style={{ fontFamily: display, fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color }}>{children}</span>
    </div>
  );
}

function Head({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <h2 style={{ fontFamily: black, fontWeight: 400, color: C.boneHi, fontSize: "clamp(2rem,5.6vw,3.5rem)", lineHeight: 1.08, margin: 0, letterSpacing: "0.01em", ...style }}>{children}</h2>;
}

export default function Home() {
  const y = useScrollY();
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const t = Math.min(1, y / (vh * 0.62));
  const heroStyle: CSSProperties = { opacity: 1 - t, transform: `translateY(${-t * 64}px) scale(${1 - t * 0.04})` };

  const catOf = (slug: string) => SHOP_ITEMS.find((i) => i.slug === slug)!;

  return (
    <>
      {/* ═══════════ HERO — full screen, scrolls away ═══════════ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "90px clamp(18px,5vw,44px) 40px", overflow: "hidden" }}>
        <Cobweb corner="tl" size={168} opacity={0.12} />
        <Cobweb corner="tr" size={150} opacity={0.1} />
        <div style={{ position: "absolute", top: 0, right: "10%" }}><Spider drop={128} /></div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 880, willChange: "transform, opacity", ...heroStyle }}>
          <Eyebrow>Bitcoin is forever. Your sleep schedule isn't.</Eyebrow>
          <Wordmark size="clamp(2.6rem,11vw,6.2rem)" style={{ display: "block" }}>Dead Inside.</Wordmark>
          <Wordmark size="clamp(2.6rem,11vw,6.2rem)" style={{ display: "block", marginTop: -4 }}>Alive on Bitcoin.</Wordmark>

          <p style={{ fontFamily: serif, fontSize: "clamp(1.1rem,2.6vw,1.4rem)", color: C.bone, margin: "24px auto 0", maxWidth: "46ch", lineHeight: 1.6, textShadow: "0 2px 18px rgba(0,0,0,0.95)" }}>
            {PROJECT.supply.toLocaleString()} Undead have crawled out of forgotten blocks. Inscribed forever, sent into the Catacombs, and built to make some terrible financial decisions.
          </p>

          <p style={{ fontFamily: display, fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.rune, margin: "22px 0 0", textShadow: "0 0 14px rgba(0,0,0,0.9)" }}>
            3,232 Inscriptions · One Blockchain · Zero Pulse
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", alignItems: "center", margin: "34px 0 0" }}>
            {liveReg
              ? <Link href="/whitelist"><Btn>Register your Undead</Btn></Link>
              : <Btn href={X_URL}>{`Follow ${X_HANDLE}`}</Btn>}
            <Link href="/crypts"><Btn tone="ghost" color={C.rune}>Enter the Catacombs</Btn></Link>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 26, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: 1 - t * 2.2 }}>
          <ScrollCue />
        </div>
      </section>

      {/* ═══════════ 02 — WHAT THE HELL IS THIS? ═══════════ */}
      <Band bg="black">
        <div className="uo-two" style={{ display: "grid", gap: "clamp(28px,5vw,64px)", gridTemplateColumns: "1fr", alignItems: "center" }}>
          <div>
            <Eyebrow>The introduction</Eyebrow>
            <Head>What the hell is this?</Head>
            <p style={{ fontFamily: serif, fontSize: "1.1rem", color: C.muted, lineHeight: 1.8, margin: "22px 0 0" }}>
              Another NFT collection? Technically, yes. Another collection that vanishes after mint, changes its profile picture, and starts posting partnership announcements? <span style={{ color: C.bone }}>Hopefully not.</span>
            </p>
            <p style={{ fontFamily: serif, fontSize: "1.1rem", color: C.muted, lineHeight: 1.8, margin: "16px 0 0" }}>
              Undead Ordinals is 3,232 digital corpses inscribed permanently on Bitcoin. But we're not here to collect JPEGs and stare at floor prices. We're building a Bitcoin-native gaming ecosystem where your Undead explores, collects, evolves, and fights to survive, powered by the <span style={{ color: C.ember }}>$GRAVE</span> Rune.
            </p>
            <p style={{ fontFamily: black, fontSize: "clamp(1.1rem,3vw,1.5rem)", color: C.boneHi, margin: "24px 0 0", lineHeight: 1.25 }}>
              Your Undead has a life after death. <span style={{ color: C.rune }}>Unlike most NFT roadmaps.</span>
            </p>
          </div>

          <div style={{ position: "relative" }}>
            <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.slab }}>
              <Corners color={C.rune} size={18} />
              <HudScan />
              <img src={FACTIONS[1].image} alt="An Undead specimen" style={{ width: "100%", display: "block", opacity: 0.96 }} />
              <div style={{ position: "absolute", top: 12, left: 12 }}><Tag color={C.rune}>SAT MORTIS · AWAKENED</Tag></div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 14px 12px", background: "linear-gradient(transparent, rgba(4,11,7,0.95))", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <span style={{ fontFamily: display, fontSize: "0.72rem", color: C.bone }}>Specimen UO-0809</span>
                <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.9rem", color: C.ember }}>Coronal Berserker</span>
              </div>
            </div>
          </div>
        </div>
      </Band>

      {/* ═══════════ 04 — PICK YOUR POISON (factions) ═══════════ */}
      <Band bg="green">
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto clamp(32px,5vw,52px)" }}>
          <Eyebrow color={C.rune}>The collection · pick your poison</Eyebrow>
          <Head>3,232 ways to be dead inside.</Head>
          <p style={{ fontFamily: serif, fontSize: "1.08rem", color: C.muted, lineHeight: 1.7, margin: "18px auto 0", maxWidth: "52ch" }}>
            Four factions clawed out of the Catacombs of Consensus. Each one wears its curse differently.
          </p>
        </div>

        <div className="uo-factions" style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(2,1fr)" }}>
          {FACTIONS.map((f, i) => (
            <Link key={f.id} href="/collection">
              <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.stone, cursor: "pointer", height: "100%", transition: "border-color .22s, transform .22s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform = "translateY(-5px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.stoneUp; e.currentTarget.style.transform = "translateY(0)"; }}>
                <Corners color={f.color} />
                <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden", borderBottom: `1px solid ${C.stoneUp}` }}>
                  <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 40%, ${f.color}22, transparent 68%)` }} />
                  <img src={f.image} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: 10, left: 10 }}><Tag color={f.color}>{["I", "II", "III", "IV"][i]}</Tag></div>
                </div>
                <div style={{ padding: "15px 15px 17px" }}>
                  <p style={{ fontFamily: display, fontWeight: 600, fontSize: "0.86rem", textTransform: "uppercase", letterSpacing: "0.03em", color: C.boneHi, margin: "0 0 7px", lineHeight: 1.3 }}>{f.name}</p>
                  <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.98rem", color: f.color, margin: 0, lineHeight: 1.45 }}>{f.identity}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <Link href="/collection"><Btn tone="ghost" color={C.rune}>Meet all four factions</Btn></Link>
        </div>
      </Band>

      {/* ═══════════ 05 — YOUR JPEG HAS A JOB NOW (the game) ═══════════ */}
      <Band bg="orange">
        <div style={{ maxWidth: 680, margin: "0 auto clamp(34px,5vw,54px)", textAlign: "center" }}>
          <Eyebrow color={C.ember}>The game · catacombs of consensus</Eyebrow>
          <Head>Your JPEG has a job now.</Head>
          <p style={{ fontFamily: serif, fontSize: "1.08rem", color: C.muted, lineHeight: 1.7, margin: "18px auto 0", maxWidth: "54ch" }}>
            A risk-and-reward expedition game. Sometimes you find treasure. Sometimes you find nothing. Sometimes your Undead comes back poorer than it left. Sound familiar?
          </p>
        </div>

        <div className="uo-steps" style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr" }}>
          {STEPS.map((s, i) => (
            <div key={s.title} style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: "rgba(14,26,18,0.7)", padding: "20px 20px 22px", height: "100%" }}>
              <Corners color={i % 2 ? C.ember : C.rune} />
              <span style={{ fontFamily: black, fontSize: "2.1rem", color: i % 2 ? C.ember : C.rune, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
              <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: "0.98rem", textTransform: "uppercase", letterSpacing: "0.04em", color: C.boneHi, margin: "10px 0 8px" }}>{s.title}</h3>
              <p style={{ fontFamily: serif, fontSize: "1rem", color: C.muted, lineHeight: 1.6, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>

        {/* four ways to disappoint yourself — the expedition tiers */}
        <p style={{ fontFamily: black, fontSize: "clamp(1.3rem,3.6vw,2rem)", color: C.boneHi, textAlign: "center", margin: "clamp(40px,6vw,64px) 0 22px", lineHeight: 1.15 }}>
          Four ways to disappoint yourself.
        </p>
        <div className="uo-tiers" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2,1fr)" }}>
          {TIERS.map((t2, i) => {
            const col = [C.rune, C.ember, C.oxblood, "#A368E0"][i];
            return (
              <div key={t2.name} style={{ position: "relative", border: `1px solid ${C.stoneUp}`, borderLeft: `3px solid ${col}`, background: C.slab, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontFamily: display, fontWeight: 700, fontSize: "0.92rem", color: C.boneHi, textTransform: "uppercase", letterSpacing: "0.02em" }}>{t2.name}</span>
                  <span style={{ fontFamily: display, fontSize: "0.72rem", color: col, textTransform: "uppercase" }}>{t2.risk}</span>
                </div>
                <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.98rem", color: C.muted, margin: "7px 0 10px", lineHeight: 1.45 }}>{t2.blurb}</p>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: display, fontSize: "0.74rem", color: C.ember }}>{t2.fee}</span>
                  <span style={{ fontFamily: display, fontSize: "0.74rem", color: C.faint }}>relic {t2.relic}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <Link href="/crypts"><Btn>Descend into the Catacombs</Btn></Link>
        </div>
      </Band>

      {/* ═══════════ THE ARMORY (swords on the body) ═══════════ */}
      <Band bg="black">
        <div style={{ maxWidth: 640, margin: "0 auto clamp(32px,5vw,50px)", textAlign: "center" }}>
          <Eyebrow>The armory · drops from the depths</Eyebrow>
          <Head>Six blades. One that shouldn't exist.</Head>
          <p style={{ fontFamily: serif, fontSize: "1.08rem", color: C.muted, lineHeight: 1.7, margin: "18px auto 0", maxWidth: "50ch" }}>
            Expeditions drop weapons, and the deeper you go, the worse the ideas you can hold. Pulled from the crypts, not sold in the market.
          </p>
        </div>
        <div className="uo-swords" style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(2,1fr)" }}>
          {SWORDS.map((s) => (
            <div key={s.slug} style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.stone, transition: "border-color .22s, transform .22s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.stoneUp; e.currentTarget.style.transform = "translateY(0)"; }}>
              <Corners color={s.color} />
              <GlowSprite src={`/sword/${s.slug}.png`} alt={s.name} glow={s.color} h={128} />
              <div style={{ padding: "0 15px 16px", textAlign: "center", borderTop: `1px solid ${C.lineLo}` }}>
                <p style={{ fontFamily: display, fontWeight: 700, fontSize: "0.9rem", color: C.boneHi, margin: "13px 0 6px", textTransform: "uppercase", letterSpacing: "0.02em" }}>{s.name}</p>
                <span style={{ fontFamily: display, fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: s.color, border: `1px solid ${s.color}66`, padding: "3px 9px", display: "inline-block" }}>{s.rarity}</span>
                <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.86rem", color: C.faint, margin: "11px 0 0" }}>{s.drop}</p>
              </div>
            </div>
          ))}
        </div>
      </Band>

      {/* ═══════════ THE BLACK MARKET (shop preview / drop menu) ═══════════ */}
      <Band bg="slab">
        <div className="uo-market-head" style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "flex-end", marginBottom: "clamp(28px,4vw,42px)" }}>
          <div>
            <Eyebrow color={C.gold}>The black market · today's drop</Eyebrow>
            <Head>Spend $GRAVE you don't have.</Head>
          </div>
          <Link href="/shop"><Btn tone="ghost" color={C.gold}>View all items →</Btn></Link>
        </div>
        <div className="uo-drop" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2,1fr)" }}>
          {FEATURED.map((slug) => {
            const it = catOf(slug);
            const glow = CAT_GLOW[it.category];
            return (
              <Link key={slug} href="/shop">
                <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.stone, cursor: "pointer", height: "100%", transition: "border-color .2s, transform .2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = glow; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.stoneUp; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <Corners color={glow} size={11} />
                  <GlowSprite src={`/shop/${slug}.png`} alt={it.name} glow={glow} h={88} pad={14} />
                  <div style={{ padding: "0 13px 14px", borderTop: `1px solid ${C.lineLo}` }}>
                    <p style={{ fontFamily: display, fontWeight: 600, fontSize: "0.82rem", color: C.boneHi, margin: "11px 0 8px", lineHeight: 1.3 }}>{it.name}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Price amount={it.price} />
                      <span style={{ fontFamily: display, fontSize: "0.64rem", textTransform: "uppercase", letterSpacing: "0.06em", color: C.faint }}>{it.category}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Band>

      {/* ═══════════ THE APOTHECARY (jars) ═══════════ */}
      <Band bg="green">
        <div style={{ maxWidth: 620, margin: "0 auto clamp(30px,4vw,46px)", textAlign: "center" }}>
          <Eyebrow color={C.rune}>The apothecary</Eyebrow>
          <Head>Five things you shouldn't drink.</Head>
          <p style={{ fontFamily: serif, fontSize: "1.06rem", color: C.muted, lineHeight: 1.7, margin: "16px auto 0", maxWidth: "48ch" }}>
            Brewed in the Catacombs, bottled by nobody reputable. Each one does <span style={{ fontStyle: "italic", color: C.bone }}>something</span>.
          </p>
        </div>
        <div className="uo-jars" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2,1fr)" }}>
          {JARS.map((j) => (
            <div key={j.slug} style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.stone, textAlign: "center" }}>
              <Corners color={j.color} size={11} />
              <GlowSprite src={`/jars/${j.slug}.png`} alt={j.name} glow={j.color} h={100} pad={14} />
              <div style={{ padding: "0 12px 16px", borderTop: `1px solid ${C.lineLo}` }}>
                <p style={{ fontFamily: display, fontWeight: 700, fontSize: "0.82rem", color: C.boneHi, margin: "12px 0 7px", textTransform: "uppercase", letterSpacing: "0.02em" }}>{j.name}</p>
                <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.9rem", color: C.muted, margin: 0, lineHeight: 1.45 }}>{j.effect}</p>
              </div>
            </div>
          ))}
        </div>
      </Band>

      {/* ═══════════ TRUST ═══════════ */}
      <Band bg="black">
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto clamp(30px,4vw,46px)" }}>
          <Eyebrow>Fairness & transparency</Eyebrow>
          <Head>Trust is earned. Not inscribed.</Head>
        </div>
        <div className="uo-trust" style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(2,1fr)" }}>
          {[
            ["On Bitcoin, forever", "The artwork is inscribed on-chain and never changes."],
            ["No wallet connect to join", "Prove holdings by address. You never sign a thing."],
            ["Never burned", "Evolution upgrades your Undead, it never destroys it."],
            ["Published rules", "Fees, odds, caps and emissions are all public, up front."],
          ].map(([title, desc]) => (
            <div key={title} style={{ display: "flex", gap: 13 }}>
              <span style={{ color: C.rune, fontFamily: display, fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.3, flexShrink: 0 }}>✦</span>
              <div>
                <p style={{ fontFamily: display, fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.03em", color: C.boneHi, margin: "0 0 5px" }}>{title}</p>
                <p style={{ fontFamily: serif, fontSize: "0.98rem", color: C.muted, lineHeight: 1.55, margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: black, fontSize: "clamp(1.2rem,3.4vw,1.9rem)", color: C.ember, textAlign: "center", margin: "clamp(32px,5vw,48px) 0 0", lineHeight: 1.2 }}>
          Less trust me bro. More show me the data.
        </p>
      </Band>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <Band bg="orange" style={{ textAlign: "center" }}>
        <Cobweb corner="tr" size={150} opacity={0.08} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}><Sigil size={56} color={C.ember} /></div>
          <Head style={{ fontSize: "clamp(1.9rem,5.5vw,3.1rem)" }}>You can't kill what's already dead.</Head>
          <p style={{ fontFamily: serif, fontSize: "1.1rem", color: C.muted, margin: "20px auto 30px", maxWidth: "46ch", lineHeight: 1.7 }}>
            {liveReg ? "Registration is open. Carve your name into the gate and claim your passport before the mint." : "The gate opens soon. Follow along so you don't miss it."}
          </p>
          <div style={{ display: "flex", gap: 13, justifyContent: "center", flexWrap: "wrap" }}>
            {liveReg
              ? <Link href="/whitelist"><Btn>Register your Undead</Btn></Link>
              : <Btn href={X_URL}>{`Follow ${X_HANDLE}`}</Btn>}
            <Link href="/whitepaper"><Btn tone="ghost" color={C.rune}>Read the codex</Btn></Link>
          </div>
          <p style={{ fontFamily: display, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.rune, margin: "30px 0 0" }}>
            3,232 Undead · One Blockchain · No Second Death
          </p>
        </div>
      </Band>

      <style>{`
        @media (min-width: 680px) {
          .uo-trust { grid-template-columns: repeat(4,1fr) !important; }
        }
        @media (min-width: 760px) {
          .uo-two { grid-template-columns: 1.05fr 0.95fr !important; }
          .uo-factions { grid-template-columns: repeat(4,1fr) !important; }
          .uo-steps { grid-template-columns: repeat(3,1fr) !important; }
          .uo-tiers { grid-template-columns: repeat(4,1fr) !important; }
          .uo-swords { grid-template-columns: repeat(6,1fr) !important; }
          .uo-drop { grid-template-columns: repeat(4,1fr) !important; }
          .uo-jars { grid-template-columns: repeat(5,1fr) !important; }
        }
        @media (min-width: 480px) and (max-width: 759px) {
          .uo-swords { grid-template-columns: repeat(3,1fr) !important; }
          .uo-jars { grid-template-columns: repeat(5,1fr) !important; }
        }
      `}</style>
    </>
  );
}

/* local: a subtle scanline sweep for the hero specimen frame */
function HudScan() {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      <div style={{ position: "absolute", left: 0, right: 0, height: "38%", background: `linear-gradient(${C.rune}00, ${C.rune}14, ${C.rune}00)`, animation: "hud 5.5s linear infinite" }} />
    </div>
  );
}
