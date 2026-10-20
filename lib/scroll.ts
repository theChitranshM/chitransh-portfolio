"use client";

// The scroll engine: Lenis + ScrollTrigger feeding progress/chapter into the store.
// Loaded with a dynamic import while the loader is up; UI code uses lib/scrollApi.ts.
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "./store";
import { measureTops, setLenis } from "./scrollApi";

let tops: number[] = [];
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function update() {
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = Math.max(1, document.documentElement.scrollHeight - vh);
  const progress = clamp(y / max);
  if (!tops.length) tops = measureTops();
  // camera: which section we're in + how far through it
  let i = 0;
  while (i < tops.length - 1 && y >= tops[i + 1] - 1) i++;
  const next = i < tops.length - 1 ? tops[i + 1] : max;
  const f = clamp((y - tops[i]) / Math.max(1, next - tops[i]));
  // UI chapter: the section under the middle of the screen
  const mid = y + vh * 0.5;
  let c = 0;
  while (c < tops.length - 1 && mid >= tops[c + 1]) c++;
  if (y >= max - 2) c = tops.length - 1;
  useStore.getState().setScroll(progress, c, i + f);
}

export function initScroll({ smooth }: { smooth: boolean }) {
  gsap.registerPlugin(ScrollTrigger);
  let lenis: Lenis | null = null;
  const onTick = (time: number) => lenis?.raf(time * 1000);

  if (smooth) {
    lenis = new Lenis({ lerp: 0.09, syncTouch: false, wheelMultiplier: 0.9 });
    lenis.on("scroll", () => {
      ScrollTrigger.update();
      update();
    });
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);
  } else {
    window.addEventListener("scroll", update, { passive: true });
  }

  const onRefresh = () => {
    tops = measureTops();
    update();
  };
  ScrollTrigger.addEventListener("refresh", onRefresh);
  window.addEventListener("resize", onRefresh);
  onRefresh();

  return () => {
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    window.removeEventListener("resize", onRefresh);
    window.removeEventListener("scroll", update);
    gsap.ticker.remove(onTick);
    lenis?.destroy();
    setLenis(null);
  };
}
