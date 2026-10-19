"use client";

import type { ThreeElements } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { site } from "@/content/site";
import { useStore } from "@/lib/store";
import { palette } from "@/lib/palette";
import { lightsAt } from "@/lib/time";
import { cssFont, Interactive } from "../parts";

const gradients: [string, string][] = [
  ["#FFB547", "#FF5A4E"],
  ["#4A3022", "#FFB547"],
  ["#FF5A4E", "#2A1A12"],
  ["#E9C9A1", "#4A3022"],
  ["#FFB547", "#4A3022"],
  ["#9CFF6E", "#2A1A12"],
];
const tilts = [-0.06, 0.04, -0.03, 0.05, -0.04, 0.03];
const PW = 0.26;
const PH = 0.31;

function drawPolaroid(c: HTMLCanvasElement, i: number) {
  const l = site.leadership[i];
  const g = c.getContext("2d")!;
  const w = c.width;
  const h = c.height;
  g.fillStyle = "#F7F1E8";
  g.fillRect(0, 0, w, h);
  const pad = 16;
  const side = w - pad * 2;
  const grad = g.createLinearGradient(pad, pad, pad + side, pad + side);
  grad.addColorStop(0, gradients[i][0]);
  grad.addColorStop(1, gradients[i][1]);
  g.fillStyle = grad;
  g.fillRect(pad, pad, side, side);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "96px serif";
  g.fillText(l.icon, w / 2, pad + side / 2 + 4);
  // handwritten caption
  const hand = cssFont("--font-caveat", "cursive");
  g.fillStyle = "#140D09";
  let size = 34;
  g.font = `500 ${size}px ${hand}`;
  while (g.measureText(l.title).width > w - 24 && size > 18) g.font = `500 ${--size}px ${hand}`;
  g.fillText(l.title, w / 2, pad + side + (h - pad - side) / 2);
}

/** six captioned polaroids + string lights on the right wall (built facing +z) */
export function PolaroidWall(props: ThreeElements["group"]) {
  const setPolaroid = useStore((s) => s.setPolaroid);
  const bulbs = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffd9a0", toneMapped: false }), []);
  const textures = useMemo(() => {
    if (typeof document === "undefined") return [];
    return site.leadership.map((_, i) => {
      const c = document.createElement("canvas");
      c.width = 260;
      c.height = 310;
      drawPolaroid(c, i);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    });
  }, []);

  // the handwriting font only loads on demand: redraw once it's in
  useEffect(() => {
    const hand = cssFont("--font-caveat", "");
    if (!hand || !document.fonts) return;
    void document.fonts.load(`500 34px ${hand}`).then(() =>
      textures.forEach((t, i) => {
        drawPolaroid(t.image as HTMLCanvasElement, i);
        t.needsUpdate = true;
      }),
    );
  }, [textures]);

  const lights = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => {
        const t = i / 14;
        return [-0.66 + t * 1.32, 0.55 - Math.sin(t * Math.PI) * 0.09 - (i % 2) * 0.006, 0.02] as [number, number, number];
      }),
    [],
  );

  useFrame((state) => {
    const l = lightsAt(useStore.getState().progress);
    const flicker = 0.92 + Math.sin(state.clock.elapsedTime * 3) * 0.04;
    bulbs.color.setRGB((0.55 + 2.2 * l.lamp) * flicker, (0.38 + 1.5 * l.lamp) * flicker, 0.18 + 0.6 * l.lamp);
  });

  return (
    <group {...props}>
      {site.leadership.map((l, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <group key={l.title} position={[-0.42 + col * 0.42, 0.24 - row * 0.4, 0]} rotation={[0, 0, tilts[i]]}>
            <Interactive label="open" onClick={() => setPolaroid(i)} hit={[PW + 0.08, PH + 0.08, 0.06]}>
              <mesh castShadow>
                <boxGeometry args={[PW, PH, 0.004]} />
                <meshStandardMaterial color={palette.milk} roughness={0.8} />
              </mesh>
              {textures[i] && (
                <mesh position={[0, 0, 0.0025]}>
                  <planeGeometry args={[PW, PH]} />
                  <meshStandardMaterial map={textures[i]} roughness={0.6} />
                </mesh>
              )}
              <mesh position={[0, PH / 2 - 0.02, 0.01]}>
                <sphereGeometry args={[0.012, 10, 10]} />
                <meshStandardMaterial color={palette.cherry} roughness={0.3} />
              </mesh>
            </Interactive>
          </group>
        );
      })}
      {/* string lights: they take over after sunset */}
      {lights.map((p, i) => (
        <mesh key={i} position={p} material={bulbs}>
          <sphereGeometry args={[0.013, 10, 10]} />
        </mesh>
      ))}
    </group>
  );
}
