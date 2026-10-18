"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

const bubbles = [
  { text: "fix", time: "11:42 PM" },
  { text: "it's the same error", time: "11:43 PM" },
  { text: "BRO", time: "4:12 AM" },
];

/** typing "fix" plays a 1.6s chat moment (callback to his reel format) */
export function FixBro() {
  const at = useStore((s) => s.fixBro);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!at) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restart the animation on each trigger
    setRun(at);
    const id = setTimeout(() => setRun(0), 1900);
    return () => clearTimeout(id);
  }, [at]);
  if (!run) return null;
  return (
    <div key={run} aria-hidden className="fixbro pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-espresso/85 backdrop-blur-sm">
      <div className="flex w-[min(86vw,420px)] flex-col items-end gap-3">
        {bubbles.map((b, i) => (
          <div key={b.text} className="fixbro-bubble flex flex-col items-end" style={{ animationDelay: `${0.12 + i * 0.32}s` }}>
            <span className={`rounded-[20px] rounded-br-md bg-[#2b2b2e] px-4 py-2.5 text-milk ${b.text === "BRO" ? "text-[30px] font-bold" : "text-[17px]"}`}>
              {b.text}
            </span>
            <span className="mt-1 font-mono text-[10.5px] text-milk/45">{b.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
