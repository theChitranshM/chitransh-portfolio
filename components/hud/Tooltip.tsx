"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";

/** speech bubble for robot / laurel / SUB / sneakers */
export function Tooltip() {
  const tip = useStore((s) => s.tooltip);
  const setTooltip = useStore((s) => s.setTooltip);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") last.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  useEffect(() => {
    if (!tip) return;
     
    setPos(last.current);
    const id = setTimeout(() => setTooltip(null), 3600);
    return () => clearTimeout(id);
  }, [tip, setTooltip]);
  if (!tip) return null;
  const style = pos
    ? { left: Math.min(window.innerWidth - 300, Math.max(12, pos.x + 18)), top: Math.max(80, pos.y - 70) }
    : undefined;
  return (
    <div
      role="status"
      style={style}
      className={`toast-in pointer-events-none fixed z-40 max-w-[280px] rounded-2xl rounded-bl-sm border border-agent/50 bg-espresso/95 px-4 py-2.5 text-[14.5px] leading-snug text-milk shadow-xl ${
        pos ? "" : "left-1/2 top-[calc(112px+var(--safe-top))] -translate-x-1/2"
      }`}
    >
      {tip.text}
    </div>
  );
}
