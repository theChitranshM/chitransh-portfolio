// Measures frame rate while scrolling the whole evening (desktop, high tier).
import { chromium } from "playwright-core";
const base = process.argv[2] || "http://localhost:3100";
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"] });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto(`${base}/${process.argv[3] ?? "?quality=high"}`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /pull the shot/ }).click({ timeout: 20000 });
await page.waitForTimeout(2000);
const r = await page.evaluate(async () => {
  const times = [];
  let last = performance.now();
  let run = true;
  const tick = (t) => { times.push(t - last); last = t; if (run) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  const max = document.documentElement.scrollHeight - innerHeight;
  for (let i = 0; i <= 200; i++) { window.scrollTo(0, (max * i) / 200); await new Promise((r) => setTimeout(r, 40)); }
  run = false;
  times.sort((a, b) => a - b);
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  return { frames: times.length, avgFps: Math.round(1000 / avg), p95ms: Math.round(times[Math.floor(times.length * 0.95)]) };
});
console.log(JSON.stringify(r));
await browser.close();
