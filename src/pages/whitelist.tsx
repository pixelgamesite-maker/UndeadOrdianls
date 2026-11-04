import { useEffect, useState, type CSSProperties } from "react";
import { Link, useLocation } from "wouter";
import { Btn, Wordmark, Sigil, Corners, Seq, C, display, serif, black } from "@/components/ui";
import { ASSET, X_URL, X_HANDLE, PINNED_URL, ACTIVE_PHASE } from "@/lib/theme";
import { submitApplication, hasSupabase } from "@/lib/supabase";
import { isValidAddress, isXLink } from "@/lib/utils";

type Stage = "locked" | "form" | "open";

const field: CSSProperties = {
  width: "100%", background: C.slab, color: C.boneHi, border: `1px solid ${C.stoneUp}`,
  padding: "13px 14px", fontSize: "1rem", fontFamily: display, outline: "none", boxSizing: "border-box",
};

/* full-bleed door scene behind the page */
function Scene({ img, children }: { img: string; children: React.ReactNode }) {
  return (
    <section style={{ position: "relative", minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px clamp(18px,5vw,40px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, rgba(8,6,12,0.35), rgba(8,6,12,0.8))" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 560, textAlign: "center" }}>{children}</div>
    </section>
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
  const sentBefore = (() => { try { return localStorage.getItem("uo_wl_sent") === "true"; } catch { return false; } })();
  const [stage, setStage] = useState<Stage>(sentBefore ? "open" : "locked");

  // form state
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
    if (!hasSupabase()) { setErr("The registry isn't configured yet (set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)."); return; }
    setErr(""); setSending(true);
    const { error } = await submitApplication({ address: addr, twitter: handle, quote_url: quoteLink, comment_url: commentLink, phase: ACTIVE_PHASE });
    setSending(false);
    if (error) { setErr(/duplicate|unique/i.test(error.message ?? "") ? "That address is already registered." : "That didn't save. Try again."); return; }
    try { localStorage.setItem("uo_wl_sent", "true"); } catch { /* ignore */ }
    setStage("open");
  }

  /* ── LOCKED: the shut door ── */
  if (stage === "locked") {
    return (
      <Scene img={ASSET.doorShut}>
        <div style={{ marginBottom: 20 }}><Sigil size={56} color={C.ember} /></div>
        <p style={{ fontFamily: display, fontWeight: 600, fontSize: "0.8rem", color: C.rune, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 14px" }}>The gate is sealed</p>
        <button onClick={() => setStage("form")}
          style={{ fontFamily: black, fontSize: "clamp(1.6rem,6vw,2.8rem)", color: C.ember, background: "transparent", border: "none", cursor: "pointer", lineHeight: 1.1, textShadow: `0 0 26px ${C.ember}88`, animation: "blink 1.7s infinite", padding: 0 }}>
          Register your Undead
        </button>
        <p style={{ fontFamily: serif, fontSize: "1.02rem", color: C.bone, margin: "18px auto 0", maxWidth: "40ch", lineHeight: 1.6, textShadow: "0 2px 12px #000" }}>
          Complete the rites to carve your name into the whitelist. Only the registered may pass the door.
        </p>
      </Scene>
    );
  }

  /* ── OPEN: the door stands open ── */
  if (stage === "open") {
    return (
      <Scene img={ASSET.doorOpen}>
        <div style={{ marginBottom: 20 }}><Sigil size={56} color={C.ember} /></div>
        <p style={{ fontFamily: display, fontWeight: 600, fontSize: "0.8rem", color: C.ember, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px" }}>Your name is carved</p>
        <Wordmark size="clamp(1.6rem,6vw,2.8rem)">THE DOOR IS OPEN</Wordmark>
        <p style={{ fontFamily: serif, fontSize: "1.05rem", color: C.bone, margin: "16px auto 26px", maxWidth: "40ch", lineHeight: 1.65, textShadow: "0 2px 12px #000" }}>
          You are on the whitelist. The light beyond the door is lit. Descend into the Catacombs when you are ready.
        </p>
        <button onClick={() => navigate("/crypts")}
          style={{ fontFamily: display, fontWeight: 700, fontSize: "1.05rem", textTransform: "uppercase", letterSpacing: "0.14em", color: C.ash, background: C.ember, border: `2px solid ${C.ember}`, padding: "16px 54px", cursor: "pointer", boxShadow: `4px 4px 0 ${C.emberLo}, 0 0 34px ${C.ember}55`, animation: "torch 2.4s infinite" }}>
          Enter
        </button>
      </Scene>
    );
  }

  /* ── FORM: the five rites ── */
  return (
    <Scene img={ASSET.doorShut}>
      <div style={{ position: "relative", border: `1px solid ${C.ember}`, background: "rgba(11,9,16,0.95)", padding: "24px clamp(16px,4vw,26px)", textAlign: "left" }}>
        <Corners color={C.ember} size={15} />
        <h2 style={{ fontFamily: black, fontSize: "clamp(1.5rem,5vw,2rem)", color: C.boneHi, margin: "0 0 6px", textAlign: "center", lineHeight: 1.1 }}>Register your Undead</h2>
        <p style={{ fontFamily: serif, fontSize: "0.98rem", color: C.muted, textAlign: "center", margin: "0 0 20px" }}>Five rites. Finish them and drop your address in.</p>

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
