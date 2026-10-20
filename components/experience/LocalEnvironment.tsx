"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A tiny environment map built from three glowing panels, so metal and glass have something
 * to reflect. Built once with PMREM: no HDR files, no loaders in the bundle.
 */
export function LocalEnvironment({ intensity = 0.35 }: { intensity?: number }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    const env = new THREE.Scene();
    const panel = (color: string, strength: number, size: [number, number], pos: [number, number, number], rot: [number, number, number]) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(...size),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(strength), side: THREE.DoubleSide }),
      );
      m.position.set(...pos);
      m.rotation.set(...rot);
      env.add(m);
      return m;
    };
    // window glow, ceiling bounce, cool fill from the side
    const meshes = [
      panel("#ffb547", 3, [8, 3], [0, 2, -6], [0, 0, 0]),
      panel("#ffe2c4", 1.2, [8, 8], [0, 6, 2], [Math.PI / 2, 0, 0]),
      panel("#9fb0ff", 0.6, [6, 3], [6, 2, 2], [0, -Math.PI / 2, 0]),
    ];
    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(env, 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = intensity;
    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
      meshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
    };
  }, [gl, scene, intensity]);

  return null;
}
