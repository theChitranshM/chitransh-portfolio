"use client";

import type { ThreeElements } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { palette } from "@/lib/palette";

/** the fellow ode, for pourover */
export function Grinder(props: ThreeElements["group"]) {
  return (
    <group {...props}>
      <RoundedBox args={[0.13, 0.24, 0.2]} radius={0.02} position={[0, 0.12, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={palette.charcoal} roughness={0.55} />
      </RoundedBox>
      <mesh position={[0, 0.19, 0.103]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.048, 0.048, 0.02, 28]} />
        <meshStandardMaterial color={palette.steel} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.06, 0.12]} castShadow>
        <boxGeometry args={[0.08, 0.07, 0.05]} />
        <meshStandardMaterial color={palette.steel} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.246, -0.04]}>
        <cylinderGeometry args={[0.04, 0.04, 0.014, 20]} />
        <meshStandardMaterial color="#2c2522" />
      </mesh>
    </group>
  );
}
