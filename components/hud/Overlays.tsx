"use client";

import { useEffect, useRef, useState } from "react";
import { achievements, dialedIn } from "@/content/achievements";
import { unlockedCount, useStore, type Toast } from "@/lib/store";
import { stopScroll } from "@/lib/scroll";

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useStore((s) => s.dismissToast);
  useEffect(() => {
    const id = setTimeout(() => dismiss(toast.id), toast.kind === "gold" ? 7000 : 3800);
    return () => clearTimeout(id);
  }, [toast, dismiss]);
  const gold = toast.kind === "gold";
  const ach = toast.kind === "achievement";
  return (
    <li
      className={`toast-in pointer-events-auto flex w-[min(92vw,380px)] items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md ${
        gold ? "border-amber bg-[linear-gradient(135deg,#3a2614,#140D09)]" : ach ? "border-agent/50 bg-espresso/90" : "border-milk/15 bg-espresso/90"
      }`}
      role="status"
    >
      {toast.icon && (
        <span className="text-[22px] leading-none" aria-hidden>
          {toast.icon}
        </span>
      )}
      <span className="min-w-0">
        {toast.title && (
          <span className={`block font-mono text-[11px] uppercase tracking-[0.12em] ${gold ? "text-amber" : "text-agent"}`}>
            {ach ? "achievement · " : ""}
            {toast.title}
          </span>
        )}
        <span className="block text-[14.5px] leading-snug text-milk/90">{toast.line}</span>
      </span>
    </li>
  );
}

export function Toasts() {
  const toasts = useStore((s) => s.toasts);
  return (
    <ul className="pointer-events-none fixed inset-x-0 bottom-[calc(18px+var(--safe-bottom))] z-40 flex flex-col items-center gap-2 wide:bottom-16" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </ul>
  );
}

export function AchievementsPanel() {
  const open = useStore((s) => s.panelOpen);
  const setOpen = useStore((s) => s.setPanelOpen);
  const unlocked = useStore((s) => s.unlocked);
  const count = unlockedCount(unlocked);
  useEffect(() => {
    if (!open) return;
    stopScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      stopScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[46] flex items-end justify-center bg-espresso/70 backdrop-blur-sm wide:items-center" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ach-title"
        className="max-h-[80svh] w-full overflow-y-auto rounded-t-2xl border border-mocha bg-roast p-5 pb-[calc(20px+var(--safe-bottom))] wide:w-[440px] wide:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="ach-title" className="font-display text-[34px] leading-none">
            achievements
          </h2>
          <span className="font-mono text-[12px] text-agent">
            {count}/{achievements.length}
          </span>
        </div>
        <ul className="space-y-2">
          {achievements.map((a) => {
            const got = !!unlocked[a.id];
            return (
              <li key={a.id} className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${got ? "border-agent/40 bg-espresso/60" : "border-milk/10 opacity-55"}`}>
                <span className="text-[20px] leading-none" aria-hidden>
                  {got ? a.icon : "🔒"}
                </span>
                <span>
                  <span className={`block font-mono text-[12px] uppercase tracking-[0.1em] ${got ? "text-agent" : "text-milk/70"}`}>{a.title}</span>
                  <span className="block text-[14px] leading-snug text-milk/80">{got ? a.line : "locked"}</span>
                </span>
              </li>
            );
          })}
          {count === achievements.length && (
            <li className="flex items-start gap-3 rounded-xl border border-amber bg-espresso/60 px-3 py-2.5">
              <span className="text-[20px]" aria-hidden>
                {dialedIn.icon}
              </span>
              <span>
                <span className="block font-mono text-[12px] uppercase tracking-[0.1em] text-amber">{dialedIn.title}</span>
                <span className="block text-[14px] leading-snug text-milk/80">{dialedIn.line}</span>
              </span>
            </li>
          )}
        </ul>
        <button type="button" autoFocus onClick={() => setOpen(false)} className="mt-4 font-mono text-[12px] text-crema/70 hover:text-milk">
          close ✕
        </button>
      </div>
    </div>
  );
}

/** speech bubble for robot / laurel / SUB / sneakers */
export function Tooltip() {
  const tip = useStore((s) => s.tooltip);
  const setTooltip = useStore((s) => s.setTooltip);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") last.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  useEffect(() => {
    if (!tip) return;
     
    setPos(last.current);
    const id = setTimeout(() => setTooltip(null), 3600);
    return () => clearTimeout(id);
  }, [tip, setTooltip]);
  if (!tip) return null;
  const style = pos
    ? { left: Math.min(window.innerWidth - 300, Math.max(12, pos.x + 18)), top: Math.max(80, pos.y - 70) }
    : undefined;
  return (
    <div
      role="status"
      style={style}
      className={`toast-in pointer-events-none fixed z-40 max-w-[280px] rounded-2xl rounded-bl-sm border border-agent/50 bg-espresso/95 px-4 py-2.5 text-[14.5px] leading-snug text-milk shadow-xl ${
        pos ? "" : "left-1/2 top-[calc(112px+var(--safe-top))] -translate-x-1/2"
      }`}
    >
      {tip.text}
    </div>
  );
}

/** desktop-only cursor: dot + ring, ring grows with a word over 3D objects */
export function Cursor() {
  const label = useStore((s) => s.cursorLabel);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature detection after mount
    setEnabled(mq.matches);
    if (!mq.matches) return;
    document.documentElement.classList.add("has-cursor");
    const target = { x: -100, y: -100 };
    const cur = { x: -100, y: -100 };
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.2;
      cur.y += (target.y - cur.y) * 0.2;
      if (ring.current) ring.current.style.transform = `translate(${cur.x}px, ${cur.y}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  if (!enabled) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90]">
      <div ref={dot} className="absolute -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-milk mix-blend-difference" />
      <div ref={ring} className="absolute">
        <div
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 ease-out ${
            label ? "h-16 w-16 border-agent bg-agent/15" : "h-8 w-8 border-milk/50"
          }`}
        >
          <span className={`font-mono text-[10px] uppercase tracking-[0.1em] text-agent transition-opacity ${label ? "opacity-100" : "opacity-0"}`}>{label}</span>
        </div>
      </div>
    </div>
  );
}
