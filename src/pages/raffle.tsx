import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "wouter";
import {
  Section, Kicker, Btn, Panel, GlitchText, Pill, notch,
  C, display, body, mono,
} from "@/components/ui";
import { AshField } from "@/components/Effects";
import { ACTIVE_PHASE, X_URL, X_HANDLE, PINNED_URL } from "@/lib/theme";
import { submitApplication, hasSupabase } from "@/lib/supabase";
import { isValidAddress, isXLink } from "@/lib/utils";

const inputStyle: CSSProperties = {
  width: "100%", background: C.void, color: C.bone,
  border: `2px solid ${C.tomb}`, padding: "13px 14px",
  fontSize: "1.05rem", fontFamily: mono, outline: "none",
  boxSizing: "border-box", letterSpacing: "0.03em",
};

/* Progress reads as a resurrection meter — the more steps done, the
   more "alive" the horde gauge becomes. */
function Meter({ done }: { done: boolean[] }) {
  const n = done.filter(Boolean).length;
  const total = done.length;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", gap: 5, height: 16 }}>
        {done.map((d, i) => (
          <div key={i} style={{
            flex: 1, background: d ? C.ice : C.tomb,
            boxShadow: d ? `0 0 12px ${C.ice}99` : "none",
            transition: "background .3s, box-shadow .3s",
          }} />
        ))}
      </div>
      <p style={{ fontFamily: mono, fontSize: "1.05rem", color: n === total ? C.ice : C.faint, margin: "9px 0 0", letterSpacing: "0.15em", textTransform: "uppercase" }}>
        {n === total ? "◆ Fully Resurrected" : `Resurrection ${n} / ${total}`}
      </p>
    </div>
  );
}

function Ghost({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      marginTop: 9, width: "100%", background: "transparent", color: C.ice,
      border: `2px solid ${C.ice}`, clipPath: notch(7), padding: "11px",
      fontFamily: mono, fontSize: "1.05rem", cursor: "pointer",
      letterSpacing: "0.1em", textTransform: "uppercase", transition: "background .15s, color .15s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = C.ice; e.currentTarget.style.color = C.void; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.ice; }}
    >{children}</button>
  );
}

function Step({ n, title, hint, done, locked, children }: {
  n: number; title: string; hint: string; done: boolean; locked: boolean; children?: React.ReactNode;
}) {
  return (
    <div style={{
      border: `2px solid ${done ? C.ice : locked ? C.line : C.tomb}`,
      padding: "16px 16px 14px", marginBottom: 10, background: locked ? "transparent" : C.void,
      opacity: locked ? 0.4 : 1, boxShadow: done ? `0 0 18px ${C.ice}22` : "none",
      transition: "border-color .25s, box-shadow .25s, opacity .25s",
    }}>
      <div style={{ display: "flex", gap: 11, alignItems: "baseline", marginBottom: locked ? 0 : 11 }}>
        <span style={{ fontFamily: display, fontSize: "0.68rem", color: done ? C.ice : C.muted }}>{String(n).padStart(2, "0")}</span>
        <div>
          <p style={{ fontFamily: display, fontSize: "0.6rem", margin: 0, color: C.bone, letterSpacing: "0.02em", lineHeight: 1.5 }}>{title}</p>
          <p style={{ fontFamily: body, fontSize: "0.92rem", color: C.muted, margin: "6px 0 0", lineHeight: 1.55 }}>{hint}</p>
        </div>
      </div>
      {!locked && children}
    </div>
  );
}

function LinkStep({ value, onChange, onSave, saved, placeholder, launchLabel, launchTo }: {
  value: string; onChange: (v: string) => void; onSave: () => void; saved: boolean;
  placeholder: string; launchLabel: string; launchTo: string;
}) {
  return (
    <>
      <Ghost onClick={() => window.open(launchTo, "_blank", "noopener")}>{launchLabel}</Ghost>
      <input value={value} style={{ ...inputStyle, marginTop: 9 }} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && isXLink(value) && onSave()}
        onFocus={(e) => (e.target.style.borderColor = C.ice)}
        onBlur={(e) => (e.target.style.borderColor = C.tomb)} />
      {value && !isXLink(value) && (
        <p style={{ fontFamily: body, fontSize: "0.88rem", color: C.ember, margin: "6px 0 0" }}>
          Needs to be a real x.com link — paste the full URL from the address bar or the Share button.
        </p>
      )}
      {isXLink(value) && !saved && <Ghost onClick={onSave}>Save link</Ghost>}
    </>
  );
}

export default function Raffle() {
  const isWaitlist = ACTIVE_PHASE === "waitlist";
  const title = isWaitlist ? "THE PUBLIC WAITLIST" : "THE RAFFLE";
  const lead = isWaitlist
    ? "Open to everyone. Complete the steps, drop your address, and claim your place in line before the mint."
    : "Prove you're part of the horde. Complete the steps, enter your address, and you're in the draw.";

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
      setHandle(s.handle ?? ""); setQuoteLink(s.quoteLink ?? "");
      setCommentLink(s.commentLink ?? ""); setAddr(s.addr ?? "");
      setFollowed(!!s.followed);
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
    if (!all) { setErr("Finish all five steps first."); return; }
    if (already) { setErr("This browser has already entered."); return; }
    if (!hasSupabase()) { setErr("The entry backend isn't configured yet. (Set VITE_SUPABASE_URL / _ANON_KEY.)"); return; }
    setErr(""); setSending(true);
    const { error } = await submitApplication({
      address: addr, twitter: handle, quote_url: quoteLink, comment_url: commentLink, phase: ACTIVE_PHASE,
    });
    setSending(false);
    if (error) {
      setErr(/duplicate|unique/i.test(error.message ?? "")
        ? "That address is already entered."
        : "That didn't save. Check your connection and try again.");
      return;
    }
    localStorage.setItem("uo_wl_sent", "true");
    setSent(true); setAlready(true);
  }

  return (
    <>
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(66px,10vw,110px) clamp(18px,5vw,40px) clamp(30px,5vw,50px)", textAlign: "center" }}>
        <AshField density={22} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 680, margin: "0 auto" }}>
          <Pill color={C.ice}>{isWaitlist ? "PUBLIC PHASE · OPEN TO ALL" : "RAFFLE PHASE · LIVE"}</Pill>
          <div style={{ marginTop: 16 }}>
            <GlitchText size="clamp(1.4rem,6vw,2.8rem)">{title}</GlitchText>
          </div>
          <p style={{ fontFamily: body, fontSize: "1.02rem", color: C.muted, margin: "20px auto 0", maxWidth: "52ch", lineHeight: 1.75 }}>{lead}</p>
        </div>
      </section>

      <Section tone="crypt" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <Panel color={C.tombUp} glow={C.ice} pad={24}>
            {sent || already ? (
              <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
                <div style={{ width: 60, height: 60, margin: "0 auto 18px", background: C.ice, display: "grid", placeItems: "center", fontSize: "1.7rem", color: C.void, boxShadow: `0 0 36px ${C.ice}88`, clipPath: notch(10) }}>✓</div>
                <h2 style={{ fontFamily: display, fontSize: "0.9rem", margin: "0 0 12px", color: C.bone, letterSpacing: "0.02em" }}>
                  {sent ? "YOU'RE IN" : "ALREADY ENTERED"}
                </h2>
                <p style={{ fontFamily: body, color: C.muted, margin: 0, lineHeight: 1.75, fontSize: "0.98rem" }}>
                  Your entry is recorded. Selected addresses are announced on X before mint —
                  keep an eye on {X_HANDLE}. The more you post, the louder the horde.
                </p>
                <div style={{ marginTop: 22, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <Btn href={X_URL} color={C.ice} small>Follow {X_HANDLE}</Btn>
                  <Link href="/verify"><Btn tone="ghost" color={C.bone} small>Hold an OG NFT? Verify →</Btn></Link>
                </div>
              </div>
            ) : (
              <>
                <Meter done={[s1, s2, s3, s4, s5]} />

                <Step n={1} title="YOUR X HANDLE" hint="So we can match your account to your entry." done={s1} locked={false}>
                  <input value={handle} style={inputStyle} placeholder="@yourhandle"
                    onChange={(e) => { setHandle(e.target.value); setHandleOk(false); }}
                    onKeyDown={(e) => e.key === "Enter" && setHandleOk(true)}
                    onFocus={(e) => (e.target.style.borderColor = C.ice)}
                    onBlur={(e) => (e.target.style.borderColor = C.tomb)} />
                  {!s1 && handle.trim().length > 1 && <Ghost onClick={() => setHandleOk(true)}>Save handle</Ghost>}
                </Step>

                <Step n={2} title="FOLLOW" hint={`Follow ${X_HANDLE} on X.`} done={s2} locked={!s1}>
                  {!s2 && <Ghost onClick={() => { window.open(X_URL, "_blank", "noopener"); setTimeout(() => setFollowed(true), 900); }}>Open X & follow</Ghost>}
                </Step>

                <Step n={3} title="LIKE & QUOTE" hint="Like the pinned post, then quote it with a caption on why you're bullish on the Undead. Paste your quote link." done={s3} locked={!s2}>
                  {!s3 && <LinkStep value={quoteLink} onChange={(v) => { setQuoteLink(v); setQuoteOk(false); }} onSave={() => setQuoteOk(true)} saved={s3} placeholder="https://x.com/you/status/…" launchLabel="Open the pinned post" launchTo={PINNED_URL} />}
                </Step>

                <Step n={4} title="COMMENT & TAG 3" hint="Comment on the pinned post tagging 3 friends who belong in the Catacombs. Paste your comment link." done={s4} locked={!s3}>
                  {!s4 && <LinkStep value={commentLink} onChange={(v) => { setCommentLink(v); setCommentOk(false); }} onSave={() => setCommentOk(true)} saved={s4} placeholder="https://x.com/you/status/…" launchLabel="Open the pinned post" launchTo={PINNED_URL} />}
                </Step>

                <Step n={5} title="YOUR ADDRESS" hint="The Bitcoin (bc1p…) or ETH (0x…) address you'll mint with." done={s5} locked={!s4}>
                  <input value={addr} style={inputStyle} placeholder="bc1p…  or  0x…"
                    onChange={(e) => { setAddr(e.target.value); setAddrOk(false); }}
                    onKeyDown={(e) => e.key === "Enter" && isValidAddress(addr) && setAddrOk(true)}
                    onFocus={(e) => (e.target.style.borderColor = C.ice)}
                    onBlur={(e) => (e.target.style.borderColor = C.tomb)} />
                  {addr && !isValidAddress(addr) && (
                    <p style={{ fontFamily: body, fontSize: "0.88rem", color: C.ember, margin: "6px 0 0" }}>
                      That doesn't look like a valid Bitcoin or ETH address.
                    </p>
                  )}
                  {!s5 && isValidAddress(addr) && <Ghost onClick={() => setAddrOk(true)}>Save address</Ghost>}
                  <p style={{ fontFamily: body, fontSize: "0.84rem", color: C.faint, margin: "10px 0 0", lineHeight: 1.55 }}>
                    We only need your public address. Nobody from Undead Ordinals will ever ask for a seed phrase.
                  </p>
                </Step>

                {err && <p style={{ fontFamily: body, color: C.ember, fontSize: "0.9rem", margin: "12px 0 0" }}>{err}</p>}

                <button onClick={send} disabled={!all || sending} style={{
                  width: "100%", marginTop: 16, padding: "17px",
                  background: all ? C.ice : "transparent", color: all ? C.void : C.faint,
                  border: `2px solid ${all ? C.ice : C.tomb}`, clipPath: notch(10),
                  fontFamily: display, fontSize: "0.72rem", letterSpacing: "0.04em", textTransform: "uppercase",
                  cursor: all && !sending ? "pointer" : "not-allowed",
                  boxShadow: all ? `0 0 28px ${C.ice}66` : "none",
                  transition: "background .2s, color .2s, border-color .2s, box-shadow .2s",
                }}>
                  {sending ? "Sealing…" : all ? (isWaitlist ? "Join the waitlist" : "Enter the raffle") : "Finish all five steps"}
                </button>
              </>
            )}
          </Panel>

          <p style={{ fontFamily: body, fontSize: "0.86rem", color: C.faint, textAlign: "center", margin: "18px auto 0", maxWidth: "48ch", lineHeight: 1.6 }}>
            Hold an OG Ordinals or ETH NFT? You can <Link href="/verify" style={{ color: C.ice }}>verify your holdings</Link> for a priority spot — no wallet connect required.
          </p>
        </div>
      </Section>
    </>
  );
}
