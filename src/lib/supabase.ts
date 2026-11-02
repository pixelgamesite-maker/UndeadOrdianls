import { createClient } from "@supabase/supabase-js";
import { DB } from "./theme";

/* The browser only ever gets the ANON key. It can INSERT raffle/waitlist
   applications (public interest), but it CANNOT read the holder snapshot
   or write a confirmed spot — those go through the claim-spot Edge
   Function, which uses the service_role key server-side. See
   supabase/schema.sql for the row-level-security policies that enforce
   this. */
const URL = import.meta.env.VITE_SUPABASE_URL ?? "";
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

/* createClient throws if given an empty/invalid URL, which would crash
   the whole site before the env vars are configured. We fall back to a
   syntactically-valid placeholder so the site always renders; every real
   call is gated behind hasSupabase(), so nothing hits the placeholder. */
export const supabase = createClient(
  URL || "https://placeholder.supabase.co",
  KEY || "placeholder-anon-key"
);

export const hasSupabase = () => !!URL && !!KEY;

export type Application = {
  address: string;
  twitter: string;
  quote_url: string;
  comment_url: string;
  phase: string;
};

/** Public raffle / waitlist entry. */
export async function submitApplication(row: Application) {
  return supabase.from(DB.applications).insert([
    {
      address: row.address.trim(),
      twitter: row.twitter.trim().replace(/^@/, ""),
      quote_url: row.quote_url.trim(),
      comment_url: row.comment_url.trim(),
      phase: row.phase,
    },
  ]);
}

/** Live count for the FOMO counter on /verify. */
export async function countClaims(): Promise<number | null> {
  const { count, error } = await supabase
    .from(DB.claims)
    .select("*", { count: "exact", head: true });
  if (error) return null;
  return count ?? 0;
}

export type ClaimResult =
  | { ok: true; spot: number }
  | { ok: false; error: string };

/** Verified-holder spot claim — gated entirely server-side. */
export async function claimSpot(address: string, community: string): Promise<ClaimResult> {
  try {
    const { data, error } = await supabase.functions.invoke(DB.claimFunction, {
      body: { address: address.trim(), community: community.trim() },
    });
    if (error) {
      // Supabase wraps non-2xx as an error; try to surface the real message.
      let msg = "That didn't go through. Try again.";
      try {
        const ctx = (error as { context?: { body?: string } }).context;
        if (ctx?.body) msg = JSON.parse(ctx.body).error ?? msg;
      } catch { /* keep default */ }
      return { ok: false, error: msg };
    }
    if (data?.error) return { ok: false, error: data.error };
    return { ok: true, spot: data.spot_number };
  } catch {
    return { ok: false, error: "Network error. Check your connection and try again." };
  }
}
