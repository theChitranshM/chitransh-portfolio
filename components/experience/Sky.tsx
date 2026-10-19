"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { lightsAt, skyAt, smoothstep } from "@/lib/time";

const skyVert = /* glsl */ `
  varying vec2 vUv;
  varying float vY;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vY = w.y;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;
const skyFrag = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uBottom;
  uniform vec3 uHorizon;
  uniform float uStars;
  uniform float uTime;
  varying vec2 vUv;
  varying float vY;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main() {
    float t = clamp((vY + 1.0) / 16.0, 0.0, 1.0);
    vec3 col = mix(uHorizon, uBottom, smoothstep(0.0, 0.18, t));
    col = mix(col, uTop, smoothstep(0.18, 0.75, t));
    vec2 g = vUv * vec2(220.0, 110.0);
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash(id);
    float star = step(0.986, h) * smoothstep(0.12, 0.0, length(f)) * smoothstep(0.22, 0.4, t);
    float tw = 0.65 + 0.35 * sin(uTime * 1.7 + h * 60.0);
    col += vec3(star * uStars * tw * 1.4);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

// cheap 1D noise for ridge lines
function ridge(x: number, seed: number) {
  let v = 0;
  let amp = 1;
  let freq = 0.18;
  for (let o = 0; o < 4; o++) {
    v += amp * Math.sin(x * freq + seed * (o + 1.7)) * Math.cos(x * freq * 0.53 + seed * 2.1);
    amp *= 0.5;
    freq *= 2.1;
  }
  return v;
}

function mountainGeometry(seed: number, base: number, height: number, lions = false) {
  const shape = new THREE.Shape();
  shape.moveTo(-30, -3);
  for (let x = -30; x <= 30; x += 0.25) {
    let y = base + height * (0.55 + 0.45 * ridge(x, seed));
    // the Lions: two little twin peaks, because it's the North Shore
    if (lions) {
      y += 0.9 * Math.exp(-((x + 4.2) ** 2) / 0.12) + 0.85 * Math.exp(-((x + 3.3) ** 2) / 0.1);
    }
    shape.lineTo(x, y);
  }
  shape.lineTo(30, -3);
  shape.closePath();
  return new THREE.ShapeGeometry(shape, 1);
}

const mountainDay = ["#c98a7a", "#a4655f", "#7c4a4b"].map((c) => new THREE.Color(c));
const mountainNight = ["#1f2346", "#161a36", "#0f1128"].map((c) => new THREE.Color(c));
const cityDay = new THREE.Color("#a8706a");
const BASE = -0.9;
const cityNight = new THREE.Color("#0b0a16");

function City() {
  const lightsRef = useRef<THREE.InstancedMesh>(null);
  const bodiesRef = useRef<THREE.InstancedMesh>(null);
  const { buildings, windows } = useMemo(() => {
    let s = 7;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const buildings: { x: number; z: number; w: number; d: number; h: number }[] = [];
    for (let x = -16; x < 16; ) {
      const w = 0.3 + rnd() * 0.5;
      const center = Math.exp(-((x + 2) ** 2) / 40); // downtown cluster
      const h = 0.3 + rnd() * 0.6 + center * (0.8 + rnd() * 1.3);
      buildings.push({ x: x + w / 2, z: -10.5 - rnd() * 2, w, d: 0.4 + rnd() * 0.4, h });
      x += w + 0.05 + rnd() * 0.25;
    }
    const windows: { x: number; y: number; z: number; on: number }[] = [];
    for (const b of buildings) {
      const cols = Math.max(1, Math.floor(b.w / 0.13));
      const rows = Math.max(1, Math.floor(b.h / 0.14));
      for (let c = 0; c < cols; c++)
        for (let r = 0; r < rows; r++) {
          if (rnd() < 0.45) continue;
          windows.push({
            x: b.x - b.w / 2 + (c + 0.5) * (b.w / cols),
            y: BASE + (r + 0.6) * (b.h / rows),
            z: b.z + b.d / 2 + 0.005,
            on: 0.5 + rnd() * 0.5,
          });
        }
    }
    return { buildings, windows };
  }, []);

  const setup = (mesh: THREE.InstancedMesh | null, kind: "body" | "light") => {
    if (!mesh || mesh.userData.ready) return;
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    if (kind === "body")
      buildings.forEach((b, i) => {
        m.compose(new THREE.Vector3(b.x, BASE + b.h / 2, b.z), new THREE.Quaternion(), new THREE.Vector3(b.w, b.h, b.d));
        mesh.setMatrixAt(i, m);
      });
    else
      windows.forEach((w, i) => {
        m.makeTranslation(w.x, w.y, w.z);
        mesh.setMatrixAt(i, m);
        mesh.setColorAt(i, c.setRGB(1 * w.on, 0.72 * w.on, 0.36 * w.on));
      });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.userData.ready = true;
  };

  useFrame(() => {
    const p = useStore.getState().progress;
    const l = lightsAt(p);
    if (lightsRef.current) {
      setup(lightsRef.current, "light");
      (lightsRef.current.material as THREE.MeshBasicMaterial).opacity = l.city;
      lightsRef.current.visible = l.city > 0.01;
    }
    if (bodiesRef.current) {
      setup(bodiesRef.current, "body");
      (bodiesRef.current.material as THREE.MeshBasicMaterial).color.copy(cityDay).lerp(cityNight, smoothstep(0.2, 0.75, p));
    }
  });

  return (
    <group>
      <instancedMesh ref={bodiesRef} args={[undefined, undefined, buildings.length]} frustumCulled={false}>
        <boxGeometry />
        <meshBasicMaterial color="#a8706a" />
      </instancedMesh>
      <instancedMesh ref={lightsRef} args={[undefined, undefined, windows.length]} frustumCulled={false}>
        <planeGeometry args={[0.055, 0.06]} />
        <meshBasicMaterial transparent opacity={0} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

export function Sky() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const sun = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const water = useRef<THREE.Mesh>(null);
  const mountainMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color("#f3a65f") },
      uBottom: { value: new THREE.Color("#ffd79a") },
      uHorizon: { value: new THREE.Color("#ffe2b0") },
      uStars: { value: 0 },
      uTime: { value: 0 },
    }),
    [],
  );
  const mountains = useMemo(
    () => [mountainGeometry(1.3, 1.2, 3.3, true), mountainGeometry(4.1, 0.5, 2.5), mountainGeometry(7.7, -0.1, 1.7)],
    [],
  );
  const glowTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,210,140,0.9)");
    grad.addColorStop(0.35, "rgba(255,170,90,0.35)");
    grad.addColorStop(1, "rgba(255,140,80,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const p = useStore.getState().progress;
    const sky = skyAt(p);
    const l = lightsAt(p);
    uniforms.uTop.value.set(sky.top);
    uniforms.uBottom.value.set(sky.bottom);
    uniforms.uHorizon.value.set(sky.horizon);
    uniforms.uStars.value = l.stars;
    uniforms.uTime.value = state.clock.elapsedTime;
    const set = smoothstep(0, 0.48, p);
    if (sun.current) {
      sun.current.position.y = 2.8 - 5.6 * set;
      (sun.current.material as THREE.MeshBasicMaterial).opacity = 1 - smoothstep(0.35, 0.5, p);
    }
    if (glow.current) {
      glow.current.position.y = 2.8 - 5.6 * set;
      (glow.current.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - smoothstep(0.3, 0.55, p));
    }
    const night = smoothstep(0.25, 0.8, p);
    mountainMats.current.forEach((m, i) => m && m.color.copy(mountainDay[i]).lerp(mountainNight[i], night));
    if (water.current) {
      const wm = water.current.material as THREE.MeshBasicMaterial;
      wm.color.set(sky.bottom).lerp(tmp.set("#0a0d22"), 0.35 + 0.5 * night);
    }
  });

  return (
    <group>
      <mesh position={[0, 8, -26]}>
        <planeGeometry args={[130, 64]} />
        <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={skyVert} fragmentShader={skyFrag} depthWrite={false} />
      </mesh>
      <mesh ref={glow} position={[-6.6, 2.8, -25.6]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial map={glowTex} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={sun} position={[-6.6, 2.8, -25.5]}>
        <circleGeometry args={[1.05, 48]} />
        <meshBasicMaterial color="#ffd38a" transparent toneMapped={false} />
      </mesh>
      {mountains.map((g, i) => (
        <mesh key={i} geometry={g} position={[0, -0.9, -21 + i * 2.2]} scale={[1.6, 1, 1]}>
          <meshBasicMaterial ref={(m) => void (mountainMats.current[i] = m)} color={mountainDay[i]} />
        </mesh>
      ))}
      <mesh ref={water} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, -14.5]}>
        <planeGeometry args={[90, 6]} />
        <meshBasicMaterial color="#e0a080" />
      </mesh>
      <City />
    </group>
  );
}
