// One camera keyframe per chapter. `offset` shifts the subject on screen
// (fraction of the viewport: +x right, +y up) so the 3D subject sits beside or above the text.
export type CamKey = {
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
  offset: [number, number];
};

export const landscapeKeys: CamKey[] = [
  // 0 hero: wide shot of the whole room, window glowing
  { pos: [2.9, 2.55, 5.6], target: [0.15, 1.25, -0.7], fov: 34, offset: [0.14, 0.02] },
  // 1 origin: dolly to the shelf, robot centre
  { pos: [-0.7, 1.92, 0.55], target: [-2.35, 1.66, -1.0], fov: 34, offset: [-0.16, 0] },
  // 2 ticket: framed ticket + mini SUB
  { pos: [-1.15, 1.85, 0.55], target: [-2.4, 1.66, -0.55], fov: 32, offset: [0.02, 0] },
  // 3 work: push into the laptop screen
  { pos: [0.02, 1.16, -0.38], target: [0.0, 0.98, -1.4], fov: 36, offset: [0, 0] },
  // 4 receipt: over the shoulder on the printer
  { pos: [-0.05, 1.34, -0.42], target: [0.52, 0.86, -1.28], fov: 36, offset: [0, 0.03] },
  // 5 events: pan to the polaroid wall
  { pos: [0.7, 1.66, -0.12], target: [2.585, 1.6, -0.66], fov: 40, offset: [0.2, 0] },
  // 6 twin: back to the laptop, terminal on screen
  { pos: [-0.5, 1.45, 0.4], target: [0.0, 1.0, -1.35], fov: 34, offset: [-0.02, 0.02] },
  // 7 night: pull back to the wide shot, city lit
  { pos: [3.2, 2.85, 6.4], target: [0.0, 1.35, -0.8], fov: 34, offset: [0, 0.1] },
];

// portrait: pulled back, taller framing, subject pushed into the top of the screen
export const portraitKeys: CamKey[] = [
  { pos: [2.6, 2.9, 7.6], target: [0.0, 1.35, -0.9], fov: 52, offset: [0, 0.2] },
  { pos: [-0.6, 2.05, 1.0], target: [-2.35, 1.66, -1.08], fov: 54, offset: [0, 0.22] },
  { pos: [-0.75, 1.9, 1.25], target: [-2.4, 1.66, -0.6], fov: 52, offset: [0, 0.06] },
  { pos: [0.02, 1.45, 0.35], target: [0.0, 1.0, -1.35], fov: 54, offset: [0, 0.33] },
  { pos: [0.05, 1.6, 0.25], target: [0.5, 0.86, -1.28], fov: 54, offset: [0, 0.18] },
  { pos: [0.25, 1.85, 1.0], target: [2.55, 1.68, -0.62], fov: 54, offset: [0, 0.2] },
  { pos: [-0.5, 1.55, 0.45], target: [0.05, 1.0, -1.35], fov: 54, offset: [0, 0.33] },
  { pos: [2.8, 3.1, 8.6], target: [0.0, 1.4, -0.9], fov: 52, offset: [0, 0.24] },
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * chapterFloat = chapter index + fraction scrolled through it.
 * The camera holds for the first part of a chapter, then flies to the next one,
 * arriving as the next chapter's stage locks in.
 */
export function sampleCamera(keys: CamKey[], chapterFloat: number, out: CamKey) {
  const i = Math.max(0, Math.min(keys.length - 1, Math.floor(chapterFloat)));
  const j = Math.min(keys.length - 1, i + 1);
  const f = chapterFloat - i;
  const t = j === i ? 0 : smooth(Math.min(1, Math.max(0, (f - 0.42) / 0.58)));
  const a = keys[i];
  const b = keys[j];
  for (let k = 0; k < 3; k++) {
    out.pos[k] = lerp(a.pos[k], b.pos[k], t);
    out.target[k] = lerp(a.target[k], b.target[k], t);
  }
  out.fov = lerp(a.fov, b.fov, t);
  out.offset[0] = lerp(a.offset[0], b.offset[0], t);
  out.offset[1] = lerp(a.offset[1], b.offset[1], t);
  return out;
}
