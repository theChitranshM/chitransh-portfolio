"use client";

import { useEffect, useRef } from "react";
import { chapters } from "@/content/site";
import { useStore } from "@/lib/store";
import { scrollToChapter } from "@/lib/scrollApi";

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
                className="group flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-milk/60 transition-colors hover:text-milk aria-[current=step]:text-agent"
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
