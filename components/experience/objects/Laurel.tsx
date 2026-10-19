"use client";

import type { ThreeElements } from "@react-three/fiber";
import { useMemo } from "react";
import { site } from "@/content/site";
import { useStore } from "@/lib/store";
import { palette } from "@/lib/palette";
import { HoverOutline, Interactive } from "../parts";

/** julius caesar's laurel wreath, from the school play. et tu, recruiter? (built facing +z) */
export function Laurel(props: ThreeElements["group"]) {
  const setTooltip = useStore((s) => s.setTooltip);
  const unlock = useStore((s) => s.unlock);
  const leaves = useMemo(() => {
    const out: { x: number; y: number; r: number }[] = [];
    const n = 16;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + 0.45 + (i / (n - 1)) * (Math.PI * 2 - 0.9);
      for (const side of [-1, 1]) {
        const rr = 0.075 + side * 0.012;
        out.push({ x: Math.cos(a) * rr, y: Math.sin(a) * rr, r: a + side * 0.6 });
      }
    }
    return out;
  }, []);
  const show = () => {
    setTooltip({ id: "laurel", text: site.origin.laurelTooltip });
    unlock("et-tu");
  };
  return (
    <group {...props}>
      <Interactive label="et tu" onClick={show} onHover={show} hit={[0.24, 0.24, 0.1]} hitPosition={[0, 0.1, 0]}>
        <group position={[0, 0.1, 0]} rotation={[-0.15, 0, 0]}>
          <mesh rotation={[0, 0, -Math.PI / 2 + 0.4]}>
            <torusGeometry args={[0.075, 0.005, 8, 40, Math.PI * 2 - 0.8]} />
            <meshStandardMaterial color={palette.gold} metalness={0.15} roughness={0.45} emissive={palette.gold} emissiveIntensity={0.12} />
            <HoverOutline thickness={0.003} />
          </mesh>
          {leaves.map((l, i) => (
            <mesh key={i} position={[l.x, l.y, 0]} rotation={[0, 0, l.r]} scale={[0.022, 0.009, 0.006]} castShadow>
              <sphereGeometry args={[1, 10, 8]} />
              <meshStandardMaterial color={palette.gold} metalness={0.15} roughness={0.45} emissive={palette.gold} emissiveIntensity={0.12} />
            </mesh>
          ))}
        </group>
      </Interactive>
    </group>
  );
}
