"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { palette } from "@/lib/palette";
import { lightsAt } from "@/lib/time";
import { Segment } from "../parts";

/** desk lamp. world-space: base at (0.98, 0.78, -1.45), head at (0.82, 1.32, -1.32) */
export function Lamp() {
  const bulb = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const l = lightsAt(useStore.getState().progress);
    if (bulb.current) bulb.current.color.setRGB(1.2 + 1.8 * l.lamp, 0.9 + 1.2 * l.lamp, 0.55 + 0.6 * l.lamp);
  });
  return (
    <group>
      <mesh position={[0.98, 0.79, -1.45]} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.022, 28]} />
        <meshStandardMaterial color={palette.charcoal} roughness={0.4} metalness={0.3} />
      </mesh>
      <Segment from={[0.98, 0.8, -1.45]} to={[0.99, 1.22, -1.52]} radius={0.009} color={palette.charcoal} />
      <mesh position={[0.99, 1.22, -1.52]}>
        <sphereGeometry args={[0.016, 12, 12]} />
        <meshStandardMaterial color={palette.charcoal} />
      </mesh>
      <Segment from={[0.99, 1.22, -1.52]} to={[0.84, 1.36, -1.34]} radius={0.008} color={palette.charcoal} />
      <group position={[0.82, 1.335, -1.32]} rotation={[0.55, 0, 0.55]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.025, 0.075, 0.1, 24, 1, true]} />
          <meshStandardMaterial color={palette.cherry} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshBasicMaterial ref={bulb} color="#ffd9a0" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
