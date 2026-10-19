"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, HueSaturation, Vignette } from "@react-three/postprocessing";
import type { HueSaturationEffect, VignetteEffect } from "postprocessing";
import { useStore } from "@/lib/store";

/** high tier only: bloom on the screen, lamp, neon and city; light vignette; "sleepy" at 1am */
export function Effects() {
  const vignette = useRef<VignetteEffect>(null);
  const hue = useRef<HueSaturationEffect>(null);
  useFrame(() => {
    const sleepy = useStore.getState().sleepy;
    if (vignette.current) {
      const d = vignette.current.darkness;
      vignette.current.darkness = d + ((sleepy ? 0.85 : 0.5) - d) * 0.05;
    }
    if (hue.current) {
      const s = hue.current.saturation;
      hue.current.saturation = s + ((sleepy ? -0.35 : 0) - s) * 0.05;
    }
  });
  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur intensity={0.7} luminanceThreshold={0.85} luminanceSmoothing={0.2} />
      <HueSaturation ref={hue} saturation={0} />
      <Vignette ref={vignette} offset={0.32} darkness={0.5} />
    </EffectComposer>
  );
}
