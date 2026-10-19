"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { Outlines } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { palette } from "@/lib/palette";

const Hovered = createContext(false);

/**
 * Wraps a 3D object so it can be hovered/tapped: agent-green outline, a cursor word,
 * and a big invisible hit box so phone taps land (44px minimum).
 */
export function Interactive({
  label,
  onClick,
  onHover,
  hit,
  hitPosition = [0, 0, 0],
  children,
}: {
  label: string;
  onClick?: () => void;
  onHover?: () => void;
  hit: [number, number, number];
  hitPosition?: [number, number, number];
  children: ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const setCursorLabel = useStore((s) => s.setCursorLabel);
  return (
    <group
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
        setCursorLabel(label);
        if (e.pointerType === "mouse") onHover?.();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        setCursorLabel(null);
        document.body.style.cursor = "";
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <Hovered.Provider value={hovered}>{children}</Hovered.Provider>
      <mesh position={hitPosition} visible={false}>
        <boxGeometry args={hit} />
      </mesh>
    </group>
  );
}

/** drop inside a mesh: outlines it while its Interactive parent is hovered */
export function HoverOutline({ thickness = 0.006 }: { thickness?: number }) {
  const hovered = useContext(Hovered);
  return hovered ? <Outlines thickness={thickness} color={palette.agent} screenspace={false} /> : null;
}

/** a cylinder from a to b */
export function Segment({
  from,
  to,
  radius,
  color,
  metalness = 0.3,
  roughness = 0.5,
}: {
  from: [number, number, number];
  to: [number, number, number];
  radius: number;
  color: string;
  metalness?: number;
  roughness?: number;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { position: a.add(b).multiplyScalar(0.5), quaternion: q, length: dir.length() };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius, radius, length, 10]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

/** draws on a 2D canvas once and returns it as a texture (pass a module-level draw function) */
export function useCanvasTexture(width: number, height: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    const g = c.getContext("2d");
    if (!g) return null;
    draw(g, width, height);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- draw once per size
  }, [width, height]);
}

export function cssFont(varName: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v || fallback;
}
