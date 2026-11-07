import { useEffect, useState, type CSSProperties } from "react";
import { Link, useLocation } from "wouter";
import { Btn, Corners, Seq, Sigil, C, display, serif, black } from "@/components/ui";
import { ASSET, X_URL, X_HANDLE, PINNED_URL, ACTIVE_PHASE, WHITELIST_LIVE, PROJECT } from "@/lib/theme";
import { submitApplication, hasSupabase } from "@/lib/supabase";
import { FACTIONS } from "@/lib/lore";
import { isValidAddress, isXLink, shorten } from "@/lib/utils";

type Stage = "intro" | "form" | "open" | "soon";

const field: CSSProperties = {
  width: "100%", background: C.slab, color: C.boneHi, border: `1px solid ${C.stoneUp}`,
  padding: "13px 14px", fontSize: "1rem", fontFamily: display, outline: "none", boxSizing: "border-box",
};

/* full-bleed door scene. Light overlay so the door reads clearly. */
function Scene({ img, children }: { img: string; children: React.ReactNode }) {
  return (
    <section style={{ position: "relative", minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px clamp(18px,5vw,40px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(8,6,12,0.1), rgba(8,6,12,0.6))" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 560, textAlign: "center" }}>{children}</div>
    </section>
  );
}

/* The one element on a clean door: a blinking word. */
function GateWord({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: black, fontSize: "clamp(2.6rem,9vw,4.6rem)", color: C.ember,
      background: "transparent", border: "none", cursor: "pointer", padding: 0, lineHeight: 1,
      letterSpacing: "0.02em", textShadow: `0 0 36px ${C.ember}, 0 3px 16px rgba(0,0,0,0.9)`,
      animation: "blink 1.5s infinite",
    }}>{label}</button>
  );
}

/* deterministic passport identity from the holder's address/handle */
function hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function passId(seed: string) { return `UO-${String((hash(seed) % PROJECT.supply) + 1).padStart(4, "0")}`; }
function passFaction(seed: string) { return FACTIONS[hash(seed + "f") % FACTIONS.length]; }

/* ── The Whitelist Passport: a shareable HUD ID card issued on join,
   with a one-click pre-written post to X. ── */
function Passport({ handle, addr, onEnter }: { handle: string; addr: string; onEnter: () => void }) {
  const seed = (addr || handle || "undead").toLowerCase();
  const id = passId(seed);
  const faction = passFaction(seed);
  const tag = (handle.trim().replace(/^@/, "") || "undead");

  const shareText =
    `I just clawed my way onto the ${X_HANDLE} whitelist. 🪦\n\n` +
    `${PROJECT.supply.toLocaleString()} Undead. One blockchain. No second death.\n` +
    `Dead inside, alive on Bitcoin.\n\n` +
    `My passport is signed — pass ${id}, ${faction.name}. Claim yours 👇`;
  const site = typeof window !== "undefined" ? window.location.origin : X_URL;
  const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(site)}`;

  return (
    <div style={{ width: "100%", maxWidth: 560, margin: "0 auto" }}>
      <p style={{ fontFamily: black, fontSize: "clamp(1.9rem,7vw,2.8rem)", color: C.boneHi, margin: "0 0 6px", lineHeight: 1.05, textShadow: "0 3px 18px rgba(0,0,0,0.9)" }}>You're in.</p>
      <p style={{ fontFamily: serif, fontSize: "1.05rem", color: C.bone, margin: "0 0 20px", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
        Your passport is signed. Post it to X to lock in your claim.
      </p>

      {/* passport card */}
      <div style={{ position: "relative", border: `1px solid ${C.rune}`, background: "linear-gradient(145deg, rgba(14,26,18,0.98), rgba(4,11,7,0.98))", boxShadow: `0 0 50px ${C.rune}26`, textAlign: "left" }}>
        <Corners color={C.rune} size={16} />
        {/* header strip */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 15px", borderBottom: `1px solid ${C.stoneUp}`, background: "rgba(59,224,123,0.06)" }}>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.rune }}>Undead Ordinals · Whitelist Passport</span>
          <Sigil size={22} color={C.rune} />
        </div>

        <div style={{ display: "flex", gap: 15, padding: 15 }}>
          {/* specimen */}
          <div style={{ position: "relative", flexShrink: 0, width: 108, border: `1px solid ${faction.color}`, background: C.slab, overflow: "hidden" }}>
            <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 40%, ${faction.color}2e, transparent 70%)` }} />
            <img src={faction.image} alt={faction.name} style={{ position: "relative", width: "100%", height: 130, objectFit: "cover" }} />
            <div style={{ position: "relative", fontFamily: display, fontSize: "0.58rem", textAlign: "center", color: C.bone, padding: "4px 2px", borderTop: `1px solid ${C.stoneUp}` }}>SPECIMEN</div>
          </div>
          {/* fields */}
          <div style={{ flex: 1, display: "grid", gap: 9, alignContent: "start" }}>
            <Field label="Holder" value={`@${tag}`} color={C.boneHi} />
            <Field label="Faction" value={faction.name} color={faction.color} />
            <Field label="Pass No." value={id} color={C.ember} mono />
            <Field label="Address" value={shorten(addr || "—", 7, 5)} color={C.bone} mono />
            <Field label="Status" value="WHITELISTED" color={C.rune} />
          </div>
        </div>

        {/* MRZ-style strip */}
        <div style={{ padding: "8px 15px 12px", borderTop: `1px solid ${C.stoneUp}` }}>
          <div style={{ fontFamily: display, fontSize: "0.62rem", letterSpacing: "0.18em", color: C.faint, wordBreak: "break-all", lineHeight: 1.5 }}>
            UO&lt;&lt;{tag.toUpperCase()}&lt;&lt;{id.replace("-", "")}&lt;&lt;{(addr || "UNDEAD").slice(0, 12).toUpperCase()}&lt;&lt;{PROJECT.chain.toUpperCase()}
          </div>
        </div>
      </div>

      {/* actions */}
      <div style={{ display: "flex", gap: 11, marginTop: 18, flexWrap: "wrap" }}>
        <a href={intent} target="_blank" rel="noopener noreferrer" style={{ flex: "1 1 220px", textDecoration: "none" }}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: display, fontWeight: 400, fontSize: "0.86rem", color: C.ash, background: C.ember, border: `1.5px solid ${C.ember}`, padding: "15px 22px", boxShadow: `3px 3px 0 ${C.emberLo}`, cursor: "pointer" }}>
            <XGlyph /> Post my passport on X
          </span>
        </a>
      </div>
      <button onClick={onEnter} style={{ width: "100%", marginTop: 11, background: "transparent", color: C.rune, border: `1px solid ${C.rune}`, padding: "13px", fontFamily: display, fontWeight: 600, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", transition: "background .15s, color .15s" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = C.rune; e.currentTarget.style.color = C.ash; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.rune; }}>
        Enter the Catacombs →
      </button>
    </div>
  );
}

function Field({ label, value, color, mono }: { label: string; value: string; color: string; mono?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, borderBottom: `1px solid ${C.lineLo}`, paddingBottom: 6 }}>
      <span style={{ fontFamily: display, fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", color: C.faint }}>{label}</span>
      <span style={{ fontFamily: display, fontWeight: mono ? 700 : 600, fontSize: "0.82rem", color, letterSpacing: mono ? "0.05em" : 0, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function XGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
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

  /* ── OPEN: registered — open door + the issued passport ── */
  if (stage === "open") {
    return <Scene img={ASSET.doorOpen}><Passport handle={handle} addr={addr} onEnter={() => navigate("/crypts")} /></Scene>;
  }

  /* ── SOON: registration off — shut door, one blinking word ── */
  if (stage === "soon") {
    return (
      <Scene img={ASSET.doorShut}>
        <button onClick={() => window.open(X_URL, "_blank", "noopener")} style={{ fontFamily: black, fontSize: "clamp(2rem,7vw,3.4rem)", color: C.rune, background: "transparent", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, textShadow: `0 0 30px ${C.rune}, 0 3px 16px rgba(0,0,0,0.9)`, animation: "blink 1.6s infinite" }}>
          Opens soon
        </button>
      </Scene>
    );
  }

  /* ── INTRO: shut door, one blinking word ── */
  if (stage === "intro") {
    return (
      <Scene img={ASSET.doorShut}>
        <GateWord label="Enter" onClick={() => setStage("form")} />
        <div style={{ marginTop: 26 }}>
          <Link href="/check" style={{ fontFamily: display, fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase", color: C.rune, borderBottom: `1px solid ${C.rune}66`, paddingBottom: 2 }}>
            Already registered? Check your allocation
          </Link>
        </div>
      </Scene>
    );
  }

  /* ── FORM — the five rites ── */
  return (
    <Scene img={ASSET.doorShut}>
      <div style={{ position: "relative", border: `1px solid ${C.ember}`, background: "rgba(11,9,16,0.95)", padding: "24px clamp(16px,4vw,26px)", textAlign: "left" }}>
        <Corners color={C.ember} size={15} />
        <p style={{ fontFamily: display, fontWeight: 600, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.1em", color: C.boneHi, textAlign: "center", margin: "0 0 18px" }}>The five rites</p>

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
