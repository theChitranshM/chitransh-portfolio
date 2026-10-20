// Checks every fallback path lands somewhere good: reduced motion, no WebGL, JS off, 360px wide.
// Usage: node scripts/paths.mjs [baseUrl]
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const base = process.argv[2] || "http://localhost:3100";
mkdirSync("shots", { recursive: true });
const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"],
});
const results = [];
const ok = (name, pass, extra = "") => results.push(`${pass ? "PASS" : "FAIL"}  ${name}${extra ? `  (${extra})` : ""}`);
const phone = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

// 1. reduced motion -> recruiter mode with a banner back to the experience
{
  const ctx = await browser.newContext({ ...phone, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${base}/`);
  await page.waitForURL(/\/recruiter\?from=auto/, { timeout: 15000 }).catch(() => {});
  ok("reduced motion redirects to recruiter mode", page.url().includes("/recruiter?from=auto"), page.url());
  const banner = page.getByRole("link", { name: /full experience is here/ });
  ok("banner links back to the full experience", await banner.isVisible().catch(() => false));
  await page.screenshot({ path: "shots/path-reduced-banner.png" });
  // 2. opting in: experience without smooth scroll, flights or SplitText
  await banner.click();
  await page.waitForURL(/full=1/);
  await page.getByRole("button", { name: /pull the shot/ }).click({ timeout: 20000 });
  await page.waitForTimeout(1200);
  ok("reduced motion: no lenis smooth scroll", !(await page.evaluate(() => document.documentElement.classList.contains("lenis"))));
  await page.evaluate(() => window.scrollTo(0, document.getElementById("receipt").offsetTop + 2));
  await page.waitForTimeout(1200);
  const visible = await page.evaluate(() => {
    const h = document.getElementById("receipt-title");
    return h ? getComputedStyle(h).opacity === "1" && !h.querySelector(".split-line") : false;
  });
  ok("reduced motion: text shown without split animation", visible);
  const lines = await page.locator("[aria-label='work history receipt'] .receipt-line").count();
  ok("reduced motion: receipt shows fully, no printing", lines > 20, `${lines} lines`);
  await page.screenshot({ path: "shots/path-reduced-full.png" });
  await ctx.close();
}

// 3. no WebGL -> recruiter mode; with full=1 the DOM-only experience still works
{
  const ctx = await browser.newContext(phone);
  const page = await ctx.newPage();
  await page.goto(`${base}/?quality=none`);
  await page.waitForURL(/\/recruiter/, { timeout: 15000 }).catch(() => {});
  ok("no WebGL redirects to recruiter mode", page.url().includes("/recruiter"));
  await page.goto(`${base}/?quality=none&full=1`);
  await page.getByRole("button", { name: /pull the shot/ }).click({ timeout: 20000 });
  await page.waitForTimeout(1500);
  ok("no WebGL + full=1: no canvas", (await page.locator("canvas").count()) <= 1, "confetti canvas only");
  ok("no WebGL + full=1: hero readable", await page.getByRole("heading", { name: /i build AI/ }).isVisible());
  await page.screenshot({ path: "shots/path-nowebgl.png" });
  await ctx.close();
}

// 4. JavaScript off
{
  const ctx = await browser.newContext({ ...phone, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(`${base}/recruiter`);
  ok("JS off: recruiter mode renders", await page.getByRole("heading", { name: "Experience", exact: true }).isVisible());
  ok("JS off: resume link present", (await page.getByRole("link", { name: "Download resume" }).count()) > 0);
  await page.goto(`${base}/`);
  ok("JS off: loader hidden", !(await page.getByRole("button", { name: /pull the shot/ }).isVisible().catch(() => false)));
  ok("JS off: hero text readable", await page.getByRole("heading", { name: /i build AI/ }).isVisible());
  ok("JS off: note points to recruiter mode", (await page.content()).includes("javascript is off"), "inside <noscript>, checked visually");
  await page.screenshot({ path: "shots/path-nojs.png" });
  await ctx.close();
}

// 5. no horizontal scroll at 360px
{
  const ctx = await browser.newContext({ ...phone, viewport: { width: 360, height: 780 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/recruiter`);
  let w = await page.evaluate(() => document.documentElement.scrollWidth);
  ok("360px: recruiter has no horizontal scroll", w <= 360, `${w}px`);
  await page.goto(`${base}/?quality=low`);
  await page.getByRole("button", { name: /pull the shot/ }).click({ timeout: 20000 });
  const widths = [];
  for (const id of ["hero", "origin", "ticket", "work", "receipt", "events", "twin", "night"]) {
    await page.evaluate((id) => window.scrollTo(0, document.getElementById(id).offsetTop + 2), id);
    await page.waitForTimeout(500);
    widths.push(await page.evaluate(() => document.documentElement.scrollWidth));
  }
  ok("360px: experience has no horizontal scroll", Math.max(...widths) <= 360, widths.join(","));
  await ctx.close();
}

console.log(results.join("\n"));
await browser.close();
