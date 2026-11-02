import { useEffect } from "react";
import { Router, Route, Switch, useLocation, Link } from "wouter";
import Layout from "@/components/Layout";
import { Btn, GlitchText, C, mono, body } from "@/components/ui";

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
    <div style={{
      minHeight: "72vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 18, padding: 24, textAlign: "center",
    }}>
      <GlitchText size="clamp(2rem,9vw,4rem)">404</GlitchText>
      <p style={{ fontFamily: mono, fontSize: "1.3rem", color: C.muted, letterSpacing: "0.1em", margin: 0 }}>
        THIS CRYPT IS EMPTY. THE LINK IS WRONG, NOT THE CHAIN.
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
