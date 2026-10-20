"use client";

import { useStore } from "@/lib/store";

const pill =
  "pointer-events-auto inline-flex min-h-[36px] items-center rounded-full border border-milk/20 bg-espresso/50 px-3 font-mono text-[11px] uppercase tracking-[0.08em] text-milk/85 backdrop-blur-md transition-colors hover:border-agent hover:text-agent";

export function SoundToggle() {
  const on = useStore((s) => s.sound);
  const toggle = useStore((s) => s.toggleSound);
  return (
    <button type="button" onClick={toggle} className={pill} aria-pressed={on}>
      <span aria-hidden className="mr-1.5 flex h-3 items-end gap-[2px]">
        {[0.5, 1, 0.7].map((h, i) => (
          <span
            key={i}
            className={`w-[2px] rounded-full bg-current ${on ? "animate-[eq_0.9s_ease-in-out_infinite]" : ""}`}
            style={{ height: `${on ? h * 100 : 25}%`, animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
      {on ? "sound on" : "sound off"}
    </button>
  );
}
