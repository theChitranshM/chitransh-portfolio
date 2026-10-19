"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { qualitySettings } from "@/lib/quality";

let puffTexture: THREE.Texture | null = null;
function getPuff() {
  if (puffTexture || typeof document === "undefined") return puffTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  puffTexture = new THREE.CanvasTexture(c);
  return puffTexture;
}

/** soft steam puffs rising from a point; more of them while refilling */
export function Steam({ origin, count = 6, burstOnRefill = false }: { origin: [number, number, number]; count?: number; burstOnRefill?: boolean }) {
  const quality = useStore((s) => s.quality);
  const budget = qualitySettings[quality === "none" ? "low" : quality].particles;
  const n = Math.min(count, Math.round(budget / 2));
  const group = useRef<THREE.Group>(null);
  const seeds = useMemo(() => Array.from({ length: n }, (_, i) => ({ phase: i / Math.max(1, n), speed: 0.7 + ((i * 0.618) % 1) * 0.5, drift: ((i * 2.399) % 1) * 6 })), [n]);
  const map = useMemo(() => getPuff(), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const s = useStore.getState();
    const boost = burstOnRefill ? (s.refilling ? 1 : 0.15) : 0.35 + 0.65 * (s.caffeine / 100);
    const t = state.clock.elapsedTime;
    g.children.forEach((child, i) => {
      const seed = seeds[i];
      const life = (t * 0.35 * seed.speed + seed.phase) % 1;
      const sprite = child as THREE.Sprite;
      sprite.position.set(Math.sin(t * 1.3 + seed.drift) * 0.012 * (1 + life * 2), life * 0.22, Math.cos(t + seed.drift) * 0.008);
      const scale = 0.03 + life * 0.07;
      sprite.scale.set(scale, scale, scale);
      (sprite.material as THREE.SpriteMaterial).opacity = Math.sin(life * Math.PI) * 0.35 * boost;
    });
  });

  if (!n || !map) return null;
  return (
    <group ref={group} position={origin}>
      {seeds.map((_, i) => (
        <sprite key={i}>
          <spriteMaterial map={map} transparent depthWrite={false} opacity={0} color="#fff6ea" />
        </sprite>
      ))}
    </group>
  );
}
