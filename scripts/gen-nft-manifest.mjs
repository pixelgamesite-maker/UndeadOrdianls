/* Scans public/nfts and writes public/nfts-manifest.json with the list
   of available nft ids. Runs automatically before every build (see the
   "prebuild" script), so newly uploaded NFTs are picked up on deploy —
   no code changes needed as the collection grows toward its final size. */
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public", "nfts");
let ids = [];
if (existsSync(dir)) {
  ids = readdirSync(dir)
    .map((f) => /^nft_(\d+)\.png$/i.exec(f))
    .filter(Boolean)
    .map((m) => Number(m[1]))
    .sort((a, b) => a - b);
}
const out = join(root, "public", "nfts-manifest.json");
writeFileSync(out, JSON.stringify({ count: ids.length, ids }));
console.log(`[nft-manifest] ${ids.length} NFTs → public/nfts-manifest.json`);
