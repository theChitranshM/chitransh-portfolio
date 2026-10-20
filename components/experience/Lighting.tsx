"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { lightsAt } from "@/lib/time";
import { qualitySettings } from "@/lib/quality";
import { LocalEnvironment } from "./LocalEnvironment";

const sunWarm = new THREE.Color("#ffc27a");
const sunLate = new THREE.Color("#ff7a4a");
const hemiDay = new THREE.Color("#ffd9b0");
const hemiNight = new THREE.Color("#5a5f9a");
const screenWarm = new THREE.Color("#ffd2a0");
const screenAgent = new THREE.Color("#9CFF6E");

export function Lighting() {
  const quality = useStore((s) => s.quality);
  const shadows = qualitySettings[quality === "none" ? "low" : quality].shadows;
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const lamp = useRef<THREE.SpotLight>(null);
  const lampGlow = useRef<THREE.PointLight>(null);
  const screen = useRef<THREE.PointLight>(null);
  const fill = useRef<THREE.PointLight>(null);
  const wall = useRef<THREE.PointLight>(null);

  useEffect(() => {
    const l = lamp.current;
    if (!l) return;
    l.target.position.set(0.35, 0.76, -1.1);
    l.parent?.add(l.target);
    l.target.updateMatrixWorld();
  }, []);

  useFrame(() => {
    const s = useStore.getState();
    const l = lightsAt(s.progress);
    if (sun.current) {
      sun.current.intensity = 2.6 * l.sun + 0.05;
      sun.current.color.copy(sunWarm).lerp(sunLate, Math.min(1, s.progress * 2.2));
    }
    if (hemi.current) {
      hemi.current.intensity = 0.35 + 0.55 * l.ambient;
      hemi.current.color.copy(hemiNight).lerp(hemiDay, l.ambient);
    }
    if (lamp.current) lamp.current.intensity = 9 * l.lamp;
    if (lampGlow.current) lampGlow.current.intensity = 1.2 * l.lamp;
    if (screen.current) {
      const twin = s.chapter === 6;
      screen.current.intensity = 1.1 * l.screen;
      screen.current.color.lerp(twin ? screenAgent : screenWarm, 0.06);
    }
    if (wall.current) wall.current.intensity = 0.4 + 2.2 * l.lamp;
    if (fill.current) fill.current.intensity = 0.9 + 1.2 * (1 - l.ambient);
  });

  return (
    <>
      {/* a tiny local env map so metal and glass have something to reflect (no HDR download) */}
      {quality !== "low" && <LocalEnvironment intensity={0.35} />}
      <hemisphereLight ref={hemi} args={["#ffd9b0", "#2a1a12", 0.9]} />
      <directionalLight
        ref={sun}
        position={[-2.5, 4.2, -7]}
        intensity={2.6}
        color="#ffc27a"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-2}
        shadow-camera-near={1}
        shadow-camera-far={16}
        shadow-bias={-0.0008}
        shadow-normalBias={0.02}
      />
      {/* desk lamp, takes over after sunset */}
      <spotLight
        ref={lamp}
        position={[0.82, 1.32, -1.32]}
        angle={0.75}
        penumbra={0.7}
        distance={3.2}
        decay={1.6}
        color="#ffc27a"
        castShadow={shadows}
        shadow-mapSize={[512, 512]}
      />
      <pointLight ref={lampGlow} position={[0.86, 1.2, -1.3]} distance={1.6} decay={2} color="#ffb547" />
      {/* laptop screen glow */}
      <pointLight ref={screen} position={[0, 1.0, -1.05]} distance={1.6} decay={2} color="#ffd2a0" />
      {/* string lights wash the polaroid wall */}
      <pointLight ref={wall} position={[2.2, 2.05, -0.66]} distance={2.2} decay={1.6} color="#ffc98a" />
      {/* warm fill from the room so it stays readable at night */}
      <pointLight ref={fill} position={[0.5, 2.4, 1.8]} distance={7} decay={1.4} color="#ffcf9e" />
    </>
  );
}
