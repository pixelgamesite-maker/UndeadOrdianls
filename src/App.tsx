import { useEffect, useState } from "react";
import { Router, Route, Switch, useLocation, Link } from "wouter";
import Layout from "@/components/Layout";
import Intro from "@/components/Intro";
import { Btn, Wordmark, Sigil, C, serif } from "@/components/ui";
import { playClick, startMusic } from "@/lib/audio";

import Home from "@/pages/home";
import Collection from "@/pages/collection";
import Whitelist from "@/pages/whitelist";
import Crypts from "@/pages/crypts";
import Whitepaper from "@/pages/whitepaper";
import Shop from "@/pages/shop";
import Check from "@/pages/check";

function ScrollTop() {
  const [loc] = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [loc]);
  return null;
}

function NotFound() {
  return (
    <div style={{ minHeight: "74vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24, textAlign: "center" }}>
      <Sigil size={64} color={C.rune} />
      <Wordmark size="clamp(2rem,9vw,4rem)">404</Wordmark>
      <p className="standfirst" style={{ fontFamily: serif, fontSize: "1.25rem", color: C.muted, margin: 0, maxWidth: "40ch", lineHeight: 1.6 }}>
        This crypt is empty. The link is wrong, not the chain.
      </p>
      <Link href="/"><Btn>Back to the surface</Btn></Link>
    </div>
  );
}

export default function App() {
  // Gate shows once per browser (localStorage), not every session.
  const [entered, setEntered] = useState(() => {
    try { return localStorage.getItem("uo_entered") === "1"; } catch { return false; }
  });

  /* UI click sound + first-gesture music start, for every button/link. */
  useEffect(() => {
    const h = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      startMusic();
      if (t && t.closest && t.closest("button, a")) playClick();
    };
    window.addEventListener("pointerdown", h);
    return () => window.removeEventListener("pointerdown", h);
  }, []);

  function enter() {
    try { localStorage.setItem("uo_entered", "1"); } catch { /* ignore */ }
    setEntered(true);
  }

  return (
    <Router>
      <ScrollTop />
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/collection" component={Collection} />
          <Route path="/crypts" component={Crypts} />
          <Route path="/shop" component={Shop} />
          <Route path="/check" component={Check} />
          <Route path="/whitelist" component={Whitelist} />
          <Route path="/waitlist" component={Whitelist} />
          <Route path="/whitepaper" component={Whitepaper} />
          {/* legacy redirects */}
          <Route path="/verify" component={Whitelist} />
          <Route path="/raffle" component={Whitelist} />
          <Route path="/catacombs" component={Crypts} />
          <Route path="/market" component={Shop} />
          <Route path="/store" component={Shop} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
      {!entered && <Intro onEnter={enter} />}
    </Router>
  );
}
