import { useEffect, useRef } from "react";
import { C } from "@/lib/theme";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ──────────────────────────────────────────────────────────────
   AshField — ambient pixel-ash drifting upward. Fills whatever
   positioned ancestor it's dropped into. Cold cyan embers with the
   occasional hot one, drawn as squares so they read as pixels.
   ────────────────────────────────────────────────────────────── */
type Mote = {
  x: number; y: number; vx: number; vy: number;
  size: number; life: number; max: number; flicker: number; hot: boolean;
};

export function AshField({
  density = 26,
  hot = C.ember,
  cold = C.ice,
}: { density?: number; hot?: string; cold?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced()) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const parent = canvas?.parentElement;
    if (!canvas || !ctx || !parent) return;

    let w = 0, h = 0, raf = 0;
    let motes: Mote[] = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent!.clientWidth;
      h = parent!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.imageSmoothingEnabled = false;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const spawn = (seed = false): Mote => ({
      x: Math.random() * w,
      y: seed ? Math.random() * h : h + 8,
      vx: (Math.random() - 0.5) * 0.24,
      vy: -(0.12 + Math.random() * 0.3),
      size: 1 + Math.floor(Math.random() * 2),
      life: 0,
      max: 300 + Math.random() * 340,
      flicker: Math.random() * Math.PI * 2,
      hot: Math.random() > 0.82,
    });

    motes = Array.from({ length: density }, () => spawn(true));

    function tick() {
      ctx!.clearRect(0, 0, w, h);
      for (const p of motes) {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.flicker += 0.05;
        const t = p.life / p.max;
        const fade = t < 0.15 ? t / 0.15 : t > 0.82 ? (1 - t) / 0.18 : 1;
        const flick = 0.5 + Math.sin(p.flicker) * 0.34;
        ctx!.globalAlpha = Math.max(0, fade * flick * 0.6);
        ctx!.fillStyle = p.hot ? hot : cold;
        ctx!.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }
      ctx!.globalAlpha = 1;
      motes = motes.filter((p) => p.life < p.max && p.y > -12);
      while (motes.length < density) motes.push(spawn());
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [density, hot, cold]);

  return (
    <canvas ref={ref} aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
  );
}

/* ──────────────────────────────────────────────────────────────
   SparkField — a burst of pixel sparks on every click, fixed over
   the whole viewport. Cyan sparks that cool to ember as they fall.
   Mounted once at the app root. Rewards interaction everywhere.
   ────────────────────────────────────────────────────────────── */
type Spark = {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; size: number; hot: boolean;
};

export function SparkField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  const running = useRef(false);

  useEffect(() => {
    if (reduced()) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const alive: Spark[] = [];
      for (const s of sparks.current) {
        s.life += 1;
        s.vy += 0.14;      // gravity
        s.vx *= 0.985;     // drag
        s.x += s.vx;
        s.y += s.vy;
        const t = s.life / s.max;
        if (t >= 1) continue;
        ctx.globalAlpha = 1 - t * t;
        ctx.fillStyle = s.hot && t < 0.5 ? C.ice : C.ember;
        const px = Math.round(s.size);
        ctx.fillRect(Math.round(s.x), Math.round(s.y), px, px);
        alive.push(s);
      }
      ctx.globalAlpha = 1;
      sparks.current = alive;
      if (alive.length) requestAnimationFrame(tick);
      else running.current = false;
    };

    const burst = (e: PointerEvent) => {
      const n = 16 + Math.floor(Math.random() * 10);
      for (let i = 0; i < n; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.5;
        const speed = 1.2 + Math.random() * 4;
        sparks.current.push({
          x: e.clientX, y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          max: 30 + Math.random() * 44,
          size: 2 + Math.floor(Math.random() * 3),
          hot: Math.random() > 0.45,
        });
      }
      if (sparks.current.length > 300) sparks.current.splice(0, sparks.current.length - 300);
      if (!running.current) { running.current = true; requestAnimationFrame(tick); }
    };

    window.addEventListener("pointerdown", burst);
    return () => {
      window.removeEventListener("pointerdown", burst);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={ref} aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", mixBlendMode: "screen" }} />
  );
}
