import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { Btn, Corners, Sigil, C, display, serif, black } from "@/components/ui";
import { checkAllocation, fetchWaitlistPassport, hasSupabase, type AllocTier } from "@/lib/supabase";
import { PassportCanvas, DownloadBtn } from "@/components/Passport";
import type { PassportData, StatusBadge } from "@/lib/passport";
import { isBtcAny, shorten } from "@/lib/utils";

type Result =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "hit"; tier: AllocTier; preview: boolean; pass: PassportData | null }
  | { kind: "miss"; preview: boolean }
  | { kind: "error"; msg: string };

const field: CSSProperties = {
  width: "100%", background: C.slab, color: C.boneHi, border: `1px solid ${C.stoneUp}`,
  padding: "15px 16px", fontSize: "1rem", fontFamily: display, outline: "none", boxSizing: "border-box",
};

/* The passport this browser generated, if it belongs to this address. */
function savedPassFor(address: string): PassportData | null {
  try {
    const o = JSON.parse(localStorage.getItem("uo_wl_v2") || "{}");
    if (o?.pass && o?.address && String(o.address).trim().toLowerCase() === address.trim().toLowerCase()) return o.pass as PassportData;
  } catch {}
  return null;
}

/* Preview-only fallback when no waitlist backend is connected yet —
   lets the team see every result state. Clearly labelled as preview. */
function previewTier(addr: string): AllocTier | null {
  let h = 0;
  for (let i = 0; i < addr.length; i++) h = (h * 31 + addr.charCodeAt(i)) >>> 0;
  const m = h % 3;
  return m === 0 ? "GTD" : m === 1 ? "FCFS" : null;
}

const TIER_META: Record<AllocTier, { title: string; sub: string; color: string }> = {
  GTD:  { title: "Waitlisted · Guaranteed", sub: "You're waitlisted with a guaranteed spot. Your Undead is reserved.", color: C.rune },
  FCFS: { title: "Waitlisted · FCFS", sub: "You're waitlisted, first come first served. Be early when the gate opens, or miss it.", color: C.ember },
};

export default function Check() {
  const [addr, setAddr] = useState("");
  const [res, setRes] = useState<Result>({ kind: "idle" });
  const valid = isBtcAny(addr);
  const live = hasSupabase();

  async function run() {
    if (!valid) return;
    setRes({ kind: "loading" });
    let pass = savedPassFor(addr);
    if (live) {
      const { tier, error } = await checkAllocation(addr);
      if (error) { setRes({ kind: "error", msg: "Couldn't reach the waitlist right now. Try again in a moment." }); return; }
      if (!pass) { const remote = await fetchWaitlistPassport(addr); if (remote) pass = remote as PassportData; }
      setRes(tier ? { kind: "hit", tier, preview: false, pass } : { kind: "miss", preview: false });
    } else {
      await new Promise((r) => setTimeout(r, 450));
      const tier = previewTier(addr.trim().toLowerCase());
      setRes(tier ? { kind: "hit", tier, preview: true, pass } : { kind: "miss", preview: true });
    }
  }

  return (
    <section style={{ position: "relative", minHeight: "calc(100vh - 68px)", padding: "clamp(48px,8vw,90px) clamp(18px,5vw,40px) clamp(56px,8vw,90px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(59,224,123,0.1), transparent 55%)" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Sigil size={48} color={C.rune} /></div>
        <h1 style={{ fontFamily: black, fontWeight: 400, fontSize: "clamp(2rem,6.5vw,3.4rem)", color: C.boneHi, margin: 0, lineHeight: 1.06 }}>Check your waitlist status</h1>
        <p style={{ fontFamily: serif, fontSize: "clamp(1.02rem,2.4vw,1.22rem)", color: C.muted, margin: "16px auto 0", maxWidth: "46ch", lineHeight: 1.6 }}>
          Paste the Bitcoin address you joined with. We'll show your Passport and where you stand, no wallet connection, no signing.
        </p>

        {/* category legend */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", margin: "22px 0 30px" }}>
          <Legend tier="GTD" />
          <Legend tier="FCFS" />
        </div>

        {/* input panel */}
        <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: "rgba(14,26,18,0.72)", padding: "22px clamp(16px,4vw,26px)", textAlign: "left" }}>
          <Corners color={C.rune} size={15} />
          <label style={{ fontFamily: display, fontWeight: 600, fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.08em", color: C.boneHi }}>Your Bitcoin address</label>
          <input value={addr} style={{ ...field, marginTop: 10 }} placeholder="bc1p…   /   bc1q…   /   1…   /   3…" spellCheck={false}
            onChange={(e) => { setAddr(e.target.value); setRes({ kind: "idle" }); }}
            onKeyDown={(e) => e.key === "Enter" && run()}
            onFocus={(e) => (e.target.style.borderColor = C.rune)} onBlur={(e) => (e.target.style.borderColor = C.stoneUp)} />
          {addr && !valid && <p style={{ fontFamily: serif, fontSize: "0.9rem", color: C.oxblood, margin: "8px 0 0" }}>That doesn't look like a valid Bitcoin address.</p>}
          <div style={{ marginTop: 14 }}>
            <Btn full onClick={run}>{res.kind === "loading" ? "Checking the ledger…" : "Check status"}</Btn>
          </div>
          {!live && <p style={{ fontFamily: serif, fontSize: "0.82rem", color: C.faint, margin: "12px 0 0", lineHeight: 1.5 }}>Preview mode — the waitlist isn't connected yet, so the status shown is an example.</p>}
        </div>

        {/* result */}
        <div style={{ marginTop: 20 }}>
          {res.kind === "hit" && <ResultCard tier={res.tier} addr={addr} preview={res.preview} pass={res.pass} />}
          {res.kind === "miss" && (
            <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.stone, padding: "24px 22px", textAlign: "center" }}>
              <Corners color={C.faint} size={14} />
              {res.preview && <PreviewFlag />}
              <p style={{ fontFamily: black, fontSize: "1.5rem", color: C.bone, margin: "0 0 8px" }}>Not waitlisted yet</p>
              <p style={{ fontFamily: serif, fontSize: "1rem", color: C.muted, lineHeight: 1.6, margin: "0 0 16px" }}>
                {shorten(addr, 8, 6)} isn't on the waitlist yet. It's still filling, complete the rites to secure your spot.
              </p>
              <Link href="/whitelist"><Btn tone="ghost" color={C.rune}>Join the waitlist</Btn></Link>
            </div>
          )}
          {res.kind === "error" && (
            <p style={{ fontFamily: serif, fontSize: "1rem", color: C.oxblood, margin: 0 }}>{res.msg}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Legend({ tier }: { tier: AllocTier }) {
  const m = TIER_META[tier];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: display, fontSize: "0.72rem", letterSpacing: "0.04em", color: C.muted, border: `1px solid ${C.stoneUp}`, padding: "7px 12px" }}>
      <span style={{ width: 8, height: 8, background: m.color, boxShadow: `0 0 8px ${m.color}` }} />
      <strong style={{ color: m.color, fontWeight: 700 }}>{tier}</strong> {tier === "GTD" ? "Guaranteed" : "First come, first served"}
    </span>
  );
}

function PreviewFlag() {
  return (
    <div style={{ display: "inline-block", fontFamily: display, fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.ember, border: `1px solid ${C.ember}55`, padding: "3px 9px", marginBottom: 14 }}>
      Preview result
    </div>
  );
}

function ResultCard({ tier, addr, preview, pass }: { tier: AllocTier; addr: string; preview: boolean; pass: PassportData | null }) {
  const m = TIER_META[tier];
  const badge: StatusBadge = { label: `Waitlisted · ${tier}`, color: m.color };
  return (
    <div style={{ position: "relative", border: `1px solid ${m.color}`, background: C.stone, padding: "24px clamp(16px,4vw,24px) 28px", textAlign: "center", boxShadow: `0 0 50px ${m.color}22` }}>
      <Corners color={m.color} size={16} />
      {preview && <PreviewFlag />}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: display, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: m.color, marginBottom: 14 }}>
        <span style={{ width: 10, height: 10, background: m.color, boxShadow: `0 0 12px ${m.color}`, animation: "flick 2.2s infinite" }} />
        Waitlisted · {tier}
      </div>

      {/* their actual passport, stamped with the status */}
      {pass ? (
        <div style={{ marginBottom: 18 }}>
          <PassportCanvas pass={pass} status={badge} />
          <div style={{ maxWidth: 300, margin: "14px auto 0" }}><DownloadBtn pass={pass} status={badge} /></div>
        </div>
      ) : (
        <p style={{ fontFamily: black, fontSize: "clamp(1.7rem,5.5vw,2.4rem)", color: C.boneHi, margin: "0 0 10px", lineHeight: 1.05 }}>{m.title}</p>
      )}

      <p style={{ fontFamily: serif, fontSize: "1.04rem", color: C.muted, lineHeight: 1.65, margin: "0 0 10px", maxWidth: "42ch", marginInline: "auto" }}>{m.sub}</p>
      <p style={{ fontFamily: display, fontSize: "0.78rem", color: C.faint, margin: "0 0 20px" }}>{shorten(addr, 8, 6)}</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {!pass && <Link href="/whitelist"><Btn>Get your passport</Btn></Link>}
        <Link href="/crypts"><Btn tone="ghost" color={m.color}>Enter the Catacombs</Btn></Link>
      </div>
    </div>
  );
}
