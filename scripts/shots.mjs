// Screenshots every chapter at 390x844 and 1440x900 with the system Chrome.
// Usage: node scripts/shots.mjs [baseUrl] [outDir] [query]
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const base = process.argv[2] || "http://localhost:3100";
const out = process.argv[3] || "shots";
const query = process.argv[4] ?? "?quality=high";
mkdirSync(out, { recursive: true });

const chapters = ["hero", "origin", "ticket", "work", "receipt", "events", "twin", "night"];
const only = process.env.SIZES?.split(",");
const sizes = [
  { name: "mobile", width: 390, height: 844, mobile: true },
  { name: "desktop", width: 1440, height: 900, mobile: false },
].filter((s) => !only || only.includes(s.name));

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"],
  headless: true,
});
for (const s of sizes) {
  const ctx = await browser.newContext({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: s.mobile ? 2 : 1,
    isMobile: s.mobile,
    hasTouch: s.mobile,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(`${base}/${query}`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /pull the shot/ }).click({ timeout: 20000 });
  await page.waitForTimeout(1600);
  for (const [i, id] of chapters.entries()) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      const y = id === "night" ? document.documentElement.scrollHeight : el.offsetTop + 2;
      window.scrollTo(0, y);
    }, id);
    await page.waitForTimeout(id === "receipt" ? 4200 : 1900);
    await page.screenshot({ path: `${out}/${s.name}-${i + 1}-${id}.png` });
  }
  console.log(s.name, errors.length ? `errors:\n  ${[...new Set(errors)].join("\n  ")}` : "no errors");
  await ctx.close();
}
await browser.close();
