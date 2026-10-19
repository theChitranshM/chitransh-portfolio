"use client";

import type { ThreeElements } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "@/lib/palette";

/** a plant, for life */
export function Plant(props: ThreeElements["group"]) {
  const leaves = useRef<THREE.Group>(null);
  const blades = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        ry: (i / 9) * Math.PI * 2 + (i % 2) * 0.3,
        tilt: 0.18 + (i % 3) * 0.12,
        h: 0.42 + ((i * 37) % 10) / 40,
        dark: i % 2 === 0,
      })),
    [],
  );
  useFrame((state) => {
    if (leaves.current) leaves.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.02;
  });
  return (
    <group {...props}>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.3, 28]} />
        <meshStandardMaterial color={palette.terracotta} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.295, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.01, 24]} />
        <meshStandardMaterial color="#2a1a10" />
      </mesh>
      <group ref={leaves} position={[0, 0.3, 0]}>
        {blades.map((b, i) => (
          <group key={i} rotation={[0, b.ry, 0]}>
            <mesh position={[0.03 + Math.sin(b.tilt) * b.h * 0.5, b.h * 0.48, 0]} rotation={[0, 0, -b.tilt]} scale={[0.045, b.h * 0.5, 0.012]} castShadow>
              <sphereGeometry args={[1, 12, 10]} />
              <meshStandardMaterial color={b.dark ? palette.leafDark : palette.leaf} roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
