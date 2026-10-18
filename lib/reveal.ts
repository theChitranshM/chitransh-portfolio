"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

const TEXT_TAGS = new Set(["H1", "H2", "H3", "P", "SPAN", "EM"]);

/**
 * Line-by-line mask reveals (SplitText, expo.out, 0.8s, 0.06s stagger) as each chapter enters.
 * Text is visible by default (no-JS, reduced motion); this only hides it right before animating.
 */
export function setupReveals() {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const ctx = gsap.context(() => {
    document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
      const els = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));
      const section = group.closest("section") ?? group;
      const splits: SplitText[] = [];
      const targets: Element[] = [];
      for (const el of els) {
        const isText = TEXT_TAGS.has(el.tagName) && !el.querySelector("button, a, input");
        if (isText) {
          const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
          splits.push(split);
          targets.push(...split.lines);
        } else targets.push(el);
      }
      gsap.set(targets, { yPercent: 110, opacity: 0 });
      ScrollTrigger.create({
        trigger: section,
        start: "top 62%",
        once: true,
        onEnter: () =>
          gsap.to(targets, {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.06,
            onComplete: () => splits.forEach((s) => s.revert()),
          }),
      });
    });
    // standalone reveals (ticket stub, receipt, polaroids)
    document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-group] [data-reveal])").forEach((el) => {
      gsap.set(el, { y: 40, opacity: 0 });
      ScrollTrigger.create({
        trigger: el.closest("section") ?? el,
        start: "top 62%",
        once: true,
        onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 1, ease: "expo.out" }),
      });
    });
  });
  return () => ctx.revert();
}
