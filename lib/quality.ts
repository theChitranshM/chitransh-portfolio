"use client";

import type { Quality } from "./store";

const TIERS: Quality[] = ["none", "low", "medium", "high"];

export function forcedQuality(): Quality | null {
  try {
    const q = new URLSearchParams(window.location.search).get("quality") as Quality | null;
    return q && TIERS.includes(q) ? q : null;
  } catch {
    return null;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** none (no WebGL / very low end) · low · medium (most phones) · high */
export async function detectQuality(): Promise<Quality> {
  const forced = forcedQuality();
  if (forced) return forced;
  if (!hasWebGL()) return "none";
  try {
    const { getGPUTier } = await import("detect-gpu");
    const gpu = await Promise.race([
      getGPUTier({ benchmarksURL: "/detect-gpu" }),
      new Promise<null>((r) => setTimeout(() => r(null), 2500)),
    ]);
    if (!gpu) return "medium";
    const mobile = !!gpu.isMobile;
    if (gpu.tier === 0) return gpu.type === "BLOCKLISTED" || gpu.type === "WEBGL_UNSUPPORTED" ? "none" : "low";
    if (gpu.tier === 1) return "low";
    if (gpu.tier === 2) return "medium";
    return mobile ? "medium" : "high";
  } catch {
    return "medium";
  }
}

export const qualitySettings = {
  high: { dpr: [1, 2] as [number, number], shadows: true, post: true, particles: 24 },
  medium: { dpr: [1, 1.5] as [number, number], shadows: false, post: false, particles: 10 },
  low: { dpr: [1, 1] as [number, number], shadows: false, post: false, particles: 0 },
  none: { dpr: [1, 1] as [number, number], shadows: false, post: false, particles: 0 },
} satisfies Record<Quality, unknown>;

export function stepDown(q: Quality): Quality {
  return q === "high" ? "medium" : q === "medium" ? "low" : q;
}
