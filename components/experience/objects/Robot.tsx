"use client";

import type { ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { palette } from "@/lib/palette";
import { HoverOutline, Interactive } from "../parts";

/** robotics kid's robot. LED eyes blink; click it and it waves + says "beep." (built facing +z) */
export function Robot(props: ThreeElements["group"]) {
  const eyes = useRef<THREE.Group>(null);
  const arm = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const waveRobot = useStore((s) => s.waveRobot);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const blink = t % 3.4 < 0.12 || (t % 7.1 > 3.6 && t % 7.1 < 3.7);
    if (eyes.current) eyes.current.scale.y = blink ? 0.12 : 1;
    const since = (Date.now() - useStore.getState().robotWave) / 1000;
    const waving = since < 1.6;
    if (arm.current) arm.current.rotation.z = waving ? 2.4 + Math.sin(since * 16) * 0.45 : THREE.MathUtils.lerp(arm.current.rotation.z, 0.08, 0.15);
    if (head.current) head.current.rotation.y = waving ? Math.sin(since * 9) * 0.18 : Math.sin(t * 0.5) * 0.08;
  });

  return (
    <group {...props}>
      <Interactive label="beep" onClick={waveRobot} hit={[0.32, 0.42, 0.3]} hitPosition={[0, 0.18, 0]}>
        {/* feet */}
        {[-0.035, 0.035].map((x) => (
          <mesh key={x} position={[x, 0.012, 0.01]} castShadow>
            <boxGeometry args={[0.04, 0.024, 0.06]} />
            <meshStandardMaterial color={palette.charcoal} />
          </mesh>
        ))}
        <RoundedBox args={[0.13, 0.13, 0.11]} radius={0.02} position={[0, 0.095, 0]} castShadow>
          <meshStandardMaterial color={palette.amber} roughness={0.45} />
          <HoverOutline />
        </RoundedBox>
        <mesh position={[0, 0.1, 0.056]}>
          <boxGeometry args={[0.06, 0.04, 0.004]} />
          <meshStandardMaterial color={palette.roast} />
        </mesh>
        {/* left arm (static), right arm waves */}
        <mesh position={[-0.082, 0.095, 0]} rotation={[0, 0, -0.08]} castShadow>
          <boxGeometry args={[0.026, 0.09, 0.03]} />
          <meshStandardMaterial color={palette.crema} />
        </mesh>
        <group ref={arm} position={[0.08, 0.14, 0]} rotation={[0, 0, 0.08]}>
          <mesh position={[0, -0.042, 0]} castShadow>
            <boxGeometry args={[0.026, 0.09, 0.03]} />
            <meshStandardMaterial color={palette.crema} />
          </mesh>
        </group>
        <group ref={head} position={[0, 0.205, 0]}>
          <RoundedBox args={[0.12, 0.085, 0.1]} radius={0.018} castShadow>
            <meshStandardMaterial color={palette.milk} roughness={0.4} />
            <HoverOutline />
          </RoundedBox>
          <group ref={eyes} position={[0, 0.005, 0.051]}>
            {[-0.027, 0.027].map((x) => (
              <mesh key={x} position={[x, 0, 0]}>
                <boxGeometry args={[0.018, 0.022, 0.004]} />
                <meshBasicMaterial color={palette.agent} toneMapped={false} />
              </mesh>
            ))}
          </group>
          <mesh position={[0, 0.07, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.05, 6]} />
            <meshStandardMaterial color={palette.charcoal} />
          </mesh>
          <mesh position={[0, 0.098, 0]}>
            <sphereGeometry args={[0.011, 12, 12]} />
            <meshBasicMaterial color={palette.cherry} toneMapped={false} />
          </mesh>
        </group>
      </Interactive>
    </group>
  );
}
