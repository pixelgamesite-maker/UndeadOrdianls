import { C } from "@/lib/theme";

/* One disciplined motion: a verdigris scan line that passes down the
   hero art once on load, as if the relic is being read off the chain.
   No ambient particles, no click sparks — the grain, vignette and type
   carry the rest. */
export function HeroScan({ color = C.rune }: { color?: string }) {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: 0, right: 0, height: "14%",
        background: `linear-gradient(to bottom, transparent, ${color}2E, transparent)`,
        borderTop: `1px solid ${color}66`,
        animation: "scanpass 2.6s cubic-bezier(.4,0,.2,1) 0.3s 1 both",
      }} />
    </div>
  );
}
