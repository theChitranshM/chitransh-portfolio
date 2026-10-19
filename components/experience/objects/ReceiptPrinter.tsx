"use client";

import type { ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { palette } from "@/lib/palette";
import { scrollToChapter } from "@/lib/scroll";
import { HoverOutline, Interactive, useCanvasTexture } from "../parts";

const PAPER = 0.34;

/** prints the work history when the receipt chapter is reached */
export function ReceiptPrinter(props: ThreeElements["group"]) {
  const strip = useRef<THREE.Group>(null);
  const printed = useRef(0);
  const tex = useCanvasTexture(64, 256, (g, w, h) => {
    g.fillStyle = "#f3e6d0";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(20,13,9,0.55)";
    for (let y = 14; y < h - 10; y += 9) {
      const len = 18 + ((y * 37) % 30);
      g.fillRect(8, y, len, 3);
      if (y % 27 === 5) g.fillRect(w - 22, y, 14, 3);
    }
  });

  useFrame((_, delta) => {
    const s = useStore.getState();
    if (s.chapter >= 4) printed.current = Math.min(1, printed.current + delta / 2.6);
    if (strip.current) {
      strip.current.scale.y = 0.04 + printed.current;
      strip.current.visible = printed.current > 0.001 || s.chapter >= 4;
    }
  });

  return (
    <group {...props}>
      <Interactive label="print" onClick={() => scrollToChapter(4)} hit={[0.26, 0.3, 0.3]} hitPosition={[0, 0.1, 0]}>
        <RoundedBox args={[0.16, 0.11, 0.2]} radius={0.02} position={[0, 0.055, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#e9e3da" roughness={0.5} />
          <HoverOutline />
        </RoundedBox>
        <mesh position={[0, 0.111, 0.03]}>
          <boxGeometry args={[0.11, 0.002, 0.012]} />
          <meshStandardMaterial color={palette.charcoal} />
        </mesh>
        <mesh position={[0.05, 0.075, 0.1005]}>
          <circleGeometry args={[0.006, 12]} />
          <meshBasicMaterial color={palette.agent} toneMapped={false} />
        </mesh>
        {/* paper, pivoting out of the slot */}
        <group position={[0, 0.112, 0.03]} rotation={[0.35, 0, 0]}>
          <group ref={strip} scale={[1, 0.04, 1]} visible={false}>
            <mesh position={[0, PAPER / 2, 0]}>
              <planeGeometry args={[0.1, PAPER]} />
              <meshStandardMaterial map={tex} side={THREE.DoubleSide} roughness={0.9} />
            </mesh>
          </group>
        </group>
      </Interactive>
    </group>
  );
}
