"use client";

import type { ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { palette } from "@/lib/palette";
import { HoverOutline, Interactive } from "../parts";
import { Steam } from "../Steam";

const steel = { color: palette.steel, metalness: 0.55, roughness: 0.32 };

/** breville with a built-in grinder (inner burr: 3). click it to refill the caffeine meter. */
export function EspressoMachine(props: ThreeElements["group"]) {
  const body = useRef<THREE.Group>(null);
  const stream = useRef<THREE.Mesh>(null);
  const refill = useStore((s) => s.refill);

  useFrame((state) => {
    const refilling = useStore.getState().refilling;
    const t = state.clock.elapsedTime;
    if (body.current) {
      body.current.position.x = refilling ? Math.sin(t * 70) * 0.0025 : 0;
      body.current.rotation.z = refilling ? Math.sin(t * 53) * 0.006 : 0;
    }
    if (stream.current) {
      const target = refilling ? 1 : 0;
      stream.current.scale.y += (target - stream.current.scale.y) * 0.25;
      stream.current.visible = stream.current.scale.y > 0.02;
    }
  });

  return (
    <group {...props}>
      <Interactive label="refill" onClick={refill} hit={[0.46, 0.6, 0.5]} hitPosition={[0, 0.25, 0.05]}>
        <group ref={body}>
          <RoundedBox args={[0.3, 0.34, 0.3]} radius={0.03} smoothness={3} position={[0, 0.17, 0]} castShadow receiveShadow>
            <meshStandardMaterial {...steel} />
            <HoverOutline />
          </RoundedBox>
          {/* bean hopper */}
          <mesh position={[0.065, 0.4, -0.04]} castShadow>
            <cylinderGeometry args={[0.065, 0.05, 0.12, 20]} />
            <meshStandardMaterial color="#3a2418" roughness={0.2} metalness={0.1} transparent opacity={0.88} />
          </mesh>
          <mesh position={[0.065, 0.465, -0.04]}>
            <cylinderGeometry args={[0.068, 0.068, 0.012, 20]} />
            <meshStandardMaterial color={palette.charcoal} />
          </mesh>
          {/* front panel + gauge */}
          <mesh position={[0, 0.265, 0.151]}>
            <boxGeometry args={[0.26, 0.11, 0.004]} />
            <meshStandardMaterial color={palette.charcoal} roughness={0.6} />
          </mesh>
          <mesh position={[0.07, 0.27, 0.155]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.006, 24]} />
            <meshStandardMaterial color={palette.milk} emissive={palette.amber} emissiveIntensity={0.15} />
          </mesh>
          {[-0.08, -0.04, 0].map((x) => (
            <mesh key={x} position={[x, 0.255, 0.156]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.009, 0.009, 0.006, 12]} />
              <meshStandardMaterial color={palette.steel} metalness={0.6} roughness={0.3} />
            </mesh>
          ))}
          {/* group head + portafilter */}
          <mesh position={[-0.03, 0.185, 0.17]}>
            <cylinderGeometry args={[0.042, 0.042, 0.03, 20]} />
            <meshStandardMaterial {...steel} />
          </mesh>
          <mesh position={[-0.03, 0.158, 0.18]}>
            <cylinderGeometry args={[0.038, 0.034, 0.03, 20]} />
            <meshStandardMaterial color={palette.charcoal} metalness={0.3} roughness={0.4} />
          </mesh>
          <mesh position={[-0.03, 0.152, 0.27]} castShadow>
            <boxGeometry args={[0.024, 0.022, 0.13]} />
            <meshStandardMaterial color={palette.charcoal} roughness={0.5} />
          </mesh>
          {/* coffee stream (only while refilling) */}
          <mesh ref={stream} position={[-0.03, 0.105, 0.18]} scale={[1, 0, 1]} visible={false}>
            <cylinderGeometry args={[0.004, 0.003, 0.07, 8]} />
            <meshStandardMaterial color="#3b1f12" roughness={0.2} />
          </mesh>
          {/* cup + drip tray */}
          <mesh position={[-0.03, 0.05, 0.18]} castShadow>
            <cylinderGeometry args={[0.032, 0.026, 0.045, 18]} />
            <meshStandardMaterial color={palette.milk} roughness={0.35} />
          </mesh>
          <RoundedBox args={[0.29, 0.028, 0.13]} radius={0.008} position={[0, 0.014, 0.19]} receiveShadow>
            <meshStandardMaterial color="#8c867e" metalness={0.5} roughness={0.4} />
          </RoundedBox>
          {/* steam wand */}
          <mesh position={[0.13, 0.13, 0.17]} rotation={[0, 0, 0.22]}>
            <cylinderGeometry args={[0.006, 0.006, 0.17, 8]} />
            <meshStandardMaterial {...steel} />
          </mesh>
        </group>
      </Interactive>
      <Steam origin={[-0.03, 0.09, 0.18]} count={8} burstOnRefill />
    </group>
  );
}
