import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { C, display, body, mono } from "@/lib/theme";

/* ── Chamfered pixel-cut corner — the signature button shape. The
   notches are what read as "game UI" instead of a rounded default. ── */
export const notch = (cut: number) =>
  `polygon(${cut}px 0, 100% 0, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, 0 100%, 0 ${cut}px)`;

/* ── Reveal: fade + rise as it scrolls into view. ── */
export function Reveal({
  children, delay = 0, y = 20, style,
}: { children: ReactNode; delay?: number; y?: number; style?: CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── Section wrapper ── */
export function Section({
  children, tone = "void", id, style,
}: { children: ReactNode; tone?: "void" | "crypt"; id?: string; style?: CSSProperties }) {
  return (
    <section id={id} style={{
      background: tone === "void" ? C.void : C.crypt,
      padding: "clamp(60px,9vw,120px) 0",
      position: "relative",
      ...style,
    }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 clamp(18px,5vw,40px)" }}>
        {children}
      </div>
    </section>
  );
}

/* ── Eyebrow label (small terminal-style kicker) ── */
export function Kicker({ children, color = C.btc }: { children: ReactNode; color?: string }) {
  return (
    <p style={{
      fontFamily: mono, fontSize: "1.05rem", letterSpacing: "0.35em",
      textTransform: "uppercase", color, margin: "0 0 14px",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ width: 26, height: 2, background: color, display: "inline-block" }} />
      {children}
    </p>
  );
}

export function Heading({
  children, size = "md", style,
}: { children: ReactNode; size?: "sm" | "md" | "lg"; style?: CSSProperties }) {
  const fs = size === "lg" ? "clamp(1.5rem,4.4vw,2.6rem)"
    : size === "md" ? "clamp(1.15rem,3.2vw,1.9rem)"
    : "clamp(0.95rem,2.4vw,1.25rem)";
  return (
    <h2 style={{
      fontFamily: display, fontWeight: 400, color: C.bone,
      fontSize: fs, lineHeight: 1.35, margin: "0 0 20px",
      letterSpacing: "0.01em", ...style,
    }}>{children}</h2>
  );
}

/* ── Button ── solid (ice) or ghost. Chamfered corners + glow. ── */
export function Btn({
  children, onClick, href, tone = "solid", color = C.btc, full = false, small = false,
}: {
  children: ReactNode; onClick?: () => void; href?: string;
  tone?: "solid" | "ghost"; color?: string; full?: boolean; small?: boolean;
}) {
  color = color === C.ice ? C.btc : color;
  const solid = tone === "solid";
  const cut = small ? 7 : 10;
  const style: CSSProperties = {
    display: full ? "block" : "inline-block",
    width: full ? "100%" : undefined,
    fontFamily: display, fontWeight: 400,
    fontSize: small ? "0.6rem" : "clamp(0.6rem,1.5vw,0.72rem)",
    letterSpacing: "0.04em", lineHeight: 1.5,
    color: solid ? C.void : color,
    background: solid ? color : "transparent",
    border: `2px solid ${color}`,
    clipPath: notch(cut),
    padding: small ? "11px 16px" : "16px 26px",
    cursor: "pointer", textAlign: "center",
    transition: "background .16s, color .16s, box-shadow .16s, transform .16s",
    boxShadow: solid ? `0 0 26px ${color}55` : "none",
    textTransform: "uppercase",
  };
  const over = (el: HTMLElement) => {
    el.style.transform = "translateY(-2px)";
    if (solid) el.style.boxShadow = `0 0 40px ${color}99`;
    else { el.style.background = color; el.style.color = C.void; el.style.boxShadow = `0 0 30px ${color}66`; }
  };
  const out = (el: HTMLElement) => {
    el.style.transform = "translateY(0)";
    if (solid) el.style.boxShadow = `0 0 26px ${color}55`;
    else { el.style.background = "transparent"; el.style.color = color; el.style.boxShadow = "none"; }
  };
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        style={style}
        onMouseEnter={(e) => over(e.currentTarget)}
        onMouseLeave={(e) => out(e.currentTarget)}>{children}</a>
    );
  }
  return (
    <button onClick={onClick} style={style}
      onMouseEnter={(e) => over(e.currentTarget)}
      onMouseLeave={(e) => out(e.currentTarget)}>{children}</button>
  );
}

/* ── Panel — a crypt slab with a cold border and inner glow. ── */
export function Panel({
  children, color = C.line, glow, style, pad = 22,
}: { children: ReactNode; color?: string; glow?: string; style?: CSSProperties; pad?: number }) {
  return (
    <div style={{
      background: C.crypt,
      border: `2px solid ${color}`,
      boxShadow: glow ? `0 0 30px ${glow}22, inset 0 0 40px rgba(0,0,0,0.5)` : "inset 0 0 40px rgba(0,0,0,0.5)",
      padding: pad,
      position: "relative",
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── GlitchText — RGB-split wordmark. ── */
export function GlitchText({
  children, style, size = "clamp(2.1rem,8vw,5rem)",
}: { children: string; style?: CSSProperties; size?: string }) {
  const base: CSSProperties = {
    fontFamily: display, color: C.bone, fontSize: size, lineHeight: 1.1,
    position: "relative", display: "inline-block", letterSpacing: "0.01em",
    animation: "glitch-x 5s infinite steps(1)",
    ...style,
  };
  const ghost = (color: string, dx: number): CSSProperties => ({
    position: "absolute", inset: 0, color, opacity: 0.7,
    transform: `translateX(${dx}px)`, mixBlendMode: "screen",
    pointerEvents: "none", clipPath: "inset(0 0 0 0)",
  });
  return (
    <span style={base} aria-label={children}>
      <span aria-hidden style={ghost(C.ice, -2)}>{children}</span>
      <span aria-hidden style={ghost(C.ember, 2)}>{children}</span>
      <span style={{ position: "relative" }}>{children}</span>
    </span>
  );
}

/* ── LiveDot — blinking "LIVE" indicator. ── */
export function LiveDot({ label = "LIVE", color = C.ember }: { label?: string; color?: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: mono, fontSize: "1rem", letterSpacing: "0.2em", color }}>
      <span style={{ width: 9, height: 9, background: color, borderRadius: 999, animation: "blink 1.1s infinite", boxShadow: `0 0 10px ${color}` }} />
      {label}
    </span>
  );
}

export function Pill({ children, color = C.ice }: { children: ReactNode; color?: string }) {
  return (
    <span style={{
      fontFamily: mono, fontSize: "0.95rem", letterSpacing: "0.12em",
      textTransform: "uppercase", color, border: `1px solid ${color}55`,
      padding: "3px 10px", background: `${color}11`, whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

export { C, display, body, mono };
