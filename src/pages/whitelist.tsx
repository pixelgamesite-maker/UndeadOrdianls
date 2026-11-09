import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Btn, Corners, Sigil, C, display, serif, black } from "@/components/ui";
import { X_URL, X_HANDLE, PINNED_URL, SHARE_TEMPLATE, WHITELIST_LIVE } from "@/lib/theme";
import { submitApplication, hasSupabase } from "@/lib/supabase";
import { rollPassport, type PassportData } from "@/lib/passport";
import { PassportCanvas, DownloadBtn } from "@/components/Passport";
import { isBtcAny, isXLink } from "@/lib/utils";

/* ── X intent helpers ───────────────────────────────────────── */
const POST_URL = PINNED_URL; // set to the real pinned tweet before launch
const enc = encodeURIComponent;
const site = () => (typeof window !== "undefined" ? window.location.origin : X_URL);
const statusId = (u: string) => /status\/(\d+)/.exec(u || "")?.[1] ?? null;

const QUOTE_TEXT = `The living are sleeping. The Undead are awakening. 🪦\n\nJoin the ${X_HANDLE} waitlist 👇`;
const REPLY_TEXT = `Tagging 2 frens who need to rise from the dead 🪦\n@ @`;

const quoteIntent = () => `https://x.com/intent/tweet?text=${enc(QUOTE_TEXT)}&url=${enc(POST_URL)}`;
const replyIntent = () => { const id = statusId(POST_URL); return id ? `https://x.com/intent/tweet?in_reply_to=${id}&text=${enc(REPLY_TEXT)}` : POST_URL; };
const postIntent = (p: PassportData) => `https://x.com/intent/tweet?text=${enc(SHARE_TEMPLATE.replace("[FACTION]", p.faction).replace("[PASS ID]", p.passId).replace("[LINK]", site()))}`;

const STEPS = [
  { t: "Like the post",            d: "Show the Undead some love. Open the pinned post and smash the like." },
  { t: "Quote-RT with the text",   d: "Repost it with the pre-written caption so your timeline knows you've risen." },
  { t: "Comment & tag 2 frens",    d: "Drag two friends into the afterlife. Reply to the post and tag them." },
  { t: "Generate your Passport",   d: "Mint your one-of-a-kind Waitlist Passport — random colours, mood and Undead." },
  { t: "Post your Passport on X",  d: "Download your card, then post it with your pre-written caption." },
  { t: "Submit your tweet link",   d: "Paste the link to the passport tweet you just posted." },
  { t: "Submit your BTC address",  d: "Drop the Bitcoin address you'll mint with. No wallet connection, ever." },
];

const field: CSSProperties = {
  width: "100%", background: C.slab, color: C.boneHi, border: `1px solid ${C.stoneUp}`,
  padding: "14px 15px", fontSize: "1rem", fontFamily: display, outline: "none", boxSizing: "border-box",
};
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];
const LS = "uo_wl_v2";

export default function Whitelist() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<boolean[]>(Array(7).fill(false));
  const [handle, setHandle] = useState("");
  const [pass, setPass] = useState<PassportData | null>(null);
  const [tweet, setTweet] = useState("");
  const [addr, setAddr] = useState("");
  const [finished, setFinished] = useState(false);
  const [ids, setIds] = useState<number[]>([]);

  // load the NFT manifest once
  useEffect(() => {
    fetch("/nfts-manifest.json").then((r) => r.json()).then((j) => setIds(j.ids || [])).catch(() => setIds([]));
  }, []);

  // restore a finished submission
  useEffect(() => {
    try {
      if (localStorage.getItem("uo_wl_sent") === "true") {
        const saved = JSON.parse(localStorage.getItem(LS) || "{}");
        if (saved.pass) { setPass(saved.pass); setHandle(saved.pass.handle || ""); }
        setFinished(true);
      }
    } catch {}
  }, []);

  const complete = (i: number) => {
    const nd = [...done]; nd[i] = true; setDone(nd);
    setStep(Math.min(6, i + 1));
  };

  function regenerate() {
    if (!handle.trim()) return;
    setPass(rollPassport(handle, ids));
  }

  async function finish() {
    if (!isBtcAny(addr) || !pass) return;
    try {
      if (hasSupabase()) {
        await submitApplication({
          address: addr, twitter: handle, quote_url: tweet, comment_url: pass.serial, phase: "waitlist",
          passport: pass,
        });
      }
    } catch { /* proceed locally regardless */ }
    try {
      localStorage.setItem("uo_wl_sent", "true");
      localStorage.setItem(LS, JSON.stringify({ pass, address: addr.trim() }));
    } catch {}
    const nd = [...done]; nd[6] = true; setDone(nd);
    setFinished(true);
  }

  if (!WHITELIST_LIVE) return <SoonScreen />;
  if (finished) return <Done pass={pass} onCheck={() => navigate("/check")} />;

  const progress = done.filter(Boolean).length;

  return (
    <section style={{ position: "relative", minHeight: "calc(100vh - 68px)", padding: "clamp(40px,7vw,78px) clamp(16px,5vw,40px) clamp(56px,8vw,96px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(59,224,123,0.1), transparent 55%)" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><Sigil size={46} color={C.rune} /></div>
          <h1 style={{ fontFamily: black, fontWeight: 400, fontSize: "clamp(2rem,6.5vw,3.3rem)", color: C.boneHi, margin: 0, lineHeight: 1.05 }}>Join the Waitlist</h1>
          <p style={{ fontFamily: serif, fontSize: "clamp(1.02rem,2.4vw,1.2rem)", color: C.muted, margin: "14px auto 0", maxWidth: "44ch", lineHeight: 1.6 }}>
            Seven rites stand between you and the afterlife. Complete each to secure your Passport and your place in the horde.
          </p>
          {/* progress */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 20 }}>
            {ROMAN.map((_, i) => (
              <span key={i} style={{ width: 28, height: 5, background: i < progress ? C.rune : C.stoneUp, boxShadow: i < progress ? `0 0 8px ${C.rune}66` : "none" }} />
            ))}
          </div>
          <p style={{ fontFamily: display, fontSize: "0.74rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.rune, margin: "10px 0 0" }}>{progress} / 7 rites complete</p>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {STEPS.map((s, i) => (
            <Rite key={i} i={i} title={s.t} desc={s.d} state={done[i] ? "done" : i === step ? "active" : i < step ? "done" : "locked"} onOpen={() => setStep(i)}>
              {/* per-step body, only when active */}
              {i === step && !done[i] && (
                <div style={{ marginTop: 14 }}>
                  {i <= 2 && (
                    <>
                      <ActionLink href={i === 0 ? POST_URL : i === 1 ? quoteIntent() : replyIntent()}>
                        {i === 0 ? "Open post → Like it" : i === 1 ? "Open X → Quote-RT" : "Open X → Reply & tag 2"}
                      </ActionLink>
                      <ConfirmRow onConfirm={() => complete(i)} label="I've done it" />
                    </>
                  )}

                  {i === 3 && (
                    <div>
                      <label style={lbl}>Your X handle</label>
                      <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@yourhandle" spellCheck={false}
                        style={{ ...field, marginTop: 8 }} onKeyDown={(e) => e.key === "Enter" && regenerate()}
                        onFocus={(e) => (e.target.style.borderColor = C.rune)} onBlur={(e) => (e.target.style.borderColor = C.stoneUp)} />
                      <div style={{ marginTop: 12 }}>
                        <Btn full onClick={regenerate}>{pass ? "Reroll the passport" : "Generate my passport"}</Btn>
                      </div>
                      {pass && (
                        <div style={{ marginTop: 16 }}>
                          <PassportCanvas pass={pass} />
                          <p style={{ fontFamily: serif, fontSize: "0.92rem", color: C.faint, textAlign: "center", margin: "10px 0 0" }}>
                            Not feeling it? Reroll for new colours, mood and Undead.
                          </p>
                          <div style={{ marginTop: 12 }}>
                            <Btn tone="ghost" color={C.rune} full onClick={() => complete(i)}>Lock it in → next rite</Btn>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {i === 4 && pass && (
                    <div>
                      <div style={{ marginBottom: 10 }}><DownloadBtn pass={pass} /></div>
                      <ActionLink href={postIntent(pass)}>Open X → Post my passport</ActionLink>
                      <p style={{ fontFamily: serif, fontSize: "0.9rem", color: C.faint, margin: "10px 0 0", lineHeight: 1.5 }}>
                        Download the card first, then attach it to the pre-filled post on X.
                      </p>
                      <ConfirmRow onConfirm={() => complete(i)} label="I posted it" />
                    </div>
                  )}
                  {i === 4 && !pass && <Nudge>Generate your passport in Rite IV first.</Nudge>}

                  {i === 5 && (
                    <div>
                      <label style={lbl}>Link to your passport tweet</label>
                      <input value={tweet} onChange={(e) => setTweet(e.target.value)} placeholder="https://x.com/you/status/…" spellCheck={false}
                        style={{ ...field, marginTop: 8 }} onFocus={(e) => (e.target.style.borderColor = C.rune)} onBlur={(e) => (e.target.style.borderColor = C.stoneUp)} />
                      {tweet && !isXLink(tweet) && <p style={errTxt}>That doesn't look like an X / Twitter link.</p>}
                      <div style={{ marginTop: 12 }}>
                        <Btn full onClick={() => isXLink(tweet) && complete(i)}>Save link → next rite</Btn>
                      </div>
                    </div>
                  )}

                  {i === 6 && (
                    <div>
                      <label style={lbl}>Your Bitcoin address</label>
                      <input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="bc1p…   /   bc1q…   /   1…   /   3…" spellCheck={false}
                        style={{ ...field, marginTop: 8 }} onFocus={(e) => (e.target.style.borderColor = C.rune)} onBlur={(e) => (e.target.style.borderColor = C.stoneUp)} />
                      {addr && !isBtcAny(addr) && <p style={errTxt}>That doesn't look like a valid Bitcoin address.</p>}
                      <div style={{ marginTop: 12 }}>
                        <Btn full onClick={finish}>Submit & secure my spot</Btn>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Rite>
          ))}
        </div>

        <p style={{ fontFamily: serif, fontSize: "0.9rem", color: C.faint, textAlign: "center", margin: "26px auto 0", maxWidth: "50ch", lineHeight: 1.6 }}>
          Already risen? <Link href="/check" style={{ color: C.rune, borderBottom: `1px solid ${C.rune}66` }}>Check your waitlist status →</Link>
        </p>
      </div>
    </section>
  );
}

/* ── one rite row ─────────────────────────────────────────────── */
function Rite({ i, title, desc, state, onOpen, children }: {
  i: number; title: string; desc: string; state: "done" | "active" | "locked"; onOpen: () => void; children?: ReactNode;
}) {
  const active = state === "active", doneS = state === "done", locked = state === "locked";
  const accent = doneS ? C.rune : active ? C.ember : C.faint;
  return (
    <div style={{ position: "relative", border: `1px solid ${active ? C.ember : C.stoneUp}`, background: active ? "rgba(14,26,18,0.8)" : C.stone, opacity: locked ? 0.55 : 1, transition: "opacity .2s, border-color .2s" }}>
      {active && <Corners color={C.ember} size={13} />}
      <button onClick={() => !locked && onOpen()} disabled={locked}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "15px 16px", background: "transparent", border: "none", textAlign: "left", cursor: locked ? "default" : "pointer" }}>
        <span style={{ flexShrink: 0, width: 40, height: 40, display: "grid", placeItems: "center", border: `1px solid ${accent}`, color: accent, fontFamily: black, fontSize: "1.15rem" }}>
          {doneS ? "✓" : ROMAN[i]}
        </span>
        <span style={{ flex: 1 }}>
          <span style={{ display: "block", fontFamily: display, fontWeight: 700, fontSize: "0.96rem", color: doneS ? C.rune : C.boneHi, textTransform: "uppercase", letterSpacing: "0.02em" }}>{title}</span>
          <span style={{ display: "block", fontFamily: serif, fontSize: "0.94rem", color: C.muted, marginTop: 3, lineHeight: 1.45 }}>{desc}</span>
        </span>
        {locked && <span style={{ color: C.faint, fontSize: "0.9rem" }}>🔒</span>}
      </button>
      {children && <div style={{ padding: "0 16px 16px" }}>{children}</div>}
    </div>
  );
}

const lbl: CSSProperties = { fontFamily: display, fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: C.boneHi };
const errTxt: CSSProperties = { fontFamily: serif, fontSize: "0.88rem", color: C.oxblood, margin: "8px 0 0" };

function ActionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: display, fontSize: "0.86rem", color: C.ash, background: C.ember, border: `1.5px solid ${C.ember}`, padding: "13px 20px", boxShadow: `3px 3px 0 ${C.emberLo}`, cursor: "pointer" }}>
        <XGlyph /> {children}
      </span>
    </a>
  );
}

function ConfirmRow({ onConfirm, label }: { onConfirm: () => void; label: string }) {
  return (
    <button onClick={onConfirm} style={{ width: "100%", marginTop: 10, background: "transparent", color: C.rune, border: `1px solid ${C.rune}`, padding: "12px", fontFamily: display, fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", transition: "background .15s, color .15s" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = C.rune; e.currentTarget.style.color = C.ash; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.rune; }}>
      {label} → continue
    </button>
  );
}

function Nudge({ children }: { children: ReactNode }) {
  return <p style={{ fontFamily: serif, fontSize: "0.94rem", color: C.ember, margin: 0 }}>{children}</p>;
}

/* ── finished ─────────────────────────────────────────────────── */
function Done({ pass, onCheck }: { pass: PassportData | null; onCheck: () => void }) {
  return (
    <section style={{ position: "relative", minHeight: "calc(100vh - 68px)", padding: "clamp(48px,8vw,90px) clamp(16px,5vw,40px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(59,224,123,0.12), transparent 55%)" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Sigil size={54} color={C.rune} /></div>
        <h1 style={{ fontFamily: black, fontWeight: 400, fontSize: "clamp(2.1rem,7vw,3.4rem)", color: C.boneHi, margin: 0, lineHeight: 1.05 }}>You're on the waitlist.</h1>
        <p style={{ fontFamily: serif, fontSize: "1.1rem", color: C.muted, margin: "16px auto 26px", maxWidth: "44ch", lineHeight: 1.65 }}>
          Your Passport is signed and your Bitcoin address is in the ledger. Welcome to the afterlife.
        </p>
        {pass && (
          <div style={{ marginBottom: 20 }}>
            <PassportCanvas pass={pass} />
            <div style={{ maxWidth: 320, margin: "14px auto 0" }}><DownloadBtn pass={pass} /></div>
          </div>
        )}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn onClick={onCheck}>Check my waitlist status</Btn>
          {pass && <Btn href={postIntent(pass)} tone="ghost" color={C.rune}>Share again on X</Btn>}
        </div>
      </div>
    </section>
  );
}

function SoonScreen() {
  return (
    <section style={{ minHeight: "calc(100vh - 68px)", display: "grid", placeItems: "center", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ maxWidth: 440 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Sigil size={50} color={C.ember} /></div>
        <h1 style={{ fontFamily: black, fontWeight: 400, fontSize: "clamp(1.9rem,6vw,2.8rem)", color: C.boneHi, margin: 0 }}>The gate opens soon.</h1>
        <p style={{ fontFamily: serif, fontSize: "1.05rem", color: C.muted, margin: "16px 0 24px", lineHeight: 1.6 }}>
          Waitlist rites aren't live yet. Follow along so you don't miss the awakening.
        </p>
        <Btn href={X_URL}>{`Follow ${X_HANDLE}`}</Btn>
      </div>
    </section>
  );
}

function XGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
