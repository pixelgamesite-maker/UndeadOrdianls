import { useEffect, useState, type CSSProperties } from "react";
import { Link, useLocation } from "wouter";
import { Btn, Wordmark, Sigil, Corners, Seq, C, display, serif, black } from "@/components/ui";
import { ASSET, X_URL, X_HANDLE, PINNED_URL, ACTIVE_PHASE, WHITELIST_LIVE } from "@/lib/theme";
import { submitApplication, hasSupabase } from "@/lib/supabase";
import { isValidAddress, isXLink } from "@/lib/utils";

type Stage = "intro" | "form" | "open" | "soon";

const field: CSSProperties = {
  width: "100%", background: C.slab, color: C.boneHi, border: `1px solid ${C.stoneUp}`,
  padding: "13px 14px", fontSize: "1rem", fontFamily: display, outline: "none", boxSizing: "border-box",
};

const REQS = ["Follow on X", "Like and quote the pin", "Comment, tag three friends", "Drop your mint address"];

function Scene({ img, children }: { img: string; children: React.ReactNode }) {
  return (
    <section style={{ position: "relative", minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px clamp(18px,5vw,40px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, rgba(8,6,12,0.4), rgba(8,6,12,0.82))" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 560, textAlign: "center" }}>{children}</div>
    </section>
  );
}

function StatusDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: display, fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", color }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: color, boxShadow: `0 0 10px ${color}`, animation: "flick 2.2s infinite" }} />
      {label}
    </span>
  );
}

function Act({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ marginTop: 10, width: "100%", background: "transparent", color: C.rune, border: `1px solid ${C.rune}`, padding: "11px", fontFamily: display, fontWeight: 600, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", transition: "background .15s, color .15s" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = C.rune; e.currentTarget.style.color = C.ash; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.rune; }}>
      {children}
    </button>
  );
}

function Step({ n, title, hint, done, locked, children }: { n: number; title: string; hint: string; done: boolean; locked: boolean; children?: React.ReactNode }) {
  return (
    <div style={{ position: "relative", border: `1px solid ${done ? C.ember : locked ? C.lineLo : C.stoneUp}`, background: locked ? "transparent" : C.stone, padding: "15px 15px 13px", marginBottom: 10, opacity: locked ? 0.45 : 1, textAlign: "left", transition: "border-color .25s, opacity .25s" }}>
      {!locked && <Corners color={done ? C.ember : C.rune} />}
      <div style={{ display: "flex", gap: 11, alignItems: "baseline", marginBottom: locked ? 0 : 10 }}>
        <Seq color={done ? C.ember : C.muted}>{String(n).padStart(2, "0")}</Seq>
        <div>
          <p style={{ fontFamily: display, fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.04em", margin: 0, color: C.boneHi }}>{title}</p>
          <p style={{ fontFamily: serif, fontSize: "0.98rem", color: C.muted, margin: "5px 0 0", lineHeight: 1.5 }}>{hint}</p>
        </div>
      </div>
      {!locked && children}
    </div>
  );
}

function LinkStep({ value, onChange, onSave, saved, placeholder }: { value: string; onChange: (v: string) => void; onSave: () => void; saved: boolean; placeholder: string }) {
  return (
    <>
      <Act onClick={() => window.open(PINNED_URL, "_blank", "noopener")}>Open the pinned post</Act>
      <input value={value} style={{ ...field, marginTop: 10 }} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && isXLink(value) && onSave()}
        onFocus={(e) => (e.target.style.borderColor = C.ember)} onBlur={(e) => (e.target.style.borderColor = C.stoneUp)} />
      {value && !isXLink(value) && <p style={{ fontFamily: serif, fontSize: "0.92rem", color: C.oxblood, margin: "7px 0 0" }}>That needs to be a real x.com link.</p>}
      {isXLink(value) && !saved && <Act onClick={onSave}>Save link</Act>}
    </>
  );
}

export default function Whitelist() {
  const [, navigate] = useLocation();
  // The application is the default experience whenever WHITELIST_LIVE is on.
  // "soon" only shows if the owner explicitly turns registration off.
  const registered = (() => { try { return localStorage.getItem("uo_wl_sent") === "true"; } catch { return false; } })();
  const [stage, setStage] = useState<Stage>(registered ? "open" : WHITELIST_LIVE ? "intro" : "soon");

  const [handle, setHandle] = useState(""); const [handleOk, setHandleOk] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [quoteLink, setQuoteLink] = useState(""); const [quoteOk, setQuoteOk] = useState(false);
  const [commentLink, setCommentLink] = useState(""); const [commentOk, setCommentOk] = useState(false);
  const [addr, setAddr] = useState(""); const [addrOk, setAddrOk] = useState(false);
  const [sending, setSending] = useState(false); const [err, setErr] = useState("");

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("uo_wl") ?? "{}");
      setHandle(s.handle ?? ""); setQuoteLink(s.quoteLink ?? ""); setCommentLink(s.commentLink ?? ""); setAddr(s.addr ?? ""); setFollowed(!!s.followed);
    } catch { /* first visit */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem("uo_wl", JSON.stringify({ handle, quoteLink, commentLink, addr, followed })); } catch { /* ignore */ }
  }, [handle, quoteLink, commentLink, addr, followed]);

  const s1 = handleOk && handle.trim().length > 1;
  const s2 = followed;
  const s3 = quoteOk && isXLink(quoteLink);
  const s4 = commentOk && isXLink(commentLink);
  const s5 = addrOk && isValidAddress(addr);
  const all = s1 && s2 && s3 && s4 && s5;

  async function submit() {
    if (!all) { setErr("Complete all five rites first."); return; }
    setErr(""); setSending(true);
    // Save to Supabase when it's configured; otherwise let the flow
    // complete locally so registration is never a dead end in a demo.
    if (hasSupabase()) {
      const { error } = await submitApplication({ address: addr, twitter: handle, quote_url: quoteLink, comment_url: commentLink, phase: ACTIVE_PHASE });
      if (error) {
        setSending(false);
        setErr(/duplicate|unique/i.test(error.message ?? "") ? "That address is already registered." : "That didn't save. Try again.");
        return;
      }
    }
    setSending(false);
    try { localStorage.setItem("uo_wl_sent", "true"); } catch { /* ignore */ }
    setStage("open");
  }

  /* ── OPEN: registered ── */
  if (stage === "open") {
    return (
      <Scene img={ASSET.doorOpen}>
        <div style={{ marginBottom: 18 }}><Sigil size={54} color={C.ember} /></div>
        <StatusDot color={C.ember} label="You're on the whitelist" />
        <div style={{ margin: "14px 0 0" }}><Wordmark size="clamp(1.6rem,6vw,2.8rem)">THE DOOR IS OPEN</Wordmark></div>
        <p style={{ fontFamily: serif, fontSize: "1.05rem", color: C.bone, margin: "16px auto 26px", maxWidth: "40ch", lineHeight: 1.65, textShadow: "0 2px 12px #000" }}>
          Your name is carved. The light beyond the door is lit. Descend into the Catacombs when you are ready.
        </p>
        <button onClick={() => navigate("/crypts")}
          style={{ fontFamily: display, fontWeight: 700, fontSize: "1.05rem", textTransform: "uppercase", letterSpacing: "0.14em", color: C.ash, background: C.ember, border: `2px solid ${C.ember}`, padding: "16px 54px", cursor: "pointer", boxShadow: `4px 4px 0 ${C.emberLo}, 0 0 34px ${C.ember}55`, animation: "torch 2.4s infinite" }}>
          Enter the Catacombs
        </button>
      </Scene>
    );
  }

  /* ── SOON: registration not open yet → point at X, clear status ── */
  if (stage === "soon") {
    return (
      <Scene img={ASSET.doorShut}>
        <div style={{ marginBottom: 18 }}><Sigil size={54} color={C.rune} /></div>
        <StatusDot color={C.rune} label="Whitelist opens soon" />
        <div style={{ margin: "14px 0 0" }}><Wordmark size="clamp(1.5rem,5.5vw,2.6rem)">THE GATE OPENS SOON</Wordmark></div>
        <p style={{ fontFamily: serif, fontSize: "1.05rem", color: C.bone, margin: "16px auto 22px", maxWidth: "42ch", lineHeight: 1.65, textShadow: "0 2px 12px #000" }}>
          Registration opens shortly. Follow {X_HANDLE} so you catch the exact moment the door unseals. Here's what you'll need.
        </p>
        <div style={{ display: "grid", gap: 7, maxWidth: 360, margin: "0 auto 26px", textAlign: "left" }}>
          {REQS.map((r, i) => (
            <div key={r} style={{ display: "flex", gap: 10, alignItems: "center", fontFamily: serif, fontSize: "1rem", color: C.bone }}>
              <span style={{ fontFamily: display, fontWeight: 700, fontSize: "0.78rem", color: C.ember }}>{String(i + 1).padStart(2, "0")}</span>{r}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn href={X_URL}>{`Follow ${X_HANDLE}`}</Btn>
          <Link href="/collection"><Btn tone="bone">View the collection</Btn></Link>
        </div>
      </Scene>
    );
  }

  /* ── INTRO: registration live, not yet registered ── */
  if (stage === "intro") {
    return (
      <Scene img={ASSET.doorShut}>
        <div style={{ marginBottom: 18 }}><Sigil size={54} color={C.ember} /></div>
        <StatusDot color={C.ember} label="Whitelist registration is open" />
        <div style={{ margin: "14px 0 0" }}><Wordmark size="clamp(1.7rem,6vw,3rem)">REGISTER YOUR UNDEAD</Wordmark></div>
        <p style={{ fontFamily: serif, fontSize: "1.05rem", color: C.bone, margin: "16px auto 26px", maxWidth: "42ch", lineHeight: 1.65, textShadow: "0 2px 12px #000" }}>
          Five quick rites carve your name into the gate. Only the registered pass the door before the mint.
        </p>
        <button onClick={() => setStage("form")}
          style={{ fontFamily: display, fontWeight: 700, fontSize: "1.05rem", textTransform: "uppercase", letterSpacing: "0.12em", color: C.ash, background: C.ember, border: `2px solid ${C.ember}`, padding: "16px 48px", cursor: "pointer", boxShadow: `4px 4px 0 ${C.emberLo}, 0 0 34px ${C.ember}55`, animation: "torch 2.6s infinite" }}>
          Begin registration
        </button>
        <div style={{ marginTop: 16 }}>
          <Btn href={X_URL} tone="ghost" color={C.rune} small>{`Or just follow ${X_HANDLE}`}</Btn>
        </div>
      </Scene>
    );
  }

  /* ── FORM ── */
  return (
    <Scene img={ASSET.doorShut}>
      <div style={{ position: "relative", border: `1px solid ${C.ember}`, background: "rgba(11,9,16,0.95)", padding: "24px clamp(16px,4vw,26px)", textAlign: "left" }}>
        <Corners color={C.ember} size={15} />
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <StatusDot color={C.ember} label="Registration open" />
          <h2 style={{ fontFamily: black, fontSize: "clamp(1.5rem,5vw,2rem)", color: C.boneHi, margin: "10px 0 4px", lineHeight: 1.1 }}>Register your Undead</h2>
          <p style={{ fontFamily: serif, fontSize: "0.98rem", color: C.muted, margin: 0 }}>Finish the five rites and drop your address in.</p>
        </div>

        <div style={{ display: "flex", gap: 5, height: 9, marginBottom: 20 }}>
          {[s1, s2, s3, s4, s5].map((d, i) => <div key={i} style={{ flex: 1, background: d ? C.ember : C.stoneUp, transition: "background .3s" }} />)}
        </div>

        <Step n={1} title="Your X handle" hint="So we can match your account to your entry." done={s1} locked={false}>
          <input value={handle} style={field} placeholder="@yourhandle"
            onChange={(e) => { setHandle(e.target.value); setHandleOk(false); }} onKeyDown={(e) => e.key === "Enter" && setHandleOk(true)}
            onFocus={(e) => (e.target.style.borderColor = C.ember)} onBlur={(e) => (e.target.style.borderColor = C.stoneUp)} />
          {!s1 && handle.trim().length > 1 && <Act onClick={() => setHandleOk(true)}>Save handle</Act>}
        </Step>
        <Step n={2} title="Follow" hint={`Follow ${X_HANDLE} on X.`} done={s2} locked={!s1}>
          {!s2 && <Act onClick={() => { window.open(X_URL, "_blank", "noopener"); setTimeout(() => setFollowed(true), 900); }}>Open X and follow</Act>}
        </Step>
        <Step n={3} title="Like and quote" hint="Like the pinned post, then quote it with a caption. Paste your quote link." done={s3} locked={!s2}>
          {!s3 && <LinkStep value={quoteLink} onChange={(v) => { setQuoteLink(v); setQuoteOk(false); }} onSave={() => setQuoteOk(true)} saved={s3} placeholder="https://x.com/you/status/…" />}
        </Step>
        <Step n={4} title="Comment and tag three" hint="Comment on the pinned post tagging three friends. Paste your comment link." done={s4} locked={!s3}>
          {!s4 && <LinkStep value={commentLink} onChange={(v) => { setCommentLink(v); setCommentOk(false); }} onSave={() => setCommentOk(true)} saved={s4} placeholder="https://x.com/you/status/…" />}
        </Step>
        <Step n={5} title="Your address" hint="The Bitcoin (bc1p…) or ETH (0x…) address you'll mint with." done={s5} locked={!s4}>
          <input value={addr} style={field} placeholder="bc1p…   or   0x…"
            onChange={(e) => { setAddr(e.target.value); setAddrOk(false); }} onKeyDown={(e) => e.key === "Enter" && isValidAddress(addr) && setAddrOk(true)}
            onFocus={(e) => (e.target.style.borderColor = C.ember)} onBlur={(e) => (e.target.style.borderColor = C.stoneUp)} />
          {addr && !isValidAddress(addr) && <p style={{ fontFamily: serif, fontSize: "0.92rem", color: C.oxblood, margin: "7px 0 0" }}>That doesn't look like a valid Bitcoin or ETH address.</p>}
          {!s5 && isValidAddress(addr) && <Act onClick={() => setAddrOk(true)}>Save address</Act>}
          <p style={{ fontFamily: serif, fontSize: "0.86rem", color: C.faint, margin: "9px 0 0", lineHeight: 1.5 }}>Public address only. Nobody will ever ask for a seed phrase.</p>
        </Step>

        {err && <p style={{ fontFamily: serif, color: C.oxblood, fontSize: "0.96rem", margin: "12px 0 0" }}>{err}</p>}
        <div style={{ marginTop: 16 }}><Btn full onClick={submit}>{sending ? "Sealing…" : all ? "Carve my name" : "Finish all five rites"}</Btn></div>
      </div>
    </Scene>
  );
}
