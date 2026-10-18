"use client";

import { site } from "@/content/site";
import { useStore } from "@/lib/store";

export const chipClass =
  "rounded-full border border-milk/25 bg-espresso/40 px-3.5 py-2 font-mono text-[12px] text-milk/85 backdrop-blur-sm transition-colors hover:border-agent hover:text-agent min-h-[40px]";

/** DOM equivalents of the 3D robot and laurel, for keyboard and screen reader users. */
export function OriginActions() {
  const waveRobot = useStore((s) => s.waveRobot);
  const unlock = useStore((s) => s.unlock);
  const setTooltip = useStore((s) => s.setTooltip);
  return (
    <div className="mt-6 flex flex-wrap gap-2" data-reveal>
      <button type="button" className={chipClass} onClick={waveRobot} aria-label="poke the robot">
        🤖 robot
      </button>
      <button
        type="button"
        className={chipClass}
        aria-label="look at the laurel wreath"
        onClick={() => {
          setTooltip({ id: "laurel", text: site.origin.laurelTooltip });
          unlock("et-tu");
        }}
      >
        🏛️ laurel
      </button>
    </div>
  );
}
