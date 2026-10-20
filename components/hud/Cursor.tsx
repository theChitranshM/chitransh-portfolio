"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";

/** desktop-only cursor: dot + ring, ring grows with a word over 3D objects */
export function Cursor() {
  const label = useStore((s) => s.cursorLabel);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature detection after mount
    setEnabled(mq.matches);
    if (!mq.matches) return;
    document.documentElement.classList.add("has-cursor");
    const target = { x: -100, y: -100 };
    const cur = { x: -100, y: -100 };
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.2;
      cur.y += (target.y - cur.y) * 0.2;
      if (ring.current) ring.current.style.transform = `translate(${cur.x}px, ${cur.y}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  if (!enabled) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90]">
      <div ref={dot} className="absolute -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-milk mix-blend-difference" />
      <div ref={ring} className="absolute">
        <div
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 ease-out ${
            label ? "h-16 w-16 border-agent bg-agent/15" : "h-8 w-8 border-milk/50"
          }`}
        >
          <span className={`font-mono text-[10px] uppercase tracking-[0.1em] text-agent transition-opacity ${label ? "opacity-100" : "opacity-0"}`}>{label}</span>
        </div>
      </div>
    </div>
  );
}
