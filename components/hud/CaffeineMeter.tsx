"use client";

import { useStore } from "@/lib/store";

export function CaffeineMeter() {
  const caffeine = useStore((s) => Math.round(s.caffeine));
  const refilling = useStore((s) => s.refilling);
  const refill = useStore((s) => s.refill);
  const low = caffeine <= 20;
  return (
    <button
      type="button"
      onClick={refill}
      className={`pointer-events-auto flex items-center gap-2.5 rounded-full border bg-espresso/50 py-1.5 pl-2.5 pr-3.5 backdrop-blur-md transition-colors ${
        low ? "animate-pulse border-cherry/70" : "border-milk/20 hover:border-amber"
      }`}
      aria-label={`caffeine ${caffeine}%, click to refill`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" fill="none" stroke="#E9C9A1" strokeWidth="1.6" />
        <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" fill="none" stroke="#E9C9A1" strokeWidth="1.6" />
        <clipPath id="cup">
          <path d="M4.8 8.8h11.4V14a4.2 4.2 0 0 1-4.2 4.2H9A4.2 4.2 0 0 1 4.8 14z" />
        </clipPath>
        <rect x="4" y={8 + (1 - caffeine / 100) * 11} width="14" height="12" fill={low ? "#FF5A4E" : "#FFB547"} clipPath="url(#cup)" />
      </svg>
      <span className="hud-label whitespace-nowrap text-milk/90">
        {refilling ? "refilling" : "caffeine"} <span className={low ? "text-cherry" : "text-amber"}>{caffeine}%</span>
      </span>
    </button>
  );
}
