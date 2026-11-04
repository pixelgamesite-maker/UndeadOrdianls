/* ──────────────────────────────────────────────────────────────
   Audio — looping background score + UI click sound, with a global
   mute. Music can only start after a user gesture (browser policy),
   so startMusic() is called from the title-screen YES. Everything
   degrades silently if a file is missing or playback is blocked.
   ────────────────────────────────────────────────────────────── */
import { ASSET } from "./theme";
import { useEffect, useState } from "react";

const MUTE_KEY = "uo_muted";

let muted = (() => {
  try { return localStorage.getItem(MUTE_KEY) === "1"; } catch { return false; }
})();
let music: HTMLAudioElement | null = null;
let started = false;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export function isMuted() { return muted; }

export function subscribe(fn: () => void) {
  subs.add(fn);
  return () => { subs.delete(fn); };
}

export function startMusic() {
  if (started) return;
  started = true;
  try {
    music = new Audio(ASSET.music);
    music.loop = true;
    music.volume = 0.3;
    music.muted = muted;
    void music.play().catch(() => { /* blocked; a later gesture retries */ started = false; });
  } catch { started = false; }
}

export function toggleMute() {
  muted = !muted;
  try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch { /* ignore */ }
  if (music) music.muted = muted;
  emit();
}

let lastClick = 0;
export function playClick() {
  if (muted) return;
  const now = Date.now();
  if (now - lastClick < 60) return; // debounce rapid fire
  lastClick = now;
  try {
    const a = new Audio(ASSET.sfx);
    a.volume = 0.45;
    void a.play().catch(() => { /* ignore */ });
  } catch { /* ignore */ }
}

/** React binding for the mute toggle button. */
export function useMuted() {
  const [m, setM] = useState(muted);
  useEffect(() => subscribe(() => setM(isMuted())), []);
  return m;
}
