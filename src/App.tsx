import { useEffect } from "react";
import { Router, Route, Switch, useLocation, Link } from "wouter";
import Layout from "@/components/Layout";
import { Btn, Wordmark, Sigil, C, display, serif } from "@/components/ui";

import Home from "@/pages/home";
import Collection from "@/pages/collection";
import Catacombs from "@/pages/catacombs";
import Whitepaper from "@/pages/whitepaper";
import Raffle from "@/pages/raffle";
import Verify from "@/pages/verify";

/* Scroll to top on every route change. */
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
  return (
    <Router>
      <ScrollTop />
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/collection" component={Collection} />
          <Route path="/catacombs" component={Catacombs} />
          <Route path="/whitepaper" component={Whitepaper} />
          <Route path="/raffle" component={Raffle} />
          <Route path="/verify" component={Verify} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
}
