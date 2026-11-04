import { useEffect, useState } from "react";
import { Corners, Sigil, C, display, serif } from "@/components/ui";
import { ASSET, PROJECT } from "@/lib/theme";
import { startMusic, playClick } from "@/lib/audio";

/* 90s-RPG title screen. Shown once per session before the site. */
export default function Intro({ onEnter }: { onEnter: () => void }) {
  const [sel, setSel] = useState<"yes" | "no">("yes");
  const [taunts, setTaunts] = useState(0);
  const [leaving, setLeaving] = useState(false);

  function accept() {
    playClick();
    startMusic();
    setLeaving(true);
    setTimeout(onEnter, 480);
  }
  function refuse() {
    playClick();
    setTaunts((t) => t + 1);
    setSel("yes");
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
        playClick(); setSel((s) => (s === "yes" ? "no" : "yes")); e.preventDefault();
      } else if (e.key === "Enter" || e.key === " ") {
        (sel === "yes" ? accept : refuse)(); e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel]);

  const flavor = taunts === 0
    ? "An invitation has been inscribed on the chain. The Catacombs of Consensus are open, and the dead are already moving. Do you accept?"
    : taunts === 1
      ? "There is no refusing the Catacombs. The invitation was never a question."
      : "You will enter one way or another. Press YES.";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000, background: C.ash,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 18,
      opacity: leaving ? 0 : 1, transition: "opacity .48s ease",
    }}>
      {/* video backdrop */}
      <video src={ASSET.video} autoPlay muted loop playsInline poster={ASSET.logo}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 42%, rgba(16,13,22,0.55), rgba(8,6,12,0.9))" }} />

      {/* dialog box */}
      <div key={taunts} style={{
        position: "relative", zIndex: 2, width: "100%", maxWidth: 560,
        background: "rgba(11,9,16,0.92)", border: `2px solid ${C.ember}`, padding: "34px clamp(22px,5vw,40px) 30px",
        textAlign: "center", boxShadow: `0 0 0 4px ${C.ash}, 0 0 60px ${C.ember}33`,
        animation: taunts > 0 ? "shake .35s" : "develop .7s ease-out both",
      }}>
        <Corners color={C.ember} size={18} />
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}><Sigil size={64} color={C.ember} spin /></div>

        <p style={{ fontFamily: display, fontSize: "0.72rem", color: C.rune, letterSpacing: "0.04em", margin: "0 0 14px" }}>
          {PROJECT.supply.toLocaleString()} UNDEAD · BITCOIN
        </p>
        <h1 style={{ fontFamily: display, fontSize: "clamp(1.1rem,4vw,1.7rem)", color: C.boneHi, lineHeight: 1.45, margin: "0 0 18px", textShadow: `0 0 20px ${C.ember}55` }}>
          WELCOME TO THE<br />CATACOMBS
        </h1>
        <p style={{ fontFamily: serif, fontSize: "1.06rem", color: C.muted, lineHeight: 1.7, margin: "0 auto 26px", maxWidth: "44ch", minHeight: 72 }}>
          {flavor}
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          {(["yes", "no"] as const).map((opt) => {
            const on = sel === opt;
            return (
              <button key={opt}
                onMouseEnter={() => setSel(opt)}
                onClick={opt === "yes" ? accept : refuse}
                style={{
                  position: "relative", minWidth: 128, padding: "13px 22px",
                  fontFamily: display, fontSize: "0.9rem",
                  color: on ? C.ash : opt === "yes" ? C.ember : C.muted,
                  background: on ? (opt === "yes" ? C.ember : C.oxblood) : "transparent",
                  border: `2px solid ${opt === "yes" ? C.ember : on ? C.oxblood : C.stoneUp}`,
                  cursor: "pointer", transition: "all .12s",
                }}>
                <span style={{ position: "absolute", left: 10, opacity: on ? 1 : 0, transition: "opacity .1s" }}>▶</span>
                {opt === "yes" ? "ACCEPT" : "REFUSE"}
              </button>
            );
          })}
        </div>

        <p style={{ fontFamily: display, fontSize: "0.6rem", color: C.faint, letterSpacing: "0.1em", margin: "22px 0 0", animation: "flick 2.4s infinite" }}>
          ◄ ► MOVE &nbsp;·&nbsp; ↵ SELECT
        </p>
      </div>
    </div>
  );
}
