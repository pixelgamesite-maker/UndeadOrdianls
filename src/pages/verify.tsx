import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Section, Btn, Wordmark, Tag, Sigil, Live, Corners,
  C, display, serif,
} from "@/components/ui";
import { COMMUNITIES, CLAIM_TOTAL, SHOW_REMAINING, X_HANDLE } from "@/lib/theme";
import { claimSpot, countClaims, hasSupabase } from "@/lib/supabase";
import { isValidAddress } from "@/lib/utils";

const field: CSSProperties = {
  width: "100%", background: C.slab, color: C.boneHi, border: `1px solid ${C.stoneUp}`,
  padding: "14px 15px", fontSize: "0.92rem", fontFamily: display, outline: "none",
  boxSizing: "border-box", letterSpacing: "0.01em",
};

function DemandCounter({ count }: { count: number | null }) {
  const pct = count == null ? 0 : Math.min(100, (count / CLAIM_TOTAL) * 100);
  return (
    <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.stone, padding: 24, textAlign: "center" }}>
      <Corners color={C.ember} />
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><Live label="The horde is growing" /></div>
      <p style={{ fontFamily: display, fontSize: "clamp(1.6rem,6vw,2.8rem)", color: C.ember, margin: "0 0 8px" }}>
        {count == null ? "— — —" : count.toLocaleString()}
      </p>
      <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1.1rem", color: C.muted, margin: 0 }}>
        undead have claimed their spot
      </p>
      {SHOW_REMAINING && count != null && (
        <>
          <div style={{ height: 8, background: C.slab, border: `1px solid ${C.stoneUp}`, marginTop: 16 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: C.ember }} />
          </div>
          <p style={{ fontFamily: display, fontSize: "0.72rem", color: C.faint, margin: "9px 0 0" }}>{(CLAIM_TOTAL - count).toLocaleString()} remaining</p>
        </>
      )}
    </div>
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

  async function verify() {
    setErr("");
    if (!community) { setErr("Choose your community first."); return; }
    if (!isValidAddress(addr)) { setErr("Enter a valid Bitcoin or ETH address."); return; }
    if (!hasSupabase()) { setErr("The verification backend isn't configured yet (set the Supabase vars and deploy the claim-spot function)."); return; }
    setBusy(true);
    const res = await claimSpot(addr, community);
    setBusy(false);
    if (res.ok) { setSpot(res.spot); setCount((c) => (c == null ? c : c + 1)); }
    else setErr(res.error);
  }

  return (
    <>
      <section style={{ padding: "clamp(50px,8vw,90px) clamp(18px,5vw,44px) clamp(20px,4vw,34px)", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", marginBottom: 16 }}><Tag color={C.rune}>No wallet connect, no signing, ever</Tag></div>
          <Wordmark size="clamp(1.5rem,6vw,2.8rem)">PROVE YOUR HOLDINGS</Wordmark>
          <p className="standfirst" style={{ fontFamily: serif, fontSize: "1.12rem", color: C.muted, margin: "18px auto 0", maxWidth: "54ch", lineHeight: 1.6 }}>
            Hold an OG Ordinals or ETH NFT? Verify it for a priority spot. We check your public address against the holder
            snapshot — you never connect a wallet, sign a transaction, or share a seed phrase.
          </p>
        </div>
      </section>

      <Section tone="slab" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 620, margin: "0 auto", display: "grid", gap: 18 }}>
          <DemandCounter count={count} />

          {spot != null ? (
            <div style={{ position: "relative", border: `1px solid ${C.ember}`, background: C.stone, padding: 30, textAlign: "center" }}>
              <Corners color={C.ember} size={16} />
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}><Sigil size={60} color={C.ember} /></div>
                <h2 style={{ fontFamily: display, fontSize: "0.92rem", color: C.boneHi, margin: "0 0 12px" }}>Spot secured</h2>
                <Wordmark size="clamp(1.8rem,8vw,3.2rem)">{`#${String(spot).padStart(4, "0")}`}</Wordmark>
                <p style={{ fontFamily: serif, fontSize: "1.05rem", color: C.muted, lineHeight: 1.75, margin: "16px 0 0" }}>
                  Your address is verified and your priority spot is locked. Mint details are announced on {X_HANDLE}.
                  Screenshot this — your spot number is your proof.
                </p>
                <div style={{ marginTop: 22 }}><Link href="/collection"><Btn tone="bone" small>Meet the undead</Btn></Link></div>
              </motion.div>
            </div>
          ) : (
            <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.stone, padding: "26px clamp(18px,4vw,26px)" }}>
              <Corners color={C.rune} />
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {(["ordinals", "eth"] as const).map((k) => (
                  <button key={k} onClick={() => { setKind(k); setCommunity(""); }} style={{
                    flex: 1, padding: "12px", background: kind === k ? C.ember : "transparent",
                    color: kind === k ? C.ash : C.muted, border: `1px solid ${kind === k ? C.ember : C.stoneUp}`,
                    fontFamily: display, fontSize: "0.74rem", cursor: "pointer", transition: "all .15s",
                  }}>{k === "ordinals" ? "Ordinals" : "ETH collections"}</button>
                ))}
              </div>

              <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1rem", color: C.faint, margin: "0 0 11px" }}>Your community</p>
              <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill,minmax(132px,1fr))", marginBottom: 22 }}>
                {list.map((c) => {
                  const on = community === c.key;
                  return (
                    <button key={c.key} onClick={() => setCommunity(c.key)} style={{
                      position: "relative", padding: "12px 11px", background: on ? C.slab : "transparent",
                      color: on ? C.ember : C.muted, border: `1px solid ${on ? C.ember : C.stoneUp}`,
                      fontFamily: display, fontSize: "0.68rem", cursor: "pointer", textAlign: "left", lineHeight: 1.35, transition: "all .15s",
                    }}
                      onMouseEnter={(e) => { if (!on) e.currentTarget.style.borderColor = C.rune; }}
                      onMouseLeave={(e) => { if (!on) e.currentTarget.style.borderColor = C.stoneUp; }}>
                      {c.name}
                    </button>
                  );
                })}
              </div>

              <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1rem", color: C.faint, margin: "0 0 11px" }}>
                Your {kind === "ordinals" ? "Bitcoin" : "ETH"} address
              </p>
              <input value={addr} style={field} placeholder={kind === "ordinals" ? "bc1p…" : "0x…"}
                onChange={(e) => { setAddr(e.target.value); setErr(""); }}
                onKeyDown={(e) => e.key === "Enter" && verify()}
                onFocus={(e) => (e.target.style.borderColor = C.ember)} onBlur={(e) => (e.target.style.borderColor = C.stoneUp)} />
              <p style={{ fontFamily: serif, fontSize: "0.9rem", color: C.faint, margin: "10px 0 0", lineHeight: 1.55 }}>
                The public address that holds your {kind === "ordinals" ? "inscription" : "NFT"}. It stays read-only text — nothing to connect or sign.
              </p>

              {err && <p style={{ fontFamily: serif, color: C.oxblood, fontSize: "0.98rem", margin: "14px 0 0", lineHeight: 1.5 }}>{err}</p>}

              <div style={{ marginTop: 18 }}>
                <Btn full onClick={verify}>{busy ? "Reading the snapshot…" : "Verify and claim spot"}</Btn>
              </div>
            </div>
          )}

          <p style={{ fontFamily: serif, fontSize: "0.96rem", color: C.faint, textAlign: "center", margin: "2px auto 0", maxWidth: "52ch", lineHeight: 1.6 }}>
            Not holding an OG NFT? You can still <Link href="/raffle" style={{ color: C.rune }}>enter the raffle</Link> by posting about the Undead.
          </p>
        </div>
      </Section>
    </>
  );
}
