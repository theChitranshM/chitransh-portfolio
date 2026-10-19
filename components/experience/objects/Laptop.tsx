"use client";

import type { ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { palette } from "@/lib/palette";
import { scrollToChapter } from "@/lib/scroll";
import { lightsAt } from "@/lib/time";
import { cssFont, HoverOutline, Interactive, useCanvasTexture } from "../parts";

const W = 640;
const H = 400;

function mono() {
  return cssFont("--font-geist-mono", "ui-monospace, monospace");
}

function drawEditor(g: CanvasRenderingContext2D) {
  g.fillStyle = "#1a120d";
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#2a1a12";
  g.fillRect(0, 0, W, 34);
  ["#FF5A4E", "#FFB547", "#9CFF6E"].forEach((c, i) => {
    g.fillStyle = c;
    g.beginPath();
    g.arc(22 + i * 22, 17, 6, 0, Math.PI * 2);
    g.fill();
  });
  g.font = `16px ${mono()}`;
  g.fillStyle = "#E9C9A1";
  g.fillText("agent.py", 290, 23);
  const colors = ["#FFB547", "#9CFF6E", "#E9C9A1", "#FF5A4E", "#c9a98a"];
  let s = 3;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let row = 0; row < 15; row++) {
    const y = 58 + row * 22;
    g.fillStyle = "rgba(233,201,161,0.25)";
    g.fillText(String(row + 1).padStart(2, " "), 14, y + 5);
    let x = 52 + (row % 4 === 0 ? 0 : 24) + (row % 7 === 3 ? 24 : 0);
    const parts = 1 + Math.floor(rnd() * 4);
    for (let p = 0; p < parts; p++) {
      const w = 30 + rnd() * 120;
      g.fillStyle = colors[Math.floor(rnd() * colors.length)];
      g.globalAlpha = 0.85;
      g.fillRect(x, y - 6, w, 9);
      x += w + 12;
    }
    g.globalAlpha = 1;
  }
}

function drawProjects(g: CanvasRenderingContext2D) {
  g.fillStyle = "#140D09";
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#2A1A12";
  g.fillRect(40, 30, W - 80, H - 60);
  g.fillStyle = "#1a120d";
  g.fillRect(40, 30, W - 80, 30);
  ["#FF5A4E", "#FFB547", "#9CFF6E"].forEach((c, i) => {
    g.fillStyle = c;
    g.beginPath();
    g.arc(58 + i * 18, 45, 5, 0, Math.PI * 2);
    g.fill();
  });
  g.font = `14px ${mono()}`;
  g.fillStyle = "#E9C9A1";
  g.fillText("~/projects", 280, 50);
  g.fillStyle = "#4A3022";
  g.fillRect(40, 60, 120, H - 90);
  for (let i = 0; i < 6; i++) {
    const x = 190 + (i % 3) * 140;
    const y = 90 + Math.floor(i / 3) * 140;
    g.fillStyle = "#F7F1E8";
    g.fillRect(x, y, 60, 74);
    g.fillStyle = i < 4 ? "#9CFF6E" : "#FFB547";
    g.fillRect(x, y + 48, 60, 16);
    g.fillStyle = "rgba(247,241,232,0.6)";
    g.fillRect(x - 8, y + 86, 76, 7);
  }
}

function drawTerminal(g: CanvasRenderingContext2D) {
  g.fillStyle = "#050805";
  g.fillRect(0, 0, W, H);
  g.font = `18px ${mono()}`;
  const lines = ["$ ./twin --online", "twin> booting personality...", "twin> loaded: 5 years of CS", "twin> loaded: too much espresso", "twin> ready. ask me anything", ""];
  lines.forEach((l, i) => {
    g.fillStyle = i === 0 ? "#E9C9A1" : "#9CFF6E";
    g.fillText(l, 28, 52 + i * 34);
  });
  g.fillStyle = "#9CFF6E";
  g.fillRect(28, 52 + 5 * 34 - 16, 11, 20);
}

/** center of the desk. its screen is the projects window and, later, the twin's terminal */
export function Laptop(props: ThreeElements["group"]) {
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const editor = useCanvasTexture(W, H, drawEditor);
  const projects = useCanvasTexture(W, H, drawProjects);
  const terminal = useCanvasTexture(W, H, drawTerminal);
  const twin = useStore((s) => s.chapter === 6);

  useFrame(() => {
    const s = useStore.getState();
    const m = screen.current;
    if (!m) return;
    const map = s.chapter === 6 || s.chapter === 7 ? terminal : s.chapter === 3 ? projects : editor;
    if (m.map !== map) {
      m.map = map;
      m.needsUpdate = true;
    }
    const l = lightsAt(s.progress);
    m.color.setScalar(0.75 + 0.5 * l.screen);
  });

  return (
    <group {...props}>
      <Interactive
        label={twin ? "talk" : "open"}
        onClick={() => scrollToChapter(twin ? 6 : 3)}
        hit={[0.62, 0.45, 0.5]}
        hitPosition={[0, 0.18, -0.05]}
      >
        <RoundedBox args={[0.52, 0.02, 0.36]} radius={0.008} position={[0, 0.01, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#c9c4bd" metalness={0.45} roughness={0.35} />
          <HoverOutline />
        </RoundedBox>
        <mesh position={[0, 0.0205, -0.02]}>
          <boxGeometry args={[0.46, 0.002, 0.17]} />
          <meshStandardMaterial color="#2b2725" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.0205, 0.12]}>
          <boxGeometry args={[0.15, 0.001, 0.09]} />
          <meshStandardMaterial color="#b6b0a8" metalness={0.3} roughness={0.4} />
        </mesh>
        {/* hinged lid */}
        <group position={[0, 0.02, -0.175]} rotation={[-0.3, 0, 0]}>
          <RoundedBox args={[0.52, 0.34, 0.012]} radius={0.008} position={[0, 0.17, -0.006]} castShadow>
            <meshStandardMaterial color="#c9c4bd" metalness={0.45} roughness={0.35} />
            <HoverOutline />
          </RoundedBox>
          <mesh position={[0, 0.172, 0.0015]}>
            <planeGeometry args={[0.48, 0.3]} />
            <meshBasicMaterial ref={screen} map={editor} toneMapped={false} color={palette.milk} />
          </mesh>
        </group>
      </Interactive>
    </group>
  );
}
