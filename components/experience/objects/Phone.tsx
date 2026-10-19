"use client";

import type { ThreeElements } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { palette } from "@/lib/palette";

/** buzzes and lights up whenever an achievement toast arrives */
export function Phone(props: ThreeElements["group"]) {
  const body = useRef<THREE.Group>(null);
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const buzz = useRef(0);
  useEffect(
    () =>
      useStore.subscribe((s, prev) => {
        if (s.toasts.length > prev.toasts.length) buzz.current = 1;
      }),
    [],
  );
  useFrame((state, delta) => {
    buzz.current = Math.max(0, buzz.current - delta * 0.8);
    const b = buzz.current;
    if (body.current) {
      body.current.rotation.y = 0.35 + (b > 0.3 ? Math.sin(state.clock.elapsedTime * 90) * 0.04 : 0);
    }
    if (screen.current) screen.current.color.setRGB(0.08 + b * 0.9, 0.07 + b * 0.75, 0.06 + b * 0.5);
  });
  return (
    <group {...props}>
      <group ref={body} rotation={[0, 0.35, 0]}>
        <RoundedBox args={[0.075, 0.009, 0.15]} radius={0.004} position={[0, 0.0045, 0]} castShadow>
          <meshStandardMaterial color={palette.charcoal} roughness={0.3} metalness={0.2} />
        </RoundedBox>
        <mesh position={[0, 0.0095, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.066, 0.138]} />
          <meshBasicMaterial ref={screen} color="#141210" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
