import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { C, display, serif, black } from "@/lib/theme";

/* ════════════════════════════════════════════════════════════════
   The reliquary kit. Specimen plates with corner brackets, sharp
   edges, bone + crypt-stone surfaces, ember as the one accent.
   ════════════════════════════════════════════════════════════════ */

/* ── Corner brackets: four L-marks that turn any box into a mounted
   archival plate. This is the signature frame of the site. ── */
export function Corners({ color = C.rune, size = 13, inset = -1 }: { color?: string; size?: number; inset?: number }) {
  const bar = 2;
  const common: CSSProperties = { position: "absolute", width: size, height: size, pointerEvents: "none" };
  return (
    <>
      <span aria-hidden style={{ ...common, top: inset, left: inset, borderTop: `${bar}px solid ${color}`, borderLeft: `${bar}px solid ${color}` }} />
      <span aria-hidden style={{ ...common, top: inset, right: inset, borderTop: `${bar}px solid ${color}`, borderRight: `${bar}px solid ${color}` }} />
      <span aria-hidden style={{ ...common, bottom: inset, left: inset, borderBottom: `${bar}px solid ${color}`, borderLeft: `${bar}px solid ${color}` }} />
      <span aria-hidden style={{ ...common, bottom: inset, right: inset, borderBottom: `${bar}px solid ${color}`, borderRight: `${bar}px solid ${color}` }} />
    </>
  );
}

/* ── Plate: a crypt-stone panel with a hairline border and corner
   brackets. The workhorse surface. ── */
export function Plate({
  children, accent = C.stoneUp, corners = C.rune, tone = "stone", pad = 24, style, hoverable = false,
}: {
  children: ReactNode; accent?: string; corners?: string;
  tone?: "stone" | "slab" | "bone"; pad?: number; style?: CSSProperties; hoverable?: boolean;
}) {
  const bg = tone === "bone" ? C.bone : tone === "slab" ? C.slab : C.stone;
  const fg = tone === "bone" ? C.ash : C.bone;
  return (
    <div
      style={{ position: "relative", background: bg, color: fg, border: `1px solid ${accent}`, padding: pad, transition: "border-color .25s, transform .25s", ...style }}
      onMouseEnter={hoverable ? (e) => { e.currentTarget.style.borderColor = C.ember; e.currentTarget.style.transform = "translateY(-3px)"; } : undefined}
      onMouseLeave={hoverable ? (e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.transform = "translateY(0)"; } : undefined}
    >
      <Corners color={corners} />
      {children}
    </div>
  );
}

/* ── Reveal: used sparingly, not on every element. ── */
export function Reveal({ children, delay = 0, y = 16, style }: { children: ReactNode; delay?: number; y?: number; style?: CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── Section wrapper. ── */
export function Section({ children, tone = "ash", id, style }: { children: ReactNode; tone?: "ash" | "slab"; id?: string; style?: CSSProperties }) {
  return (
    <section id={id} style={{ background: tone === "ash" ? "rgba(16,13,22,0.72)" : "rgba(11,9,16,0.82)", padding: "clamp(64px,10vw,130px) 0", position: "relative", ...style }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 clamp(20px,5vw,44px)" }}>{children}</div>
    </section>
  );
}

/* ── SectionHead: a catalogue designation (small, in the pixel face)
   + a serif title, with a verdigris rule. No tracked-caps eyebrow. ── */
export function SectionHead({
  designation, title, standfirst, align = "left", color = C.ember,
}: { designation?: string; title: ReactNode; standfirst?: ReactNode; align?: "left" | "center"; color?: string }) {
  return (
    <div style={{ textAlign: align, maxWidth: align === "center" ? 720 : undefined, marginInline: align === "center" ? "auto" : undefined, marginBottom: "clamp(32px,5vw,56px)" }}>
      {designation && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: align === "center" ? "center" : "flex-start", marginBottom: 16 }}>
          <span style={{ width: 22, height: 2, background: color }} />
          <span style={{ fontFamily: display, fontSize: "0.7rem", color, letterSpacing: "0.04em" }}>{designation}</span>
        </div>
      )}
      <h2 style={{ fontFamily: black, fontWeight: 400, color: C.boneHi, fontSize: "clamp(2rem,5.5vw,3.4rem)", lineHeight: 1.1, margin: 0, letterSpacing: "0.01em" }}>{title}</h2>
      {standfirst && (
        <p className="standfirst" style={{ fontFamily: serif, fontSize: "clamp(1.05rem,2.3vw,1.3rem)", color: C.muted, lineHeight: 1.6, margin: "18px 0 0", maxWidth: "60ch", marginInline: align === "center" ? "auto" : undefined }}>
          {standfirst}
        </p>
      )}
    </div>
  );
}

/* ── Button: sharp rectangle. ember (solid), bone (outline), ghost.
   No chamfer, no arrow. ── */
export function Btn({
  children, onClick, href, tone = "ember", full = false, small = false, color,
}: { children: ReactNode; onClick?: () => void; href?: string; tone?: "ember" | "bone" | "ghost"; full?: boolean; small?: boolean; color?: string }) {
  const accent = color ?? (tone === "bone" ? C.bone : C.ember);
  const solid = tone === "ember";
  const style: CSSProperties = {
    display: full ? "block" : "inline-block", width: full ? "100%" : undefined,
    fontFamily: display, fontWeight: 400,
    fontSize: small ? "0.7rem" : "clamp(0.72rem,1.5vw,0.84rem)", letterSpacing: "0.02em", lineHeight: 1.4,
    color: solid ? C.ash : accent, background: solid ? accent : "transparent",
    border: `1.5px solid ${accent}`, borderRadius: 0,
    padding: small ? "11px 18px" : "15px 30px", cursor: "pointer", textAlign: "center",
    transition: "background .18s, color .18s, box-shadow .18s, transform .12s",
    boxShadow: solid ? `3px 3px 0 ${C.emberLo}` : "none",
  };
  const over = (el: HTMLElement) => {
    el.style.transform = "translate(-1px,-1px)";
    if (solid) { el.style.boxShadow = `5px 5px 0 ${C.emberLo}`; }
    else { el.style.background = accent; el.style.color = C.ash; }
  };
  const out = (el: HTMLElement) => {
    el.style.transform = "translate(0,0)";
    if (solid) { el.style.boxShadow = `3px 3px 0 ${C.emberLo}`; }
    else { el.style.background = "transparent"; el.style.color = accent; }
  };
  if (href) {
    const ext = /^https?:/.test(href);
    return <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} style={style} onMouseEnter={(e) => over(e.currentTarget)} onMouseLeave={(e) => out(e.currentTarget)}>{children}</a>;
  }
  return <button onClick={onClick} style={style} onMouseEnter={(e) => over(e.currentTarget)} onMouseLeave={(e) => out(e.currentTarget)}>{children}</button>;
}

/* ── Wordmark: pixel face with a static two-colour misregistration
   (ember + verdigris ghosts), like a misprinted relic label. Not an
   animated RGB glitch. ── */
export function Wordmark({ children, size = "clamp(2.4rem,9vw,5.4rem)", style }: { children: string; size?: string; style?: CSSProperties }) {
  const base: CSSProperties = { fontFamily: black, color: C.boneHi, fontSize: size, lineHeight: 1.05, position: "relative", display: "inline-block", letterSpacing: "0.01em", ...style };
  const ghost = (color: string, dx: number, dy: number): CSSProperties => ({ position: "absolute", inset: 0, color, transform: `translate(${dx}px,${dy}px)`, opacity: 0.6, pointerEvents: "none" });
  return (
    <span style={base} aria-label={children}>
      <span aria-hidden style={ghost(C.ember, -2, 1)}>{children}</span>
      <span aria-hidden style={ghost(C.rune, 2, -1)}>{children}</span>
      <span style={{ position: "relative" }}>{children}</span>
    </span>
  );
}

/* ── Sigil: the brand/ritual mark. An ordinal seal — ring, inner ring,
   cross-ticks and a pixel skull dot. Used as logo + section divider. ── */
export function Sigil({ size = 40, color = C.ember, spin = false }: { size?: number; color?: string; spin?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden style={spin ? { animation: "flick 6s infinite" } : undefined}>
      <circle cx="24" cy="24" r="22" stroke={color} strokeWidth="1.2" />
      <circle cx="24" cy="24" r="16" stroke={color} strokeWidth="0.8" opacity="0.6" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r1 = 16, r2 = 22, rad = (a * Math.PI) / 180;
        return <line key={a} x1={24 + r1 * Math.cos(rad)} y1={24 + r1 * Math.sin(rad)} x2={24 + r2 * Math.cos(rad)} y2={24 + r2 * Math.sin(rad)} stroke={color} strokeWidth="0.8" opacity="0.7" />;
      })}
      {/* pixel skull glyph */}
      <rect x="18" y="18" width="12" height="10" fill={color} />
      <rect x="20" y="21" width="2" height="2" fill={C.ash} />
      <rect x="26" y="21" width="2" height="2" fill={C.ash} />
      <rect x="20" y="28" width="2" height="3" fill={color} />
      <rect x="23" y="28" width="2" height="3" fill={color} />
      <rect x="26" y="28" width="2" height="3" fill={color} />
    </svg>
  );
}

/* ── Rule: a thin divider. verdigris or bone-faint. ── */
export function Rule({ color = C.line, style }: { color?: string; style?: CSSProperties }) {
  return <div aria-hidden style={{ height: 1, background: color, ...style }} />;
}

/* ── Tag: a small bordered label. ── */
export function Tag({ children, color = C.rune }: { children: ReactNode; color?: string }) {
  return (
    <span style={{ fontFamily: display, fontSize: "0.66rem", letterSpacing: "0.03em", color, border: `1px solid ${color}66`, padding: "4px 9px", whiteSpace: "nowrap", display: "inline-block" }}>{children}</span>
  );
}

/* ── Seq: a sequence index for TRUE sequences only (roadmap, loop). ── */
export function Seq({ children, color = C.ember }: { children: ReactNode; color?: string }) {
  return <span style={{ fontFamily: display, fontSize: "0.82rem", color }}>{children}</span>;
}

/* ── Live: a breathing ember dot + label for live states. ── */
export function Live({ label, color = C.ember }: { label: string; color?: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: display, fontSize: "0.68rem", letterSpacing: "0.03em", color }}>
      <span style={{ width: 8, height: 8, background: color, animation: "flick 2.2s infinite", boxShadow: `0 0 9px ${color}` }} />
      {label}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════
   Seasonal (Halloween) — kept quiet and low-opacity so it reads as
   atmosphere, not decoration. A corner cobweb, a hanging spider, a
   graveyard silhouette, a low mist.
   ════════════════════════════════════════════════════════════════ */

/* Corner cobweb. `corner` places it; it mirrors via scale. */
export function Cobweb({ corner = "tl", size = 150, color = C.bone, opacity = 0.12 }: { corner?: "tl" | "tr" | "bl" | "br"; size?: number; color?: string; opacity?: number }) {
  const sx = corner === "tr" || corner === "br" ? -1 : 1;
  const sy = corner === "bl" || corner === "br" ? -1 : 1;
  const pos: CSSProperties =
    corner === "tl" ? { top: 0, left: 0 } :
    corner === "tr" ? { top: 0, right: 0 } :
    corner === "bl" ? { bottom: 0, left: 0 } : { bottom: 0, right: 0 };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden
      style={{ position: "absolute", ...pos, transform: `scale(${sx},${sy})`, opacity, pointerEvents: "none" }}>
      {/* radial strands */}
      {[0, 18, 36, 54, 72, 90].map((a) => {
        const rad = (a * Math.PI) / 180;
        return <line key={a} x1="0" y1="0" x2={100 * Math.cos(rad)} y2={100 * Math.sin(rad)} stroke={color} strokeWidth="0.6" />;
      })}
      {/* connecting arcs */}
      {[20, 38, 56, 74, 92].map((r) => (
        <path key={r} d={`M ${r} 0 Q ${r * 0.62} ${r * 0.62} 0 ${r}`} stroke={color} strokeWidth="0.5" fill="none" />
      ))}
    </svg>
  );
}

/* A small pixel spider hanging on a thread. */
export function Spider({ drop = 90, size = 16, color = C.bone }: { drop?: number; size?: number; color?: string }) {
  return (
    <div aria-hidden style={{ position: "absolute", top: 0, display: "flex", flexDirection: "column", alignItems: "center", transformOrigin: "top center", animation: "sway 5s ease-in-out infinite", pointerEvents: "none" }}>
      <div style={{ width: 1, height: drop, background: `linear-gradient(${C.bone}44, ${C.bone}22)` }} />
      <svg width={size} height={size} viewBox="0 0 16 16" style={{ marginTop: -1 }}>
        <circle cx="8" cy="8" r="3.4" fill={color} />
        <circle cx="8" cy="4.6" r="2" fill={color} />
        {[-1, 1].map((s) => [0, 1, 2].map((i) => (
          <line key={`${s}-${i}`} x1="8" y1="8" x2={8 + s * 7} y2={3 + i * 4} stroke={color} strokeWidth="0.9" />
        )))}
      </svg>
    </div>
  );
}

/* Graveyard horizon — a silhouette strip of headstones + a cross. */
export function Gravestones({ color = C.slab, height = 56 }: { color?: string; height?: number }) {
  return (
    <svg width="100%" height={height} viewBox="0 0 400 56" preserveAspectRatio="none" aria-hidden style={{ display: "block", pointerEvents: "none" }}>
      <g fill={color}>
        <path d="M14 56 L14 26 Q14 18 24 18 Q34 18 34 26 L34 56 Z" />
        <rect x="70" y="30" width="16" height="26" />
        <path d="M120 56 L120 22 Q120 14 131 14 Q142 14 142 22 L142 56 Z" />
        <g>
          <rect x="188" y="14" width="6" height="42" />
          <rect x="178" y="22" width="26" height="6" />
        </g>
        <rect x="236" y="28" width="18" height="28" />
        <path d="M286 56 L286 24 Q286 16 297 16 Q308 16 308 24 L308 56 Z" />
        <rect x="344" y="32" width="15" height="24" />
      </g>
    </svg>
  );
}

/* Low drifting mist for the base of a section. */
export function Fog({ color = C.rune }: { color?: string }) {
  return (
    <div aria-hidden style={{ position: "absolute", left: "-6%", right: "-6%", bottom: 0, height: 120, pointerEvents: "none", background: `linear-gradient(to top, ${color}18, transparent)`, filter: "blur(10px)", animation: "fog 13s ease-in-out infinite" }} />
  );
}

export { C, display, serif, black };
