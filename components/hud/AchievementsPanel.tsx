"use client";

import { useEffect } from "react";
import { achievements, dialedIn } from "@/content/achievements";
import { unlockedCount, useStore } from "@/lib/store";
import { stopScroll } from "@/lib/scrollApi";

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
