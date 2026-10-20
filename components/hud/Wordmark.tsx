"use client";

import { scrollToChapter } from "@/lib/scrollApi";

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
