/* ──────────────────────────────────────────────────────────────
   UNDEAD ORDINALS — Waitlist Passport generator

   Every passport is rolled fresh: a random palette, mood, tagline,
   faction, pass number and a random Undead from /public/nfts. It's
   drawn onto a <canvas> so it can be downloaded as a crisp PNG and
   posted to X. Horizontal social-card format (1200×628).
   ────────────────────────────────────────────────────────────── */
import { FACTIONS } from "./lore";

export type Palette = { name: string; bg: [string, string]; accent: string; text: string; sub: string };

export const PALETTES: Palette[] = [
  { name: "Grave",     bg: ["#0c2217", "#050f0a"], accent: "#3BE07B", text: "#EAF7EE", sub: "rgba(234,247,238,0.5)" },
  { name: "Ember",     bg: ["#2a1705", "#140a02"], accent: "#F7931A", text: "#FBEBD3", sub: "rgba(251,235,211,0.5)" },
  { name: "Oxblood",   bg: ["#260c09", "#140604"], accent: "#FF5B43", text: "#F8E3DF", sub: "rgba(248,227,223,0.5)" },
  { name: "Phantom",   bg: ["#06222d", "#03121a"], accent: "#5CD6EA", text: "#DEF6FA", sub: "rgba(222,246,250,0.5)" },
  { name: "Neomancer", bg: ["#190b2c", "#0c0518"], accent: "#A981F0", text: "#ECE2FA", sub: "rgba(236,226,250,0.5)" },
  { name: "Relic",     bg: ["#241d06", "#120d02"], accent: "#F6C945", text: "#FBF3D6", sub: "rgba(251,243,214,0.5)" },
  { name: "Toxic",     bg: ["#16240b", "#0a1205"], accent: "#A6F732", text: "#EDFAD6", sub: "rgba(237,250,214,0.5)" },
  { name: "Bone",      bg: ["#191b1f", "#0b0d10"], accent: "#E7E6D2", text: "#F4F3E6", sub: "rgba(244,243,230,0.5)" },
];

export const MOODS: [string, string][] = [
  ["MOOD", "DEAD INSIDE"],
  ["STATE", "NEWLY AWAKENED"],
  ["STATE", "TERMINALLY ONLINE"],
  ["CURSE", "DIAMOND HANDED"],
  ["VIBE", "GRAVELY MISTAKEN"],
  ["STATUS", "RUGGED BUT ALIVE"],
  ["AURA", "CRYPT KEEPER"],
  ["MOOD", "MOODY SAD"],
  ["STATE", "FADED & FEARLESS"],
  ["VIBE", "CHRONICALLY UNDEAD"],
  ["MOOD", "QUIETLY FERAL"],
  ["AURA", "BLOCK CONFIRMED"],
];

export const TAGLINES: string[] = [
  "Thunder in the charts, calm in the crypt.",
  "Dead in the streets, alive on the chain.",
  "Six feet under, still never selling.",
  "Buried my keys, kept my bags.",
  "The floor is cold. So am I.",
  "Awake at 4am, asleep in the market.",
  "Minted once. Haunting forever.",
  "No pulse, no paper hands.",
  "Rotting gracefully since genesis.",
  "Too undead to care, too early to quit.",
  "Inscribed on Bitcoin, dead everywhere else.",
  "Found peace. Lost the seed phrase.",
];

export type PassportData = {
  handle: string;
  faction: string;
  palette: Palette;
  moodLabel: string;
  moodValue: string;
  tagline: string;
  passId: string;    // e.g. "#1784"
  serial: string;    // e.g. "UO-CFD9-3958"
  month: string;     // e.g. "NOVEMBER / 2026"
  nftId: number | null;
};

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const hex = (n: number) => Array.from({ length: n }, () => "0123456789ABCDEF"[Math.floor(Math.random() * 16)]).join("");
const digits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");

/** Roll a fresh passport. `ids` is the list of available NFT numbers. */
export function rollPassport(handle: string, ids: number[]): PassportData {
  const [moodLabel, moodValue] = pick(MOODS);
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "long" }).toUpperCase() + " / " + now.getFullYear();
  return {
    handle: handle.trim().replace(/^@/, "") || "undead",
    faction: pick(FACTIONS).name,
    palette: pick(PALETTES),
    moodLabel, moodValue,
    tagline: pick(TAGLINES),
    passId: "#" + (1000 + Math.floor(Math.random() * 9000)),
    serial: "UO-" + hex(4) + "-" + digits(4),
    month,
    nftId: ids.length ? pick(ids) : null,
  };
}

function loadImg(src: string): Promise<HTMLImageElement | null> {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const FONT = '"Pixelify Sans", "Trebuchet MS", system-ui, sans-serif';
const W = 1200, H = 628, SCALE = 2;

export type StatusBadge = { label: string; color: string };

/** Draw the passport onto the canvas. Resolves when fully rendered
    (including the NFT art). Pass `status` to stamp a waitlist status
    pill (e.g. "WAITLISTED · GTD") onto the card. */
export async function drawPassport(canvas: HTMLCanvasElement, d: PassportData, status?: StatusBadge) {
  const fallbackSrc = "/SKELETON_TWO.png";
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(SCALE, SCALE);
  const { palette: p } = d;

  // background gradient
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, p.bg[0]);
  g.addColorStop(1, p.bg[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // accent bloom top-left
  const bloom = ctx.createRadialGradient(330, 300, 20, 330, 300, 460);
  bloom.addColorStop(0, hexA(p.accent, 0.16));
  bloom.addColorStop(1, hexA(p.accent, 0));
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, W, H);

  // outer frame
  ctx.strokeStyle = hexA(p.accent, 0.5);
  ctx.lineWidth = 2;
  roundRect(ctx, 14, 14, W - 28, H - 28, 22);
  ctx.stroke();

  // ── header row ──
  ctx.textBaseline = "alphabetic";
  ctx.font = `700 34px ${FONT}`;
  ctx.textAlign = "left";
  ctx.fillStyle = p.text;
  const wmX = 56, wmY = 92;
  ctx.fillText("Undead", wmX, wmY);
  const uw = ctx.measureText("Undead").width;
  ctx.fillStyle = p.accent;
  ctx.fillText("Ordinals", wmX + uw + 2, wmY);

  ctx.font = `600 18px ${FONT}`;
  ctx.fillStyle = p.sub;
  ctx.textAlign = "right";
  ctx.fillText(spaced("WAITLIST PASS"), W - 56, 86);

  // status pill (e.g. WAITLISTED · GTD), top-right under the label
  if (status) {
    ctx.font = `700 19px ${FONT}`;
    const lab = spaced(status.label.toUpperCase());
    const tw = ctx.measureText(lab).width;
    const pw = tw + 36, ph = 42, px = W - 56 - pw, py = 104;
    roundRect(ctx, px, py, pw, ph, 9);
    ctx.fillStyle = status.color;
    ctx.fill();
    ctx.fillStyle = "#06100A";
    ctx.textAlign = "center";
    ctx.fillText(lab, px + pw / 2, py + 28);
  }

  // ── avatar ──
  const ax = 56, ay = 150, asz = 300;
  ctx.save();
  roundRect(ctx, ax, ay, asz, asz, 26);
  ctx.clip();
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(ax, ay, asz, asz);
  const src = d.nftId ? `/nfts/nft_${d.nftId}.png` : fallbackSrc;
  let img = await loadImg(src);
  if (!img) img = await loadImg(fallbackSrc);
  if (img) {
    // cover-fit
    const r = Math.max(asz / img.width, asz / img.height);
    const dw = img.width * r, dh = img.height * r;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, ax + (asz - dw) / 2, ay + (asz - dh) / 2, dw, dh);
  }
  ctx.restore();
  ctx.strokeStyle = p.accent;
  ctx.lineWidth = 2;
  roundRect(ctx, ax, ay, asz, asz, 26);
  ctx.stroke();

  // ── right column ──
  const rx = ax + asz + 48;
  ctx.textAlign = "left";

  // handle
  ctx.font = `700 70px ${FONT}`;
  ctx.fillStyle = p.text;
  ctx.fillText(fit(ctx, "@" + d.handle, W - rx - 56, 70), rx, 236);

  // mood line
  ctx.font = `600 22px ${FONT}`;
  ctx.fillStyle = p.accent;
  ctx.fillText(spaced(`${d.moodLabel}  ·  ${d.moodValue}`), rx, 284);

  // tagline
  ctx.font = `400 28px ${FONT}`;
  ctx.fillStyle = p.text;
  ctx.fillText(fit(ctx, d.tagline, W - rx - 56, 28), rx, 338);

  // faction pill
  ctx.font = `600 18px ${FONT}`;
  const fl = spaced(d.faction.toUpperCase());
  const flw = ctx.measureText(fl).width;
  ctx.strokeStyle = hexA(p.accent, 0.6);
  ctx.lineWidth = 1.5;
  roundRect(ctx, rx, 372, flw + 34, 40, 8);
  ctx.stroke();
  ctx.fillStyle = p.accent;
  ctx.fillText(fl, rx + 17, 398);

  // ── dashed divider ──
  ctx.strokeStyle = hexA(p.text, 0.22);
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 8]);
  ctx.beginPath();
  ctx.moveTo(56, 472);
  ctx.lineTo(W - 56, 472);
  ctx.stroke();
  ctx.setLineDash([]);

  // ── footer ──
  ctx.font = `700 24px ${FONT}`;
  ctx.fillStyle = p.text;
  ctx.textAlign = "left";
  ctx.fillText(spaced(`PASS ${d.passId}  ·  ${d.month}`), 56, 528);

  ctx.font = `600 18px ${FONT}`;
  ctx.fillStyle = p.sub;
  ctx.fillText(spaced(d.serial), 56, 560);

  ctx.font = `700 20px ${FONT}`;
  ctx.fillStyle = p.accent;
  ctx.textAlign = "right";
  ctx.fillText(spaced("TBA UNDEAD · ONE AFTERLIFE"), W - 56, 548);
}

/* helpers */
function spaced(s: string) { return s.split("").join(" "); } // hair-space tracking
function hexA(hexColor: string, a: number) {
  if (hexColor.startsWith("rgba")) return hexColor;
  const h = hexColor.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
function fit(ctx: CanvasRenderingContext2D, text: string, maxW: number, startPx: number) {
  let px = startPx;
  // shrink font until it fits (handles long handles / taglines)
  // caller already set font; re-set while measuring
  const fam = ctx.font.replace(/^\d+ \d+px/, "").trim();
  const weight = ctx.font.split(" ")[0];
  while (px > 12) {
    ctx.font = `${weight} ${px}px ${fam}`;
    if (ctx.measureText(text).width <= maxW) break;
    px -= 2;
  }
  return text;
}
