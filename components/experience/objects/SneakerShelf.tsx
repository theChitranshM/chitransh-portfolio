"use client";

import type { ThreeElements } from "@react-three/fiber";
import { site } from "@/content/site";
import { useStore } from "@/lib/store";
import { palette } from "@/lib/palette";
import { Interactive } from "../parts";

const colors = [palette.cherry, palette.crema, palette.amber, palette.milk, "#2f5d8a", palette.mocha, "#1d1714", palette.amber, palette.crema, palette.cherry];

/** a stack of sneaker boxes under the shelf (built facing +z) */
export function SneakerShelf(props: ThreeElements["group"]) {
  const setTooltip = useStore((s) => s.setTooltip);
  const boxes = (
    <group>
      {colors.map((c, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <group key={i} position={[col * 0.35 - 0.175 + (row % 2) * 0.012, 0.062 + row * 0.124, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.33, 0.12, 0.22]} />
              <meshStandardMaterial color={c} roughness={0.75} />
            </mesh>
            <mesh position={[0, 0.045, 0.111]}>
              <boxGeometry args={[0.33, 0.03, 0.002]} />
              <meshStandardMaterial color={c === palette.milk ? palette.mocha : palette.milk} roughness={0.8} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
  return (
    <group {...props}>
      {site.showSneakers ? (
        <Interactive label="kicks" onClick={() => setTooltip({ id: "sneakers", text: site.sneakers })} hit={[0.75, 0.65, 0.3]} hitPosition={[0, 0.31, 0]}>
          {boxes}
        </Interactive>
      ) : (
        boxes
      )}
    </group>
  );
}
