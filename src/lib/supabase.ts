import { createClient } from "@supabase/supabase-js";
import { DB } from "./theme";

/* The browser only ever gets the ANON key. It can INSERT whitelist
   applications and nothing else — it can't read, edit or delete rows,
   so the list can't be scraped. See supabase/schema.sql for the
   row-level-security policy that enforces this. */
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

/** Whitelist registration. Inserts one row into wl_applications. */
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

export type AllocTier = "GTD" | "FCFS";

/* Eligibility lookup. Calls a SECURITY DEFINER function so the public
   can check ONE address at a time without being able to read (scrape)
   the whole allocation list. Returns the tier, or null if not on the
   list. See supabase/schema.sql for `check_allocation`. */
export async function checkAllocation(address: string): Promise<{ tier: AllocTier | null; error: string | null }> {
  const addr = address.trim();
  const { data, error } = await supabase.rpc("check_allocation", { addr });
  if (error) return { tier: null, error: error.message };
  const tier = (Array.isArray(data) ? data[0]?.tier : data) as string | undefined;
  return { tier: tier === "GTD" || tier === "FCFS" ? (tier as AllocTier) : null, error: null };
}
