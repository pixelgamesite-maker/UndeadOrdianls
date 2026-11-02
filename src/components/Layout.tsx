import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { C, display, serif } from "@/lib/theme";
import { ACTIVE_PHASE, PROJECT, X_URL, X_HANDLE, DISCORD } from "@/lib/theme";
import { Btn, Sigil } from "@/components/ui";

const NAV: [string, string][] = [
  ["Collection", "/collection"],
  ["Catacombs", "/catacombs"],
  ["Whitepaper", "/whitepaper"],
];

function phaseCta(): { label: string; to: string } {
  switch (ACTIVE_PHASE) {
    case "teaser":   return { label: "Join the horde", to: "/raffle" };
    case "raffle":   return { label: "Verify holdings", to: "/verify" };
    case "waitlist": return { label: "Join waitlist", to: "/raffle" };
    case "minting":  return { label: "Mint", to: "/verify" };
    case "minted":   return { label: "View collection", to: "/collection" };
  }
}

function Nav() {
  const [loc] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const cta = phaseCta();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setOpen(false); }, [loc]);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 120,
      background: scrolled ? "rgba(16,13,22,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(8px)" : "none",
      borderBottom: `1px solid ${scrolled ? C.stoneUp : "transparent"}`,
      transition: "background .3s, border-color .3s",
    }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 clamp(16px,5vw,44px)", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Sigil size={34} color={C.ember} spin />
          <span style={{ fontFamily: display, fontSize: "0.92rem", color: C.boneHi, letterSpacing: "0.02em" }}>
            Undead&nbsp;Ordinals
          </span>
        </Link>

        <nav className="uo-desktop-nav" style={{ display: "none", alignItems: "center", gap: 30 }}>
          {NAV.map(([label, to]) => {
            const active = loc === to;
            return (
              <Link key={to} href={to} style={{
                fontFamily: display, fontSize: "0.82rem", color: active ? C.ember : C.muted,
                borderBottom: `2px solid ${active ? C.ember : "transparent"}`, paddingBottom: 4,
                transition: "color .15s, border-color .15s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.boneHi)}
                onMouseLeave={(e) => (e.currentTarget.style.color = active ? C.ember : C.muted)}>
                {label}
              </Link>
            );
          })}
          <Link href={cta.to}><Btn small>{cta.label}</Btn></Link>
        </nav>

        <button className="uo-burger" onClick={() => setOpen((o) => !o)} aria-label="Menu"
          style={{ display: "flex", background: "transparent", border: `1px solid ${C.stoneUp}`, color: C.ember, padding: "9px 13px", cursor: "pointer", fontFamily: display, fontSize: "0.74rem" }}>
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="uo-mobile-sheet" style={{ borderTop: `1px solid ${C.stoneUp}`, background: "rgba(11,9,16,0.98)", padding: "10px clamp(16px,5vw,44px) 22px" }}>
          {NAV.map(([label, to]) => (
            <Link key={to} href={to} style={{ display: "block", fontFamily: display, fontSize: "0.88rem", color: loc === to ? C.ember : C.bone, padding: "15px 0", borderBottom: `1px solid ${C.lineLo}` }}>{label}</Link>
          ))}
          <div style={{ marginTop: 16 }}><Link href={cta.to}><Btn full>{cta.label}</Btn></Link></div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .uo-desktop-nav { display: flex !important; }
          .uo-burger, .uo-mobile-sheet { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function Footer() {
  const links: [string, string][] = [[X_HANDLE, X_URL], ["Whitepaper", "/whitepaper"]];
  if (DISCORD) links.splice(1, 0, ["Discord", DISCORD]);
  return (
    <footer style={{ background: C.slab, borderTop: `1px solid ${C.stoneUp}`, position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "clamp(48px,7vw,72px) clamp(16px,5vw,44px)", display: "grid", gap: 28, textAlign: "center", justifyItems: "center" }}>
        <Sigil size={52} color={C.ember} />
        <div>
          <p style={{ fontFamily: display, fontSize: "1.05rem", color: C.boneHi, margin: "0 0 10px", letterSpacing: "0.02em" }}>Undead Ordinals</p>
          <p className="standfirst" style={{ fontFamily: serif, fontSize: "1.1rem", color: C.muted, margin: 0 }}>
            {PROJECT.supply.toLocaleString()} undead. No second death.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          {links.map(([label, href]) => {
            const ext = /^https?:/.test(href);
            return ext
              ? <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={footLink}>{label}</a>
              : <Link key={label} href={href} style={footLink}>{label}</Link>;
          })}
        </div>
        <p style={{ fontFamily: serif, fontSize: "0.92rem", color: C.faint, margin: 0, lineHeight: 1.7, maxWidth: "62ch" }}>
          {PROJECT.token} is a utility token, not an investment — no price, return or appreciation is promised, and nothing
          here is financial advice. Milestones are not guarantees of delivery on any date. Born from forgotten blocks,
          resurrected on Bitcoin, built to outlive the cycle.
        </p>
      </div>
    </footer>
  );
}

const footLink = { fontFamily: display, fontSize: "0.76rem", color: C.rune, border: `1px solid ${C.stoneUp}`, padding: "9px 15px" } as const;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: C.ash, display: "flex", flexDirection: "column", fontFamily: serif, position: "relative" }}>
      <Nav />
      <main style={{ flex: 1, position: "relative", zIndex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
