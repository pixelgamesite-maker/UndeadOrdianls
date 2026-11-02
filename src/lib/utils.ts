/* Address validation + helpers. We accept two address families because
   the raffle spans Ordinals (Bitcoin) and ETH communities:
   - Bitcoin taproot (bc1p…) — where Ordinals inscriptions live
   - EVM (0x…40 hex) — for the ETH-collection phase
   Native-segwit / legacy BTC are also accepted so no real holder is
   turned away by the format check. */

export const isTaproot = (a: string) => /^bc1p[0-9a-z]{39,59}$/i.test(a.trim());
export const isBtcAny = (a: string) =>
  /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(a.trim());
export const isEvm = (a: string) => /^0x[0-9a-fA-F]{40}$/.test(a.trim());

export const isValidAddress = (a: string) => isBtcAny(a) || isEvm(a);

export const shorten = (a: string, lead = 6, tail = 5) =>
  a ? `${a.slice(0, lead)}…${a.slice(-tail)}` : "";

export function isXLink(u: string) {
  try {
    const p = new URL(u.trim());
    if (p.protocol !== "https:" && p.protocol !== "http:") return false;
    const host = p.hostname.replace(/^www\./, "").toLowerCase();
    return host === "x.com" || host === "twitter.com";
  } catch {
    return false;
  }
}

export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
