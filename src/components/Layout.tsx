import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { C, display, serif } from "@/lib/theme";
import { ACTIVE_PHASE, PROJECT, X_URL, X_HANDLE, DISCORD, ASSET } from "@/lib/theme";
import { Btn, Sigil, Gravestones, Corners } from "@/components/ui";
import { toggleMute, useMuted } from "@/lib/audio";

const NAV: [string, string][] = [
  ["Home", "/"],
  ["The Undead", "/collection"],
  ["The Catacombs", "/catacombs"],
  ["Codex", "/whitepaper"],
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

/* Fixed game background: the title video on the home screen, the mossy
   dungeon wall everywhere else. Both dimmed so content stays legible. */
function PageBackground({ home }: { home: boolean }) {
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {home ? (
        <video src={ASSET.video} autoPlay muted loop playsInline poster={ASSET.logo}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.34 }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${ASSET.wall})`, backgroundSize: "480px", opacity: 0.5 }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: home
        ? "radial-gradient(ellipse at 50% 30%, rgba(16,13,22,0.5), rgba(8,6,12,0.86))"
        : "linear-gradient(rgba(10,8,14,0.7), rgba(10,8,14,0.82))" }} />
    </div>
  );
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      {muted
        ? <path d="M17 9l5 6M22 9l-5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
        : <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />}
    </svg>
  );
}

function MuteBtn() {
  const muted = useMuted();
  return (
    <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} title={muted ? "Sound off" : "Sound on"}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, background: "transparent", border: `1px solid ${C.stoneUp}`, color: muted ? C.faint : C.ember, cursor: "pointer", transition: "color .15s, border-color .15s" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.ember)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.stoneUp)}>
      <SpeakerIcon muted={muted} />
    </button>
  );
}

/* A game-menu item: a ▶ cursor appears when hovered or active. */
function MenuItem({ label, to, active, big = false, onNav }: { label: string; to: string; active: boolean; big?: boolean; onNav?: () => void }) {
  const [hover, setHover] = useState(false);
  const lit = active || hover;
  return (
    <Link href={to} onClick={onNav}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", display: "flex", alignItems: "center", gap: 10,
        fontFamily: display, fontSize: big ? "1.05rem" : "0.8rem",
        color: lit ? C.ember : C.muted, padding: big ? "14px 0" : "4px 0",
        transition: "color .14s", letterSpacing: "0.02em",
      }}>
      <span style={{ opacity: lit ? 1 : 0, color: C.ember, transition: "opacity .12s", transform: lit ? "translateX(0)" : "translateX(-4px)", width: big ? 18 : 12 }}>▶</span>
      {label}
    </Link>
  );
}

function Nav({ home }: { home: boolean }) {
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
      background: scrolled ? "rgba(11,9,16,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(8px)" : "none",
      borderBottom: `1px solid ${scrolled ? C.stoneUp : "transparent"}`,
      transition: "background .3s, border-color .3s",
    }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 clamp(14px,4vw,40px)", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <img src={ASSET.hardLogo} alt="Undead Ordinals" width={38} height={38}
            style={{ width: 38, height: 38, objectFit: "contain", filter: `drop-shadow(0 0 7px ${C.ember}66)`, animation: "flick 7s infinite" }} />
          <span style={{ fontFamily: display, fontSize: "0.86rem", color: C.boneHi, letterSpacing: "0.02em" }}>Undead&nbsp;Ordinals</span>
        </Link>

        <nav className="uo-desktop-nav" style={{ display: "none", alignItems: "center", gap: 26 }}>
          {NAV.slice(1).map(([label, to]) => <MenuItem key={to} label={label} to={to} active={loc === to} />)}
          <MuteBtn />
          <Link href={cta.to}><Btn small>{cta.label}</Btn></Link>
        </nav>

        <div className="uo-burger" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <MuteBtn />
          <button onClick={() => setOpen((o) => !o)} aria-label="Menu"
            style={{ background: "transparent", border: `1px solid ${C.stoneUp}`, color: C.ember, padding: "9px 13px", cursor: "pointer", fontFamily: display, fontSize: "0.72rem" }}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Pause-menu style overlay on mobile. */}
      {open && (
        <div className="uo-mobile-sheet" style={{ position: "fixed", inset: 0, top: 68, zIndex: 119, background: "rgba(8,6,12,0.97)" }}>
          <div style={{ position: "relative", maxWidth: 420, margin: "0 auto", padding: "40px clamp(20px,6vw,40px)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}><Sigil size={56} color={C.ember} /></div>
            <p style={{ fontFamily: display, fontSize: "0.66rem", color: C.rune, textAlign: "center", letterSpacing: "0.1em", margin: "0 0 18px" }}>[ PAUSE MENU ]</p>
            <div style={{ display: "grid", borderTop: `1px solid ${C.stoneUp}` }}>
              {NAV.map(([label, to]) => (
                <div key={to} style={{ borderBottom: `1px solid ${C.stoneUp}`, paddingLeft: 6 }}>
                  <MenuItem label={label} to={to} active={loc === to} big onNav={() => setOpen(false)} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 22 }}><Link href={cta.to}><Btn full>{cta.label}</Btn></Link></div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 920px) {
          .uo-desktop-nav { display: flex !important; }
          .uo-burger, .uo-mobile-sheet { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function Footer() {
  const links: [string, string][] = [[X_HANDLE, X_URL], ["Codex", "/whitepaper"]];
  if (DISCORD) links.splice(1, 0, ["Discord", DISCORD]);
  return (
    <footer style={{ background: "rgba(11,9,16,0.92)", borderTop: `1px solid ${C.stoneUp}`, position: "relative", zIndex: 1 }}>
      <div style={{ opacity: 0.85, marginBottom: -2 }}><Gravestones color={C.ash} height={54} /></div>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "clamp(30px,5vw,52px) clamp(16px,5vw,44px) clamp(48px,7vw,72px)", display: "grid", gap: 28, textAlign: "center", justifyItems: "center" }}>
        <Sigil size={52} color={C.ember} />
        <div>
          <p style={{ fontFamily: display, fontSize: "1rem", color: C.boneHi, margin: "0 0 10px", letterSpacing: "0.02em" }}>Undead Ordinals</p>
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
        <p style={{ fontFamily: serif, fontSize: "0.9rem", color: C.faint, margin: 0, lineHeight: 1.7, maxWidth: "62ch" }}>
          {PROJECT.token} is a utility token, not an investment, and no price, return or appreciation is promised. Nothing
          here is financial advice, and milestones are not guarantees of delivery on any date.
        </p>
      </div>
    </footer>
  );
}

const footLink = { fontFamily: display, fontSize: "0.74rem", color: C.rune, border: `1px solid ${C.stoneUp}`, padding: "9px 15px" } as const;

export default function Layout({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const home = loc === "/";
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: serif, position: "relative" }}>
      <PageBackground home={home} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Nav home={home} />
        <main style={{ flex: 1, position: "relative" }}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
