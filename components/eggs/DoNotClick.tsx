"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { useStore } from "@/lib/store";

/** the reverse psychology button */
export function DoNotClick() {
  const [clicked, setClicked] = useState(false);
  const unlock = useStore((s) => s.unlock);
  return (
    <button
      type="button"
      onClick={() => {
        setClicked(true);
        unlock("reverse-psychologist");
      }}
      className="rounded-full bg-cherry px-3 py-1.5 font-mono text-[11px] font-medium text-espresso shadow-[0_0_24px_-4px_#FF5A4E] transition-transform active:scale-95"
    >
      {clicked ? site.night.doNotClickAfter : site.night.doNotClick}
    </button>
  );
}
