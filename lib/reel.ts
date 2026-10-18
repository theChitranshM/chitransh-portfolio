"use client";

import { gsap } from "gsap";
import { chapterTops, scrollToY } from "./scroll";
import { useStore } from "./store";

/**
 * /?reel=1&dur=12 : auto-scrolls the whole evening for a portrait screen recording.
 * Holds on the hero, the laptop and the twin; fix -> BRO at ~70%; ends on the night shot.
 */
export function startReel() {
  const params = new URLSearchParams(window.location.search);
  const dur = Math.min(60, Math.max(6, Number(params.get("dur")) || 12));
  document.documentElement.classList.add("reel-mode");

  const tops = chapterTops();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const vh = window.innerHeight;
  const at = (i: number, extra = 0) => Math.min(max, (tops[i] ?? 0) + extra * vh);

  const proxy = { y: 0 };
  const tl = gsap.timeline({ delay: 0.6, onUpdate: () => scrollToY(proxy.y, { immediate: true }) });
  const seg = (to: number, frac: number, ease = "power2.inOut") => tl.to(proxy, { y: to, duration: dur * frac, ease });
  const hold = (frac: number) => tl.to({}, { duration: dur * frac });

  hold(0.07); // hero
  seg(at(3, 0.25), 0.12); // into the laptop
  hold(0.11);
  seg(at(6, 0.2), 0.16, "power1.inOut"); // receipt, polaroids, twin
  tl.call(() => window.dispatchEvent(new CustomEvent("twin:demo", { detail: "why should i hire you?" })));
  hold(0.2);
  seg(max, 0.14);
  hold(Math.max(1 / dur, 0.2));
  tl.call(() => useStore.getState().triggerFixBro(), [], dur * 0.7 + 0.6);

  return () => {
    tl.kill();
    document.documentElement.classList.remove("reel-mode");
  };
}
