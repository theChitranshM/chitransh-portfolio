"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { chapters } from "@/content/site";
import { achievements } from "@/content/achievements";
import { unlockedCount, useStore } from "@/lib/store";
import { formatClock } from "@/lib/time";
import { scrollToChapter } from "@/lib/scrollApi";
import { track } from "@/lib/analytics";

const pill =
  "pointer-events-auto inline-flex min-h-[36px] items-center rounded-full border border-milk/20 bg-espresso/50 px-3 font-mono text-[11px] uppercase tracking-[0.08em] text-milk/85 backdrop-blur-md transition-colors hover:border-agent hover:text-agent";

export function Wordmark() {
  return (
    <button
      type="button"
      onClick={() => scrollToChapter(0)}
      className="pointer-events-auto font-display text-[26px] italic leading-none text-milk"
      aria-label="chitransh, back to the top"
    >
      chitransh
    </button>
  );
}

export function SoundToggle() {
  const on = useStore((s) => s.sound);
  const toggle = useStore((s) => s.toggleSound);
  return (
    <button type="button" onClick={toggle} className={pill} aria-pressed={on} aria-label={on ? "turn sound off" : "turn sound on"}>
      <span aria-hidden className="mr-1.5 flex h-3 items-end gap-[2px]">
        {[0.5, 1, 0.7].map((h, i) => (
          <span
            key={i}
            className={`w-[2px] rounded-full bg-current ${on ? "animate-[eq_0.9s_ease-in-out_infinite]" : ""}`}
            style={{ height: `${on ? h * 100 : 25}%`, animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
      {on ? "sound on" : "sound off"}
    </button>
  );
}

export function RecruiterButton() {
  return (
    <Link href="/recruiter" className={`${pill} border-crema/40`} onClick={() => track("recruiter_mode_opened", { from: "hud" })}>
      recruiter mode
    </Link>
  );
}

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
      aria-label={`caffeine ${caffeine} percent. click to refill`}
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

export function Clock() {
  const time = useStore((s) => formatClock(s.progress));
  return (
    <p className="hud-label whitespace-nowrap text-milk/85" aria-label={`time in the story: ${time}`}>
      {time}
      <span className="hidden sm:inline"> · VANCOUVER</span>
    </p>
  );
}

export function AchievementsCounter() {
  const count = useStore((s) => unlockedCount(s.unlocked));
  const setPanelOpen = useStore((s) => s.setPanelOpen);
  return (
    <button
      type="button"
      onClick={() => setPanelOpen(true)}
      className="pointer-events-auto whitespace-nowrap rounded-full border border-agent/40 bg-espresso/50 px-2.5 py-1 font-mono text-[11px] text-agent backdrop-blur-md hover:bg-agent hover:text-espresso"
      aria-label={`achievements: ${count} of ${achievements.length}. open the list`}
    >
      🏆 {count}/{achievements.length}
    </button>
  );
}

export function ChapterNav() {
  const active = useStore((s) => s.chapter);
  const bar = useRef<HTMLDivElement>(null);
  useEffect(
    () =>
      useStore.subscribe((s) => {
        if (bar.current) bar.current.style.transform = `scaleX(${s.progress})`;
      }),
    [],
  );
  return (
    <>
      {/* phones: thin progress bar */}
      <div className="fixed inset-x-0 top-0 z-30 h-[2px] bg-milk/10 wide:hidden" aria-hidden>
        <div ref={bar} className="h-full origin-left scale-x-0 bg-agent" />
      </div>
      {/* desktop: labels on the right edge */}
      <nav aria-label="chapters" className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 wide:block">
        <ol className="flex flex-col items-end gap-2.5">
          {chapters.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => scrollToChapter(i)}
                aria-current={active === i ? "step" : undefined}
                className="group flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-milk/40 transition-colors hover:text-milk aria-[current=step]:text-agent"
              >
                <span className="opacity-0 transition-opacity group-hover:opacity-100 group-aria-[current=step]:opacity-100">{c.label}</span>
                <span className="h-[2px] w-3 rounded-full bg-current transition-all group-aria-[current=step]:w-6" />
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export function Hud() {
  const reel = useStore((s) => s.reel);
  const entered = useStore((s) => s.entered);
  return (
    <div className={`transition-opacity duration-700 ${entered ? "opacity-100" : "opacity-0"}`}>
      {!reel && <ChapterNav />}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-[calc(14px+var(--safe-top))] wide:px-6 wide:pt-5">
        <Wordmark />
        {!reel && (
          <div className="flex items-center gap-2">
            <SoundToggle />
            <RecruiterButton />
          </div>
        )}
      </header>
      {/* phones: meters sit under the header so the bottom 40% stays free for text */}
      <div className="pointer-events-none fixed inset-x-0 top-[calc(62px+var(--safe-top))] z-30 flex items-center justify-between px-4 wide:bottom-5 wide:top-auto wide:px-6">
        <CaffeineMeter />
        <div className="flex items-center gap-3">
          <Clock />
          {!reel && <AchievementsCounter />}
        </div>
      </div>
    </div>
  );
}
