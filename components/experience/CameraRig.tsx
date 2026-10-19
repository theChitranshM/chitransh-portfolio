"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { landscapeKeys, portraitKeys, sampleCamera, type CamKey } from "@/lib/cameraPath";

const blank = (): CamKey => ({ pos: [0, 0, 0], target: [0, 0, 0], fov: 34, offset: [0, 0] });

export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const goal = useRef(blank());
  const look = useRef(new THREE.Vector3(0.15, 1.25, -0.7));
  const offset = useRef<[number, number]>([0.14, 0.02]);
  const mouse = useRef({ x: 0, y: 0 });
  const first = useRef(true);
  const tmp = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const s = useStore.getState();
    const portrait = size.height > size.width;
    const keys = portrait ? portraitKeys : landscapeKeys;
    // reduced motion: snap to the chapter framing (the DOM crossfade hides the cut)
    const cf = s.reducedMotion ? s.chapter : s.chapterFloat;
    const g = sampleCamera(keys, cf, goal.current);

    const k = first.current || s.reducedMotion ? 1 : 1 - Math.pow(1 - 0.08, Math.min(delta, 0.1) * 60);
    first.current = false;

    // tiny mouse parallax on desktop
    const px = portrait ? 0 : mouse.current.x * 0.06;
    const py = portrait ? 0 : -mouse.current.y * 0.04;
    tmp.current.set(g.pos[0] + px, g.pos[1] + py, g.pos[2]);
    camera.position.lerp(tmp.current, k);
    tmp.current.set(g.target[0], g.target[1], g.target[2]);
    look.current.lerp(tmp.current, k);
    camera.lookAt(look.current);

    const fov = THREE.MathUtils.lerp(camera.fov, g.fov, k);
    offset.current[0] = THREE.MathUtils.lerp(offset.current[0], g.offset[0], k);
    offset.current[1] = THREE.MathUtils.lerp(offset.current[1], g.offset[1], k);
    const w = size.width;
    const h = size.height;
    camera.fov = fov;
    // principal-point shift: moves the subject beside/above the text without changing the aim
    camera.setViewOffset(w, h, -offset.current[0] * w, offset.current[1] * h, w, h);
    camera.updateProjectionMatrix();
  });

  return null;
}
