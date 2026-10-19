"use client";

import type { ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { palette } from "@/lib/palette";
import { Steam } from "../Steam";

/** the coffee level follows the caffeine meter */
export function Mug(props: ThreeElements["group"]) {
  const coffee = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const c = useStore.getState().caffeine / 100;
    if (coffee.current) {
      coffee.current.position.y = 0.012 + 0.078 * c;
      coffee.current.visible = c > 0.02;
    }
  });
  return (
    <group {...props}>
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.048, 0.044, 0.1, 28, 1, true]} />
        <meshStandardMaterial color={palette.cherry} roughness={0.45} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.002, 0]}>
        <cylinderGeometry args={[0.044, 0.044, 0.004, 28]} />
        <meshStandardMaterial color={palette.cherry} />
      </mesh>
      <mesh ref={coffee} position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.044, 0.044, 0.003, 28]} />
        <meshStandardMaterial color="#3b1f12" roughness={0.15} />
      </mesh>
      <mesh position={[0.046, 0.05, 0]} rotation={[0, 0, -0.65 * Math.PI]} castShadow>
        <torusGeometry args={[0.025, 0.008, 10, 20, Math.PI * 1.3]} />
        <meshStandardMaterial color={palette.cherry} roughness={0.45} />
      </mesh>
      <Steam origin={[0, 0.1, 0]} count={6} />
    </group>
  );
}
