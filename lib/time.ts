// One evening: 4:47 pm to 1:12 am, scrubbed by scroll progress (0..1).
const START = 16 * 60 + 47; // 4:47 pm
const END = 24 * 60 + 60 + 12; // 1:12 am next day

export function clockMinutes(progress: number) {
  return START + (END - START) * Math.min(1, Math.max(0, progress));
}

export function formatClock(progress: number) {
  const total = Math.round(clockMinutes(progress)) % (24 * 60);
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`;
}

type RGB = [number, number, number];
const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const toHex = (c: RGB) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// sky keyframes: golden hour -> sunset -> dusk -> night
const SKY: { at: number; top: string; bottom: string; horizon: string }[] = [
  { at: 0.0, top: "#f3a65f", bottom: "#ffd79a", horizon: "#ffe2b0" },
  { at: 0.25, top: "#e9765e", bottom: "#ffb46b", horizon: "#ffc785" },
  { at: 0.45, top: "#6a3f7c", bottom: "#e07a68", horizon: "#f09a72" },
  { at: 0.62, top: "#2a2350", bottom: "#6b3d6c", horizon: "#8c4f6a" },
  { at: 0.8, top: "#0d1230", bottom: "#28264d", horizon: "#3a2f55" },
  { at: 1.0, top: "#060a1c", bottom: "#141c3a", horizon: "#1f2446" },
];

export function skyAt(progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  let i = 0;
  while (i < SKY.length - 2 && p > SKY[i + 1].at) i++;
  const a = SKY[i];
  const b = SKY[i + 1];
  const t = (p - a.at) / (b.at - a.at);
  const s = t * t * (3 - 2 * t);
  return {
    top: toHex(mix(hex(a.top), hex(b.top), s)),
    bottom: toHex(mix(hex(a.bottom), hex(b.bottom), s)),
    horizon: toHex(mix(hex(a.horizon), hex(b.horizon), s)),
  };
}

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** light levels for the 3D scene */
export function lightsAt(progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  return {
    sun: 1 - smooth(0.05, 0.6, p), // window key light
    lamp: 0.25 + 0.75 * smooth(0.2, 0.55, p),
    screen: 0.6 + 0.4 * smooth(0.3, 0.7, p),
    city: smooth(0.55, 0.8, p),
    stars: smooth(0.7, 0.95, p),
    ambient: 1 - 0.55 * smooth(0.1, 0.8, p),
  };
}

export { smooth as smoothstep, hex as hexToRgb, mix as mixRgb, toHex as rgbToHex };
