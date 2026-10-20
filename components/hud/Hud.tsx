"use client";

import { useStore } from "@/lib/store";
import { AchievementsCounter } from "./AchievementsCounter";
import { CaffeineMeter } from "./CaffeineMeter";
import { ChapterNav } from "./ChapterNav";
import { Clock } from "./Clock";
import { RecruiterButton } from "./RecruiterButton";
import { SoundToggle } from "./SoundToggle";
import { Wordmark } from "./Wordmark";

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
