import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Section, Kicker, Btn, Panel, GlitchText, Pill, LiveDot, notch,
  C, display, body, mono,
} from "@/components/ui";
import { AshField } from "@/components/Effects";
import { COMMUNITIES, CLAIM_TOTAL, SHOW_REMAINING, X_HANDLE } from "@/lib/theme";
import { claimSpot, countClaims, hasSupabase } from "@/lib/supabase";
import { isValidAddress } from "@/lib/utils";

const inputStyle: CSSProperties = {
  width: "100%", background: C.void, color: C.bone,
  border: `2px solid ${C.tomb}`, padding: "14px 15px",
  fontSize: "1.1rem", fontFamily: mono, outline: "none",
  boxSizing: "border-box", letterSpacing: "0.03em",
};

/* Live demand counter. Per the campaign: we show how many have claimed
   (the heat), never how many remain — unless SHOW_REMAINING is flipped. */
function DemandCounter({ count }: { count: number | null }) {
  const pct = count == null ? 0 : Math.min(100, (count / CLAIM_TOTAL) * 100);
  return (
    <Panel color={C.tombUp} glow={C.ember} pad={20} style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <LiveDot label="HORDE GROWING" color={C.ember} />
      </div>
      <p style={{ fontFamily: display, fontSize: "clamp(1.4rem,5vw,2.4rem)", color: C.ice, margin: "0 0 6px", textShadow: `0 0 24px ${C.ice}66` }}>
        {count == null ? "— — —" : count.toLocaleString()}
      </p>
      <p style={{ fontFamily: mono, fontSize: "1.1rem", color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
        Undead have claimed their spot
      </p>
      {SHOW_REMAINING && count != null && (
        <>
          <div style={{ height: 10, background: C.void, border: `1px solid ${C.tomb}`, marginTop: 16 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: C.ember, boxShadow: `0 0 14px ${C.ember}` }} />
          </div>
          <p style={{ fontFamily: mono, fontSize: "1rem", color: C.faint, margin: "8px 0 0", letterSpacing: "0.1em" }}>
            {(CLAIM_TOTAL - count).toLocaleString()} remaining
          </p>
        </>
      )}
    </Panel>
  );
}

export default function Verify() {
  const [count, setCount] = useState<number | null>(null);
  const [kind, setKind] = useState<"ordinals" | "eth">("ordinals");
  const [community, setCommunity] = useState<string>("");
  const [addr, setAddr] = useState("");
  const [busy, setBusy] = useState(false);
  const [spot, setSpot] = useState<number | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => { if (hasSupabase()) countClaims().then(setCount); }, []);

  const list = COMMUNITIES.filter((c) => c.kind === kind);
  const ready = !!community && isValidAddress(addr);

  async function verify() {
    setErr("");
    if (!community) { setErr("Pick your community first."); return; }
    if (!isValidAddress(addr)) { setErr("Enter a valid Bitcoin or ETH address."); return; }
    if (!hasSupabase()) { setErr("The verification backend isn't configured yet. (Set VITE_SUPABASE_URL / _ANON_KEY and deploy the claim-spot function.)"); return; }
    setBusy(true);
    const res = await claimSpot(addr, community);
    setBusy(false);
    if (res.ok) {
      setSpot(res.spot);
      setCount((c) => (c == null ? c : c + 1));
    } else {
      setErr(res.error);
    }
  }

  return (
    <>
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(66px,10vw,110px) clamp(18px,5vw,40px) clamp(28px,5vw,44px)", textAlign: "center" }}>
        <AshField density={24} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 720, margin: "0 auto" }}>
          <Pill color={C.gold}>NO WALLET CONNECT · NO SIGNING · EVER</Pill>
          <div style={{ marginTop: 16 }}>
            <GlitchText size="clamp(1.4rem,6vw,2.8rem)">PROVE YOUR HOLDINGS</GlitchText>
          </div>
          <p style={{ fontFamily: body, fontSize: "1.02rem", color: C.muted, margin: "20px auto 0", maxWidth: "56ch", lineHeight: 1.75 }}>
            Hold an OG Ordinals or ETH NFT? Verify it for a priority spot. We check your public address against the
            holder snapshot — <strong style={{ color: C.bone }}>you never connect a wallet, sign a transaction, or share a seed phrase.</strong>
          </p>
        </div>
      </section>

      <Section tone="crypt" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "grid", gap: 18 }}>
          <DemandCounter count={count} />

          {spot != null ? (
            <Panel color={C.ice} glow={C.ice} pad={28} style={{ textAlign: "center" }}>
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                <div style={{ width: 64, height: 64, margin: "0 auto 18px", background: C.ice, display: "grid", placeItems: "center", fontSize: "1.8rem", color: C.void, boxShadow: `0 0 40px ${C.ice}`, clipPath: notch(11) }}>✓</div>
                <h2 style={{ fontFamily: display, fontSize: "0.9rem", color: C.bone, margin: "0 0 10px" }}>SPOT SECURED</h2>
                <p style={{ fontFamily: display, fontSize: "clamp(1.6rem,7vw,3rem)", color: C.ice, margin: "0 0 10px", textShadow: `0 0 26px ${C.ice}88` }}>
                  #{String(spot).padStart(4, "0")}
                </p>
                <p style={{ fontFamily: body, fontSize: "0.98rem", color: C.muted, lineHeight: 1.75, margin: 0 }}>
                  Your address is verified and your priority spot is locked. Mint details are announced on {X_HANDLE}.
                  Screenshot this — your spot number is your proof.
                </p>
                <div style={{ marginTop: 22 }}>
                  <Link href="/collection"><Btn tone="ghost" color={C.bone} small>Meet the Undead →</Btn></Link>
                </div>
              </motion.div>
            </Panel>
          ) : (
            <Panel color={C.tombUp} pad={24}>
              {/* kind toggle */}
              <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                {(["ordinals", "eth"] as const).map((k) => (
                  <button key={k} onClick={() => { setKind(k); setCommunity(""); }} style={{
                    flex: 1, padding: "12px", background: kind === k ? C.ice : "transparent",
                    color: kind === k ? C.void : C.muted, border: `2px solid ${kind === k ? C.ice : C.tomb}`,
                    clipPath: notch(8), fontFamily: mono, fontSize: "1.05rem", letterSpacing: "0.1em",
                    textTransform: "uppercase", cursor: "pointer", transition: "all .15s",
                  }}>
                    {k === "ordinals" ? "Ordinals" : "ETH Collections"}
                  </button>
                ))}
              </div>

              <p style={{ fontFamily: mono, fontSize: "1.05rem", color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px" }}>
                1 · Your community
              </p>
              <div style={{ display: "grid", gap: 7, gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", marginBottom: 22 }}>
                {list.map((c) => {
                  const on = community === c.key;
                  return (
                    <button key={c.key} onClick={() => setCommunity(c.key)} style={{
                      padding: "11px 10px", background: on ? `${C.ice}18` : C.void,
                      color: on ? C.ice : C.muted, border: `2px solid ${on ? C.ice : C.tomb}`,
                      fontFamily: mono, fontSize: "1rem", letterSpacing: "0.03em", cursor: "pointer",
                      textAlign: "left", transition: "all .15s", lineHeight: 1.3,
                    }}
                      onMouseEnter={(e) => { if (!on) e.currentTarget.style.borderColor = C.tombUp; }}
                      onMouseLeave={(e) => { if (!on) e.currentTarget.style.borderColor = C.tomb; }}>
                      {on ? "◆ " : ""}{c.name}
                    </button>
                  );
                })}
              </div>

              <p style={{ fontFamily: mono, fontSize: "1.05rem", color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px" }}>
                2 · Your {kind === "ordinals" ? "Bitcoin" : "ETH"} address
              </p>
              <input value={addr} style={inputStyle}
                placeholder={kind === "ordinals" ? "bc1p…" : "0x…"}
                onChange={(e) => { setAddr(e.target.value); setErr(""); }}
                onKeyDown={(e) => e.key === "Enter" && ready && verify()}
                onFocus={(e) => (e.target.style.borderColor = C.ice)}
                onBlur={(e) => (e.target.style.borderColor = C.tomb)} />
              <p style={{ fontFamily: body, fontSize: "0.84rem", color: C.faint, margin: "9px 0 0", lineHeight: 1.55 }}>
                The public address that holds your {kind === "ordinals" ? "inscription" : "NFT"}. Read-only — it never leaves your clipboard as anything but text.
              </p>

              {err && <p style={{ fontFamily: body, color: C.ember, fontSize: "0.92rem", margin: "14px 0 0", lineHeight: 1.5 }}>{err}</p>}

              <button onClick={verify} disabled={!ready || busy} style={{
                width: "100%", marginTop: 18, padding: "17px",
                background: ready ? C.ice : "transparent", color: ready ? C.void : C.faint,
                border: `2px solid ${ready ? C.ice : C.tomb}`, clipPath: notch(10),
                fontFamily: display, fontSize: "0.72rem", letterSpacing: "0.04em", textTransform: "uppercase",
                cursor: ready && !busy ? "pointer" : "not-allowed",
                boxShadow: ready ? `0 0 28px ${C.ice}66` : "none",
                transition: "all .2s",
              }}>
                {busy ? "Checking the snapshot…" : "Verify & claim spot"}
              </button>
            </Panel>
          )}

          <p style={{ fontFamily: body, fontSize: "0.86rem", color: C.faint, textAlign: "center", margin: "4px auto 0", maxWidth: "52ch", lineHeight: 1.6 }}>
            Not holding an OG NFT? You can still <Link href="/raffle" style={{ color: C.ice }}>enter the raffle</Link> by posting about the Undead.
          </p>
        </div>
      </Section>
    </>
  );
}
