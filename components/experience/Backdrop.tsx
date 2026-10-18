"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { skyAt } from "@/lib/time";

/** gradient sky behind everything: stand-in for the 3D, and the fallback without WebGL */
export function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const apply = (p: number) => {
      const s = skyAt(p);
      const el = ref.current;
      if (!el) return;
      el.style.setProperty("--sky-top", s.top);
      el.style.setProperty("--sky-bottom", s.bottom);
    };
    apply(useStore.getState().progress);
    return useStore.subscribe((st, prev) => {
      if (st.progress !== prev.progress) apply(st.progress);
    });
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-0"
      style={{
        background:
          "radial-gradient(120% 70% at 50% 0%, var(--sky-top, #f3a65f) 0%, var(--sky-bottom, #ffd79a) 28%, #2A1A12 62%, #140D09 100%)",
      }}
    />
  );
}
