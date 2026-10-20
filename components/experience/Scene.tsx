"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { qualitySettings, stepDown } from "@/lib/quality";
import { CameraRig } from "./CameraRig";
import { Lighting } from "./Lighting";
import { Sky } from "./Sky";
import { Room } from "./Room";

// post-processing (bloom, vignette) only ships to high-tier devices
const Effects = lazy(() => import("./Effects").then((m) => ({ default: m.Effects })));

/** tells the loader the scene has actually drawn a frame */
function ReadySignal() {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(() => useStore.getState().setLoaded(true));
  });
  return null;
}

/** reduced motion: no camera flights, a short fade between chapter framings */
function Crossfade() {
  const reduced = useStore((s) => s.reducedMotion);
  const chapter = useStore((s) => s.chapter);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!reduced) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- brief fade on chapter change
    setFlash(true);
    const id = setTimeout(() => setFlash(false), 60);
    return () => clearTimeout(id);
  }, [chapter, reduced]);
  if (!reduced) return null;
  return <div aria-hidden className={`pointer-events-none fixed inset-0 z-[2] bg-espresso ${flash ? "opacity-100" : "opacity-0 transition-opacity duration-500"}`} />;
}

// the 3D chunk has arrived
useStore.getState().setLoadProgress(0.7);

export default function Scene() {
  const quality = useStore((s) => s.quality);
  const setQuality = useStore((s) => s.setQuality);
  // the loader covers the scene: draw once (compile + ready signal), loop only after "pull the shot"
  const entered = useStore((s) => s.entered);
  const q = qualitySettings[quality === "none" ? "low" : quality];

  return (
    <>
      <div aria-hidden className="fixed inset-0 z-[1]" style={{ touchAction: "pan-y" }}>
        <Canvas
          frameloop={entered ? "always" : "demand"}
          dpr={q.dpr}
          shadows={q.shadows ? "soft" : false}
          gl={{ antialias: quality !== "low", powerPreference: "high-performance", alpha: false }}
          camera={{ fov: 34, near: 0.05, far: 80, position: [2.9, 2.55, 5.6] }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
          }}
          style={{ touchAction: "pan-y" }}
        >
          <color attach="background" args={["#140D09"]} />
          <PerformanceMonitor
            onDecline={() => {
              const next = stepDown(useStore.getState().quality);
              if (next !== useStore.getState().quality) setQuality(next);
            }}
          />
          <Suspense fallback={null}>
            <CameraRig />
            <Lighting />
            <Sky />
            <Room />
            {q.post && entered && (
              <Suspense fallback={null}>
                <Effects />
              </Suspense>
            )}
            <ReadySignal />
          </Suspense>
        </Canvas>
      </div>
      <Crossfade />
    </>
  );
}
