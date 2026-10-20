// Clicks real 3D objects: finds each by scanning for its cursor word, then clicks it.
// Usage: node scripts/click3d.mjs [baseUrl]
import { chromium } from "playwright-core";
const base = process.argv[2] || "http://localhost:3100";
const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"],
});
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto(`${base}/?quality=medium`, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.getByRole("button", { name: /pull the shot/ }).click({ timeout: 20000 });
await page.waitForTimeout(2500);
// the cursor ring's word (it fades in, so read the text, not the opacity)
const label = () => page.evaluate(() => document.querySelector("div.fixed.left-0.top-0 span")?.textContent || null);
async function find(word, box) {
  for (let y = box[1]; y < box[3]; y += 28)
    for (let x = box[0]; x < box[2]; x += 28) {
      await page.mouse.move(x, y);
      await page.waitForTimeout(16);
      if ((await label()) === word) return { x, y };
    }
  return null;
}
const ach = () => page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("dialed-in:achievements") || "{}")));
const out = [];
// hero wide shot: espresso machine sits left of the laptop on the desk
const espresso = await find("refill", [560, 300, 1000, 640]);
out.push(`espresso machine found: ${JSON.stringify(espresso)}`);
if (espresso) {
  await page.mouse.click(espresso.x, espresso.y);
  await page.waitForTimeout(2300);
  out.push(`  after click -> barista unlocked: ${(await ach()).includes("barista")}`);
}
// origin: robot + laurel on the shelf
await page.evaluate(() => window.scrollTo(0, document.getElementById("origin").offsetTop + 2));
await page.waitForTimeout(2500);
const robot = await find("beep", [300, 150, 1100, 750]);
out.push(`robot found: ${JSON.stringify(robot)}`);
if (robot) {
  await page.mouse.click(robot.x, robot.y);
  await page.waitForTimeout(300);
  out.push(`  after click -> "beep." tooltip: ${(await page.getByRole("status").filter({ hasText: "beep." }).count()) > 0}`);
}
const laurel = await find("et tu", [0, 150, 900, 800]);
out.push(`laurel found: ${JSON.stringify(laurel)}`);
if (laurel) {
  await page.mouse.click(laurel.x, laurel.y);
  await page.waitForTimeout(400);
  out.push(`  after click -> et-tu unlocked: ${(await ach()).includes("et-tu")}`);
}
// events: a polaroid on the 3D wall opens the enlarged view
await page.evaluate(() => window.scrollTo(0, document.getElementById("events").offsetTop + 2));
await page.waitForTimeout(2500);
const pol = await find("open", [700, 150, 1400, 800]);
out.push(`3D polaroid found: ${JSON.stringify(pol)}`);
if (pol) {
  await page.mouse.click(pol.x, pol.y);
  await page.waitForTimeout(400);
  out.push(`  after click -> dialog open: ${(await page.getByRole("dialog").count()) > 0}`);
}
console.log(out.join("\n"));
await browser.close();
