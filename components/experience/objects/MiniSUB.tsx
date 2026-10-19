"use client";

import type { ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { site } from "@/content/site";
import { useStore } from "@/lib/store";
import { palette } from "@/lib/palette";
import { lightsAt } from "@/lib/time";
import { HoverOutline, Interactive } from "../parts";

/** a tiny student union building. same first day, 2021. (built facing +z) */
export function MiniSUB(props: ThreeElements["group"]) {
  const glass = useRef<THREE.MeshStandardMaterial>(null);
  const setTooltip = useStore((s) => s.setTooltip);
  useFrame(() => {
    const l = lightsAt(useStore.getState().progress);
    if (glass.current) glass.current.emissiveIntensity = 0.1 + 1.4 * l.city;
  });
  const show = () => setTooltip({ id: "sub", text: site.ticket.subTooltip });
  return (
    <group {...props}>
      <Interactive label="the SUB" onClick={show} onHover={show} hit={[0.3, 0.22, 0.2]} hitPosition={[0, 0.08, 0]}>
        <mesh position={[0, 0.025, 0]} castShadow>
          <boxGeometry args={[0.22, 0.05, 0.13]} />
          <meshStandardMaterial color="#a39a8e" roughness={0.8} />
          <HoverOutline thickness={0.004} />
        </mesh>
        <mesh position={[0.01, 0.085, 0]} castShadow>
          <boxGeometry args={[0.19, 0.07, 0.11]} />
          <meshStandardMaterial ref={glass} color="#5f7f8a" roughness={0.2} metalness={0.3} emissive={palette.amber} emissiveIntensity={0.1} />
          <HoverOutline thickness={0.004} />
        </mesh>
        {[-0.06, -0.02, 0.02, 0.06].map((x) => (
          <mesh key={x} position={[x + 0.01, 0.085, 0.056]}>
            <boxGeometry args={[0.006, 0.07, 0.003]} />
            <meshStandardMaterial color={palette.woodDark} />
          </mesh>
        ))}
        <mesh position={[0, 0.126, 0.01]} castShadow>
          <boxGeometry args={[0.25, 0.012, 0.16]} />
          <meshStandardMaterial color={palette.wood} roughness={0.6} />
        </mesh>
      </Interactive>
    </group>
  );
}
