import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { C, display, body, mono } from "@/lib/theme";
import { ACTIVE_PHASE, PROJECT, X_URL, X_HANDLE, ASSET, DISCORD } from "@/lib/theme";
import { Btn, notch } from "@/components/ui";
import { SparkField } from "@/components/Effects";

const NAV: [string, string][] = [
  ["Home", "/"],
  ["Collection", "/collection"],
  ["Catacombs", "/catacombs"],
  ["Whitepaper", "/whitepaper"],
];

/* The primary CTA changes with the campaign phase (see theme.ts). */
function phaseCta(): { label: string; to: string } {
  switch (ACTIVE_PHASE) {
    case "teaser":  return { label: "Join the Horde", to: "/raffle" };
    case "raffle":  return { label: "Verify & Claim", to: "/verify" };
    case "waitlist":return { label: "Join Waitlist", to: "/raffle" };
    case "minting": return { label: "Mint Now", to: "/verify" };
    case "minted":  return { label: "View Collection", to: "/collection" };
  }
}

/* Drifting pixel grid that sits behind everything. */
export function GridBg() {
  return (
    <div aria-hidden style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage:
        `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
      backgroundSize: "44px 44px",
      animation: "grid-drift 14s linear infinite",
      maskImage: "radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.7), transparent 75%)",
      WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.7), transparent 75%)",
    }} />
  );
}

function Nav() {
  const [loc] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const cta = phaseCta();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setOpen(false); }, [loc]);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 120,
      background: scrolled ? "rgba(5,6,10,0.88)" : "transparent",
      backdropFilter: scrolled ? "blur(10px)" : "none",
      borderBottom: `2px solid ${scrolled ? C.tomb : "transparent"}`,
      transition: "background .3s, border-color .3s",
    }}>
      <div style={{
        maxWidth: 1080, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)",
        height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <img src={ASSET.logo} alt="" width={38} height={38}
            style={{ border: `2px solid ${C.tombUp}`, boxShadow: `0 0 16px ${C.ice}44`, animation: "flicker 7s infinite" }} />
          <span style={{ fontFamily: display, fontSize: "0.72rem", color: C.bone, letterSpacing: "0.02em", lineHeight: 1.4 }}>
            UNDEAD<br />
            <span style={{ color: C.ice, fontSize: "0.6rem" }}>ORDINALS</span>
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="uo-desktop-nav" style={{ display: "none", alignItems: "center", gap: 26 }}>
          {NAV.map(([label, to]) => {
            const active = loc === to;
            return (
              <Link key={to} href={to} style={{
                fontFamily: mono, fontSize: "1.15rem", letterSpacing: "0.1em",
                textTransform: "uppercase", color: active ? C.ice : C.muted,
                borderBottom: `2px solid ${active ? C.ice : "transparent"}`,
                paddingBottom: 3, transition: "color .15s, border-color .15s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.bone)}
                onMouseLeave={(e) => (e.currentTarget.style.color = active ? C.ice : C.muted)}>
                {label}
              </Link>
            );
          })}
          <Link href={cta.to}><Btn small>{cta.label}</Btn></Link>
        </nav>

        {/* mobile toggle */}
        <button className="uo-burger" onClick={() => setOpen((o) => !o)} aria-label="Menu"
          style={{
            display: "flex", background: "transparent", border: `2px solid ${C.tombUp}`,
            clipPath: notch(6), color: C.ice, padding: "9px 12px", cursor: "pointer",
            fontFamily: mono, fontSize: "1.1rem", letterSpacing: "0.1em",
          }}>
          {open ? "CLOSE" : "MENU"}
        </button>
      </div>

      {/* mobile sheet */}
      {open && (
        <div className="uo-mobile-sheet" style={{
          borderTop: `2px solid ${C.tomb}`, background: "rgba(5,6,10,0.97)",
          padding: "12px clamp(16px,5vw,40px) 22px", animation: "rise .2s ease both",
        }}>
          {NAV.map(([label, to]) => (
            <Link key={to} href={to} style={{
              display: "block", fontFamily: display, fontSize: "0.72rem",
              color: loc === to ? C.ice : C.bone, padding: "15px 0",
              borderBottom: `1px solid ${C.line}`, letterSpacing: "0.02em",
            }}>{label}</Link>
          ))}
          <div style={{ marginTop: 16 }}>
            <Link href={cta.to}><Btn full>{cta.label}</Btn></Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .uo-desktop-nav { display: flex !important; }
          .uo-burger { display: none !important; }
          .uo-mobile-sheet { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.void, borderTop: `2px solid ${C.tomb}`, position: "relative", zIndex: 1 }}>
      <div className="seam" />
      <div style={{
        maxWidth: 1080, margin: "0 auto", padding: "clamp(40px,7vw,64px) clamp(16px,5vw,40px)",
        display: "grid", gap: 30, gridTemplateColumns: "1fr", textAlign: "center",
      }}>
        <div>
          <img src={ASSET.logo} alt="" width={54} height={54}
            style={{ border: `2px solid ${C.tombUp}`, boxShadow: `0 0 20px ${C.ice}44`, margin: "0 auto 14px", display: "block" }} />
          <p style={{ fontFamily: display, fontSize: "0.82rem", color: C.bone, margin: "0 0 8px", letterSpacing: "0.03em" }}>
            UNDEAD ORDINALS
          </p>
          <p style={{ fontFamily: mono, fontSize: "1.1rem", color: C.muted, margin: 0, letterSpacing: "0.1em" }}>
            {PROJECT.supply.toLocaleString()} UNDEAD · NO SECOND DEATH
          </p>
        </div>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a href={X_URL} target="_blank" rel="noopener noreferrer" style={footLink}>{X_HANDLE} ↗</a>
          {DISCORD && <a href={DISCORD} target="_blank" rel="noopener noreferrer" style={footLink}>DISCORD ↗</a>}
          <Link href="/whitepaper" style={footLink}>WHITEPAPER</Link>
        </div>

        <p style={{ fontFamily: body, fontSize: "0.84rem", color: C.faint, margin: 0, lineHeight: 1.7, maxWidth: "60ch", marginInline: "auto" }}>
          $GRAVE is a utility token, not an investment — no price, return or appreciation is promised.
          Nothing here is financial advice. Milestones are not guarantees of delivery on any date.
          Born from forgotten blocks. Resurrected on Bitcoin. Built to outlive the cycle.
        </p>
      </div>
    </footer>
  );
}

const footLink = {
  fontFamily: mono, fontSize: "1.05rem", letterSpacing: "0.12em", color: C.ice,
  border: `1px solid ${C.tombUp}`, padding: "8px 14px", clipPath: notch(6),
} as const;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: C.void, display: "flex", flexDirection: "column", fontFamily: body, position: "relative" }}>
      <GridBg />
      <SparkField />
      <div style={{ position: "relative", zIndex: 2 }}>
        <Nav />
      </div>
      <main style={{ flex: 1, position: "relative", zIndex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
