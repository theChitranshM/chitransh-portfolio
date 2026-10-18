"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

/** coffee-bean confetti when all 8 achievements are found */
export function Confetti() {
  const at = useStore((s) => s.confetti);
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!at || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const beans = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.6,
      vx: (Math.random() - 0.5) * 2,
      vy: 2 + Math.random() * 3,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      s: 6 + Math.random() * 5,
    }));
    let raf = 0;
    const t0 = performance.now();
    const draw = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const b of beans) {
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.05;
        b.r += b.vr;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.r);
        ctx.fillStyle = "#4A3022";
        ctx.beginPath();
        ctx.ellipse(0, 0, b.s, b.s * 0.68, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#1c110b";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-b.s * 0.7, 0);
        ctx.quadraticCurveTo(0, b.s * 0.35, b.s * 0.7, 0);
        ctx.stroke();
        ctx.restore();
      }
      if (now - t0 < 4500) raf = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [at]);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[55] h-full w-full" />;
}
