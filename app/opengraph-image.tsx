import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

export const alt = "i build AI. mostly on espresso. Chitransh Motwani, Vancouver";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "assets/fonts");
const serif = await readFile(join(fontDir, "InstrumentSerif-Regular.ttf"));
const serifItalic = await readFile(join(fontDir, "InstrumentSerif-Italic.ttf"));
const mono = await readFile(join(fontDir, "GeistMono-Regular.ttf"));

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 78% 18%, #4A3022 0%, #2A1A12 32%, #140D09 70%)",
          color: "#F7F1E8",
        }}
      >
        <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 22, letterSpacing: 3, color: "#E9C9A1" }}>
          VANCOUVER · 4:47 PM · CAFFEINE 100%
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Instrument Serif", lineHeight: 0.92 }}>
          <div style={{ fontSize: 150, letterSpacing: -3 }}>{site.hero.titleLine1}</div>
          <div style={{ fontSize: 150, letterSpacing: -3, fontStyle: "italic", color: "#FFB547" }}>
            {site.hero.titleLine2}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "Geist Mono", fontSize: 24 }}>
          <span style={{ color: "#E9C9A1" }}>chitransh motwani · vancouver</span>
          <span style={{ color: "#9CFF6E" }}>dialed in ☕</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: serif, style: "normal", weight: 400 },
        { name: "Instrument Serif", data: serifItalic, style: "italic", weight: 400 },
        { name: "Geist Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
