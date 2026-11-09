import { useEffect, useRef, useState } from "react";
import { Btn, C } from "@/components/ui";
import { drawPassport, type PassportData, type StatusBadge } from "@/lib/passport";

/* Live-rendered passport card on a <canvas>. Pass `status` to stamp a
   waitlist status pill (e.g. "WAITLISTED · GTD") onto the card. */
export function PassportCanvas({ pass, status }: { pass: PassportData; status?: StatusBadge }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    drawPassport(el, pass, status);
    (document as any).fonts?.ready?.then?.(() => drawPassport(el, pass, status));
  }, [pass, status]);
  return (
    <div style={{ position: "relative", border: `1px solid ${C.stoneUp}` }}>
      <canvas ref={ref} style={{ width: "100%", height: "auto", display: "block" }} />
    </div>
  );
}

/* Renders the card off-screen and downloads it as a PNG. */
export function DownloadBtn({ pass, status, label = "⬇ Download card" }: { pass: PassportData; status?: StatusBadge; label?: string }) {
  const [busy, setBusy] = useState(false);
  async function dl() {
    setBusy(true);
    const canvas = document.createElement("canvas");
    await drawPassport(canvas, pass, status);
    canvas.toBlob((blob) => {
      if (blob) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `undead-passport-${pass.handle}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      }
      setBusy(false);
    }, "image/png");
  }
  return <Btn full onClick={dl}>{busy ? "Rendering…" : label}</Btn>;
}
