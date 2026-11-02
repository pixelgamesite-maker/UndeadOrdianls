import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "wouter";
import {
  Section, Btn, Wordmark, Reveal, Tag, Sigil, Seq, Corners,
  C, display, serif,
} from "@/components/ui";
import { ACTIVE_PHASE, X_URL, X_HANDLE, PINNED_URL } from "@/lib/theme";
import { submitApplication, hasSupabase } from "@/lib/supabase";
import { isValidAddress, isXLink } from "@/lib/utils";

const field: CSSProperties = {
  width: "100%", background: C.slab, color: C.boneHi, border: `1px solid ${C.stoneUp}`,
  padding: "13px 14px", fontSize: "0.86rem", fontFamily: display, outline: "none",
  boxSizing: "border-box", letterSpacing: "0.01em",
};

function Meter({ done }: { done: boolean[] }) {
  const n = done.filter(Boolean).length;
  const total = done.length;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", gap: 5, height: 10 }}>
        {done.map((d, i) => (
          <div key={i} style={{ flex: 1, background: d ? C.ember : C.stoneUp, transition: "background .3s" }} />
        ))}
      </div>
      <p style={{ fontFamily: display, fontSize: "0.72rem", color: n === total ? C.ember : C.faint, margin: "10px 0 0" }}>
        {n === total ? "Fully resurrected" : `Resurrection ${n} of ${total}`}
      </p>
    </div>
  );
}

function Act({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      marginTop: 10, width: "100%", background: "transparent", color: C.rune,
      border: `1px solid ${C.rune}`, padding: "11px", fontFamily: display, fontSize: "0.72rem",
      cursor: "pointer", transition: "background .15s, color .15s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = C.rune; e.currentTarget.style.color = C.ash; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.rune; }}
    >{children}</button>
  );
}

function Step({ n, title, hint, done, locked, children }: { n: number; title: string; hint: string; done: boolean; locked: boolean; children?: React.ReactNode }) {
  return (
    <div style={{ position: "relative", border: `1px solid ${done ? C.ember : locked ? C.lineLo : C.stoneUp}`, background: locked ? "transparent" : C.stone, padding: "16px 16px 14px", marginBottom: 10, opacity: locked ? 0.45 : 1, transition: "border-color .25s, opacity .25s" }}>
      {!locked && <Corners color={done ? C.ember : C.rune} />}
      <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: locked ? 0 : 11 }}>
        <Seq color={done ? C.ember : C.muted}>{String(n).padStart(2, "0")}</Seq>
        <div>
          <p style={{ fontFamily: display, fontSize: "0.74rem", margin: 0, color: C.boneHi, lineHeight: 1.45 }}>{title}</p>
          <p style={{ fontFamily: serif, fontSize: "1rem", color: C.muted, margin: "6px 0 0", lineHeight: 1.55 }}>{hint}</p>
        </div>
      </div>
      {!locked && children}
    </div>
  );
}

function LinkStep({ value, onChange, onSave, saved, placeholder, launch }: { value: string; onChange: (v: string) => void; onSave: () => void; saved: boolean; placeholder: string; launch: string }) {
  return (
    <>
      <Act onClick={() => window.open(launch, "_blank", "noopener")}>Open the pinned post</Act>
      <input value={value} style={{ ...field, marginTop: 10 }} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && isXLink(value) && onSave()}
        onFocus={(e) => (e.target.style.borderColor = C.ember)} onBlur={(e) => (e.target.style.borderColor = C.stoneUp)} />
      {value && !isXLink(value) && <p style={{ fontFamily: serif, fontSize: "0.94rem", color: C.oxblood, margin: "7px 0 0" }}>That needs to be a real x.com link — paste the full URL.</p>}
      {isXLink(value) && !saved && <Act onClick={onSave}>Save link</Act>}
    </>
  );
}

export default function Raffle() {
  const isWaitlist = ACTIVE_PHASE === "waitlist";
  const title = isWaitlist ? "THE WAITLIST" : "THE RAFFLE";
  const lead = isWaitlist
    ? "Open to everyone. Complete the rites, drop your address, and take your place in line before the mint."
    : "Prove you belong to the horde. Complete the rites, enter your address, and you are in the draw.";

  const [handle, setHandle] = useState("");
  const [handleOk, setHandleOk] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [quoteLink, setQuoteLink] = useState("");
  const [quoteOk, setQuoteOk] = useState(false);
  const [commentLink, setCommentLink] = useState("");
  const [commentOk, setCommentOk] = useState(false);
  const [addr, setAddr] = useState("");
  const [addrOk, setAddrOk] = useState(false);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [already, setAlready] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("uo_wl") ?? "{}");
      setHandle(s.handle ?? ""); setQuoteLink(s.quoteLink ?? ""); setCommentLink(s.commentLink ?? ""); setAddr(s.addr ?? ""); setFollowed(!!s.followed);
      if (localStorage.getItem("uo_wl_sent") === "true") setAlready(true);
    } catch { /* first visit */ }
  }, []);
  useEffect(() => {
    localStorage.setItem("uo_wl", JSON.stringify({ handle, quoteLink, commentLink, addr, followed }));
  }, [handle, quoteLink, commentLink, addr, followed]);

  const s1 = handleOk && handle.trim().length > 1;
  const s2 = followed;
  const s3 = quoteOk && isXLink(quoteLink);
  const s4 = commentOk && isXLink(commentLink);
  const s5 = addrOk && isValidAddress(addr);
  const all = s1 && s2 && s3 && s4 && s5;

  async function send() {
    if (!all) { setErr("Finish all five rites first."); return; }
    if (already) { setErr("This browser has already entered."); return; }
    if (!hasSupabase()) { setErr("The entry backend isn't configured yet (set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)."); return; }
    setErr(""); setSending(true);
    const { error } = await submitApplication({ address: addr, twitter: handle, quote_url: quoteLink, comment_url: commentLink, phase: ACTIVE_PHASE });
    setSending(false);
    if (error) {
      setErr(/duplicate|unique/i.test(error.message ?? "") ? "That address is already entered." : "That didn't save. Check your connection and try again.");
      return;
    }
    localStorage.setItem("uo_wl_sent", "true");
    setSent(true); setAlready(true);
  }

  return (
    <>
      <section style={{ padding: "clamp(50px,8vw,90px) clamp(18px,5vw,44px) clamp(22px,4vw,36px)", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", marginBottom: 16 }}><Tag color={C.ember}>{isWaitlist ? "Public phase — open to all" : "Raffle phase — live"}</Tag></div>
          <Wordmark size="clamp(1.5rem,6vw,2.8rem)">{title}</Wordmark>
          <p className="standfirst" style={{ fontFamily: serif, fontSize: "1.1rem", color: C.muted, margin: "18px auto 0", maxWidth: "48ch", lineHeight: 1.6 }}>{lead}</p>
        </div>
      </section>

      <Section tone="slab" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 540, margin: "0 auto" }}>
          <div style={{ position: "relative", border: `1px solid ${C.stoneUp}`, background: C.stone, padding: "26px clamp(18px,4vw,26px)" }}>
            <Corners color={C.ember} size={15} />
            {sent || already ? (
              <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}><Sigil size={58} color={C.ember} /></div>
                <h2 style={{ fontFamily: display, fontSize: "0.95rem", margin: "0 0 12px", color: C.boneHi }}>{sent ? "You're in" : "Already entered"}</h2>
                <p style={{ fontFamily: serif, fontSize: "1.05rem", color: C.muted, margin: 0, lineHeight: 1.75 }}>
                  Your entry is recorded. Selected addresses are announced on X before mint — watch {X_HANDLE}. The louder
                  the horde, the better the draw.
                </p>
                <div style={{ marginTop: 22, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <Btn href={X_URL} small>Follow {X_HANDLE}</Btn>
                  <Link href="/verify"><Btn tone="bone" small>Hold an OG NFT? Verify</Btn></Link>
                </div>
              </div>
            ) : (
              <>
                <Meter done={[s1, s2, s3, s4, s5]} />

                <Step n={1} title="Your X handle" hint="So we can match your account to your entry." done={s1} locked={false}>
                  <input value={handle} style={field} placeholder="@yourhandle"
                    onChange={(e) => { setHandle(e.target.value); setHandleOk(false); }}
                    onKeyDown={(e) => e.key === "Enter" && setHandleOk(true)}
                    onFocus={(e) => (e.target.style.borderColor = C.ember)} onBlur={(e) => (e.target.style.borderColor = C.stoneUp)} />
                  {!s1 && handle.trim().length > 1 && <Act onClick={() => setHandleOk(true)}>Save handle</Act>}
                </Step>

                <Step n={2} title="Follow" hint={`Follow ${X_HANDLE} on X.`} done={s2} locked={!s1}>
                  {!s2 && <Act onClick={() => { window.open(X_URL, "_blank", "noopener"); setTimeout(() => setFollowed(true), 900); }}>Open X and follow</Act>}
                </Step>

                <Step n={3} title="Like and quote" hint="Like the pinned post, then quote it with a caption on why you're bullish on the Undead. Paste your quote link." done={s3} locked={!s2}>
                  {!s3 && <LinkStep value={quoteLink} onChange={(v) => { setQuoteLink(v); setQuoteOk(false); }} onSave={() => setQuoteOk(true)} saved={s3} placeholder="https://x.com/you/status/…" launch={PINNED_URL} />}
                </Step>

                <Step n={4} title="Comment and tag three" hint="Comment on the pinned post tagging three friends who belong in the Catacombs. Paste your comment link." done={s4} locked={!s3}>
                  {!s4 && <LinkStep value={commentLink} onChange={(v) => { setCommentLink(v); setCommentOk(false); }} onSave={() => setCommentOk(true)} saved={s4} placeholder="https://x.com/you/status/…" launch={PINNED_URL} />}
                </Step>

                <Step n={5} title="Your address" hint="The Bitcoin (bc1p…) or ETH (0x…) address you'll mint with." done={s5} locked={!s4}>
                  <input value={addr} style={field} placeholder="bc1p…   or   0x…"
                    onChange={(e) => { setAddr(e.target.value); setAddrOk(false); }}
                    onKeyDown={(e) => e.key === "Enter" && isValidAddress(addr) && setAddrOk(true)}
                    onFocus={(e) => (e.target.style.borderColor = C.ember)} onBlur={(e) => (e.target.style.borderColor = C.stoneUp)} />
                  {addr && !isValidAddress(addr) && <p style={{ fontFamily: serif, fontSize: "0.94rem", color: C.oxblood, margin: "7px 0 0" }}>That doesn't look like a valid Bitcoin or ETH address.</p>}
                  {!s5 && isValidAddress(addr) && <Act onClick={() => setAddrOk(true)}>Save address</Act>}
                  <p style={{ fontFamily: serif, fontSize: "0.9rem", color: C.faint, margin: "11px 0 0", lineHeight: 1.55 }}>
                    We only need your public address. Nobody from Undead Ordinals will ever ask for a seed phrase.
                  </p>
                </Step>

                {err && <p style={{ fontFamily: serif, color: C.oxblood, fontSize: "0.98rem", margin: "12px 0 0" }}>{err}</p>}

                <div style={{ marginTop: 16 }}>
                  <Btn full onClick={send}>{sending ? "Sealing…" : all ? (isWaitlist ? "Join the waitlist" : "Enter the raffle") : "Finish all five rites"}</Btn>
                </div>
              </>
            )}
          </div>

          <p style={{ fontFamily: serif, fontSize: "0.96rem", color: C.faint, textAlign: "center", margin: "18px auto 0", maxWidth: "48ch", lineHeight: 1.6 }}>
            Hold an OG Ordinals or ETH NFT? <Link href="/verify" style={{ color: C.rune }}>Verify your holdings</Link> for a priority spot — no wallet connect required.
          </p>
        </div>
      </Section>
    </>
  );
}
