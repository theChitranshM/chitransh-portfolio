"use client";

import { site } from "@/content/site";
import { useStore } from "@/lib/store";
import { chipClass } from "./OriginActions";

export function SubChip() {
  const setTooltip = useStore((s) => s.setTooltip);
  return (
    <div className="mt-5" data-reveal>
      <button
        type="button"
        className={chipClass}
        aria-label="about the mini student union building"
        onClick={() => setTooltip({ id: "sub", text: site.ticket.subTooltip })}
      >
        🏛 the SUB
      </button>
    </div>
  );
}
