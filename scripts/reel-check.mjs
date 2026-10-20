// Records frames of /?reel=1 in portrait (1080x1920) to check the auto-play.
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
const base = process.argv[2] || "http://localhost:3100";
mkdirSync("shots", { recursive: true });
const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"],
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 693 }, deviceScaleFactor: 2.77, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(`${base}/?reel=1&dur=12&quality=medium`);
// no enter button in reel mode: wait for the loader to go away by itself
await page.waitForFunction(() => !document.querySelector('[aria-label="loading"]'), null, { timeout: 30000 });
const t0 = Date.now();
const marks = [0.5, 2, 3.5, 5.5, 7.5, 9, 10.5, 12.5, 14];
const notes = [];
for (const [i, t] of marks.entries()) {
  const wait = t * 1000 - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `shots/reel-${String(i).padStart(2, "0")}.png` });
  notes.push(
    await page.evaluate((t) => {
      const q = (s) => !!document.querySelector(s);
      return `${t}s y=${Math.round(scrollY)} fixbro=${q(".fixbro")} twinInput="${document.getElementById("twin-input")?.value ?? ""}"`;
    }, t),
  );
}
const hidden = await page.evaluate(() => ({
  nav: !document.querySelector('nav[aria-label="chapters"]'),
  recruiterBtn: !Array.from(document.querySelectorAll("header a")).some((a) => a.textContent.includes("recruiter")),
  clock: !!document.querySelector('[aria-label^="time in the story"]'),
  caffeine: !!document.querySelector('[aria-label^="caffeine"]'),
}));
const reply = await page.locator("#twin [aria-live] p").last().innerText().catch(() => "");
console.log(notes.join("\n"));
console.log("hidden/kept:", JSON.stringify(hidden));
console.log("twin reply:", reply.slice(0, 100));
console.log(errors.length ? `errors: ${errors.join(" | ")}` : "no page errors");
await browser.close();
