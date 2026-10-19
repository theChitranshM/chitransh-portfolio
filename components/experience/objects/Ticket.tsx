"use client";

import type { ThreeElements } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { site } from "@/content/site";
import { palette } from "@/lib/palette";
import { cssFont, useCanvasTexture } from "../parts";

/** the framed one-way ticket, AJMER -> VANCOUVER (built facing +z) */
export function Ticket(props: ThreeElements["group"]) {
  const s = site.ticket.stub;
  const tex = useCanvasTexture(512, 300, (g, w, h) => {
    const mono = cssFont("--font-geist-mono", "ui-monospace, monospace");
    g.fillStyle = "#140D09";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#E9C9A1";
    g.beginPath();
    g.roundRect(36, 70, w - 72, h - 140, 14);
    g.fill();
    g.fillStyle = "#4A3022";
    g.font = `16px ${mono}`;
    g.fillText("BOARDING PASS · ONE WAY", 60, 108);
    g.fillStyle = "#140D09";
    g.font = `bold 40px ${mono}`;
    g.fillText(`${s.from} → ${s.to}`, 60, 160);
    g.font = `18px ${mono}`;
    g.fillStyle = "#4A3022";
    g.fillText(`${s.year} · PAX ${s.passengers} · AGE ${s.age}`, 60, 200);
    g.strokeStyle = "rgba(20,13,9,0.4)";
    g.setLineDash([4, 6]);
    g.beginPath();
    g.moveTo(w - 130, 78);
    g.lineTo(w - 130, h - 78);
    g.stroke();
  });
  return (
    <group {...props}>
      <group rotation={[-0.12, 0, 0]} position={[0, 0.1, 0]}>
        <RoundedBox args={[0.3, 0.2, 0.02]} radius={0.006} castShadow>
          <meshStandardMaterial color={palette.woodDark} roughness={0.6} />
        </RoundedBox>
        <mesh position={[0, 0, 0.0105]}>
          <planeGeometry args={[0.27, 0.17]} />
          <meshStandardMaterial map={tex} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}
