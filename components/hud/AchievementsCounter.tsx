"use client";

import { achievements } from "@/content/achievements";
import { unlockedCount, useStore } from "@/lib/store";

export function AchievementsCounter() {
  const count = useStore((s) => unlockedCount(s.unlocked));
  const setPanelOpen = useStore((s) => s.setPanelOpen);
  return (
    <button
      type="button"
      onClick={() => setPanelOpen(true)}
      className="pointer-events-auto whitespace-nowrap rounded-full border border-agent/40 bg-espresso/50 px-2.5 py-1 font-mono text-[11px] text-agent backdrop-blur-md hover:bg-agent hover:text-espresso"
      aria-label={`${count}/${achievements.length} achievements, open the list`}
    >
      🏆 {count}/{achievements.length}
    </button>
  );
}
