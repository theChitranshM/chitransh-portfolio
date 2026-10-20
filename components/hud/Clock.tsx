"use client";

import { useStore } from "@/lib/store";
import { formatClock } from "@/lib/time";

export function Clock() {
  const time = useStore((s) => formatClock(s.progress));
  return (
    <p className="hud-label whitespace-nowrap text-milk/85" aria-label={`time in the story: ${time}`}>
      {time}
      <span className="hidden sm:inline"> · VANCOUVER</span>
    </p>
  );
}
