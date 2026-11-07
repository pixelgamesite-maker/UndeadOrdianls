import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Btn, Corners, Price, GlowSprite, Sigil, C, display, serif, black } from "@/components/ui";
import { SHOP_ITEMS, SHOP_CATEGORIES, CAT_GLOW, type ItemCategory } from "@/lib/shop";

type Filter = "All" | ItemCategory;

export default function Shop() {
  const [filter, setFilter] = useState<Filter>("All");

  const items = useMemo(
    () => (filter === "All" ? SHOP_ITEMS : SHOP_ITEMS.filter((i) => i.category === filter)),
    [filter],
  );
  const count = SHOP_ITEMS.length;

  const tabs: Filter[] = ["All", ...SHOP_CATEGORIES];

  return (
    <>
      {/* header */}
      <section style={{ position: "relative", padding: "clamp(60px,9vw,104px) clamp(18px,5vw,44px) clamp(28px,4vw,40px)", textAlign: "center", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(246,201,69,0.09), transparent 58%)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Sigil size={50} color={C.gold} /></div>
          <h1 style={{ fontFamily: black, fontWeight: 400, fontSize: "clamp(2.2rem,7vw,3.8rem)", color: C.boneHi, margin: 0, lineHeight: 1.05 }}>The Black Market</h1>
          <p style={{ fontFamily: serif, fontSize: "clamp(1.05rem,2.5vw,1.3rem)", color: C.muted, margin: "18px auto 0", maxWidth: "50ch", lineHeight: 1.6 }}>
            Relics, weapons, armor and questionable potions, pulled from the Catacombs and priced in <span style={{ color: C.gold }}>$GRAVE</span>. Earn it on expeditions. Lose it here.
          </p>
          <p style={{ fontFamily: display, fontSize: "0.74rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.rune, margin: "16px 0 0" }}>
            {count} items in the ledger · prices shown in gold
          </p>
        </div>
      </section>

      {/* filter bar */}
      <div style={{ position: "sticky", top: 68, zIndex: 40, background: "rgba(4,11,7,0.94)", backdropFilter: "blur(8px)", borderTop: `1px solid ${C.stoneUp}`, borderBottom: `1px solid ${C.stoneUp}` }}>
        <div className="uo-filter" style={{ maxWidth: 1160, margin: "0 auto", padding: "12px clamp(14px,4vw,40px)", display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {tabs.map((tab) => {
            const on = filter === tab;
            return (
              <button key={tab} onClick={() => setFilter(tab)}
                style={{ fontFamily: display, fontWeight: 600, fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.04em", color: on ? C.ash : C.muted, background: on ? C.rune : "transparent", border: `1px solid ${on ? C.rune : C.stoneUp}`, padding: "8px 14px", cursor: "pointer", transition: "color .15s, background .15s, border-color .15s" }}
                onMouseEnter={(e) => { if (!on) e.currentTarget.style.borderColor = C.rune; }}
                onMouseLeave={(e) => { if (!on) e.currentTarget.style.borderColor = C.stoneUp; }}>
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* grid */}
      <section style={{ padding: "clamp(32px,5vw,56px) clamp(18px,5vw,44px) clamp(56px,8vw,96px)" }}>
        <div className="uo-shop-grid" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gap: 13, gridTemplateColumns: "repeat(2,1fr)" }}>
          {items.map((it) => {
            const glow = CAT_GLOW[it.category];
            return (
              <div key={it.slug} style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.stone, display: "flex", flexDirection: "column", transition: "border-color .2s, transform .2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = glow; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.stoneUp; e.currentTarget.style.transform = "translateY(0)"; }}>
                <Corners color={glow} size={11} />
                <div style={{ position: "absolute", top: 9, left: 9 }}>
                  <span style={{ fontFamily: display, fontSize: "0.6rem", letterSpacing: "0.06em", textTransform: "uppercase", color: glow, border: `1px solid ${glow}55`, padding: "2px 7px" }}>{it.category}</span>
                </div>
                <GlowSprite src={`/shop/${it.slug}.png`} alt={it.name} glow={glow} h={92} pad={16} />
                <div style={{ padding: "0 14px 15px", borderTop: `1px solid ${C.lineLo}`, flex: 1, display: "flex", flexDirection: "column" }}>
                  <p style={{ fontFamily: display, fontWeight: 700, fontSize: "0.86rem", color: C.boneHi, margin: "12px 0 6px", textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.25 }}>{it.name}</p>
                  <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.88rem", color: C.muted, margin: "0 0 13px", lineHeight: 1.45, flex: 1 }}>{it.blurb}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 11, borderTop: `1px solid ${C.lineLo}` }}>
                    <Price amount={it.price} size="1rem" />
                    <span style={{ fontFamily: display, fontSize: "0.64rem", textTransform: "uppercase", letterSpacing: "0.08em", color: C.faint }}>Locked</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ fontFamily: serif, fontSize: "0.96rem", color: C.faint, textAlign: "center", margin: "34px auto 0", maxWidth: "58ch", lineHeight: 1.6 }}>
          The market unlocks with the Catacombs. Items are earned and spent in-game using $GRAVE, never with real money, and every price here is subject to the final game specification.
        </p>
        <div style={{ display: "flex", gap: 13, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
          <Link href="/whitelist"><Btn>Register your Undead</Btn></Link>
          <Link href="/crypts"><Btn tone="ghost" color={C.rune}>Enter the Catacombs</Btn></Link>
        </div>
      </section>

      <style>{`
        @media (min-width: 560px) { .uo-shop-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (min-width: 860px) { .uo-shop-grid { grid-template-columns: repeat(4,1fr) !important; } }
        @media (min-width: 1100px){ .uo-shop-grid { grid-template-columns: repeat(6,1fr) !important; } }
      `}</style>
    </>
  );
}
