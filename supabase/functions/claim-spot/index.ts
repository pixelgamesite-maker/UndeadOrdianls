// supabase/functions/claim-spot/index.ts
//
// Deploy with:
//   supabase functions deploy claim-spot
//
// This is the ONLY thing allowed to write to spot_claims. It uses the
// service-role key — set automatically by Supabase as
// SUPABASE_SERVICE_ROLE_KEY, you don't add this secret yourself — which
// bypasses RLS, so it can read holder_eligibility (which anon can't
// touch) and insert a confirmed spot once it has verified the address is
// actually in the holder snapshot for that community.
//
// Checking eligibility in the browser instead of here would mean anyone
// could skip the check by calling the REST API directly with their own
// address. The check only means anything if it happens somewhere the
// caller can't bypass it.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Hard ceiling the function enforces regardless of what the UI shows.
// Keep in sync with CLAIM_TOTAL in src/lib/theme.ts.
const TOTAL_SPOTS = 6000;

const isBtc = (a: string) => /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(a);
const isEvm = (a: string) => /^0x[0-9a-fA-F]{40}$/.test(a);
const isValidAddress = (a: string) => isBtc(a) || isEvm(a);

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const { address, community } = await req.json();

    if (typeof address !== "string" || !isValidAddress(address.trim())) {
      return json({ error: "That doesn't look like a valid Bitcoin or ETH address." }, 400);
    }
    if (typeof community !== "string" || !community.trim()) {
      return json({ error: "Missing community." }, 400);
    }

    // Bitcoin addresses are case-sensitive (bech32 is lowercase; base58
    // mixed-case), so we do NOT lowercase them. EVM addresses we lowercase
    // for consistent matching. The snapshot must be imported the same way.
    const normAddr = isEvm(address.trim()) ? address.trim().toLowerCase() : address.trim();
    const normCommunity = community.trim();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Best-effort cap check. Not airtight against extreme concurrency
    // (two requests could both pass before either inserts) — acceptable
    // for a first-come claim; the unique constraint below is the real guard.
    const { count: claimed, error: countErr } = await supabase
      .from("spot_claims")
      .select("*", { count: "exact", head: true });
    if (countErr) return json({ error: "Could not check spot count. Try again." }, 500);
    if ((claimed ?? 0) >= TOTAL_SPOTS) {
      return json({ error: "All spots have been claimed." }, 400);
    }

    // Eligibility — the address must appear in the snapshot for this
    // community. Address compared exactly (BTC is case-sensitive);
    // community compared case-insensitively.
    const { data: eligible, error: eligErr } = await supabase
      .from("holder_eligibility")
      .select("id")
      .eq("address", normAddr)
      .ilike("community", normCommunity)
      .maybeSingle();
    if (eligErr) return json({ error: "Could not check eligibility. Try again." }, 500);
    if (!eligible) {
      return json({ error: "This address isn't holding a verified NFT for that community. Make sure you pasted the address that holds the inscription/NFT." }, 400);
    }

    // The unique constraint on `address` is what actually stops a double
    // claim even if two requests race past the checks above.
    const { data: inserted, error: insertErr } = await supabase
      .from("spot_claims")
      .insert([{ address: normAddr, community: normCommunity }])
      .select("spot_number")
      .single();

    if (insertErr) {
      if (insertErr.code === "23505") {
        return json({ error: "This address has already claimed a spot." }, 400);
      }
      return json({ error: "That didn't go through. Try again." }, 500);
    }

    return json({ spot_number: inserted.spot_number }, 200);
  } catch {
    return json({ error: "Something went wrong. Try again." }, 500);
  }
});
