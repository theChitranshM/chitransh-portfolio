"use client";

// Tiny scroll facade with no gsap/lenis imports, so the HUD and overlays can use it
// without pulling the scroll engine into the first load. lib/scroll.ts registers Lenis here.
import type Lenis from "lenis";

let lenis: Lenis | null = null;
let tops: number[] = [];

export function setLenis(l: Lenis | null) {
  lenis = l;
}

export function getLenis() {
  return lenis;
}

export function measureTops() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
  tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
  return tops;
}

export function chapterTops() {
  return measureTops().slice();
}

export function stopScroll(stop: boolean) {
  if (lenis) {
    if (stop) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = stop ? "hidden" : "";
}

export function scrollToChapter(index: number, opts: { immediate?: boolean; duration?: number } = {}) {
  const y = measureTops()[index] ?? 0;
  if (lenis) lenis.scrollTo(y, { immediate: opts.immediate, duration: opts.duration ?? 1.4, force: true });
  else window.scrollTo({ top: y, behavior: opts.immediate ? "auto" : "smooth" });
}

export function scrollToY(y: number, opts: { immediate?: boolean; duration?: number } = {}) {
  if (lenis) lenis.scrollTo(y, { immediate: opts.immediate, duration: opts.duration, force: true });
  else window.scrollTo({ top: y });
}
