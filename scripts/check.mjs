// Plays through the site like a visitor and checks every achievement + egg fires and persists.
// Usage: node scripts/check.mjs [baseUrl]
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const base = process.argv[2] || "http://localhost:3100";
mkdirSync("shots", { recursive: true });
const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"],
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
const page = await ctx.newPage();
const errors = [];
const logs = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => (m.type() === "error" ? errors.push(m.text()) : logs.push(m.text())));

const results = [];
const ok = (name, pass, extra = "") => results.push(`${pass ? "PASS" : "FAIL"}  ${name}${extra ? `  (${extra})` : ""}`);
const unlocked = () => page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("dialed-in:achievements") || "{}")));
const scrollTo = async (id, end = false) => {
  await page.evaluate(
    ([id, end]) => window.scrollTo(0, end ? document.documentElement.scrollHeight : document.getElementById(id).offsetTop + 2),
    [id, end],
  );
  await page.waitForTimeout(1600);
};

await page.goto(`${base}/?quality=high`, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
ok("console hello", logs.some((l) => l.includes("opened devtools on a portfolio")));
await page.getByRole("button", { name: /pull the shot/ }).click({ timeout: 20000 });
await page.waitForTimeout(1200);
ok("first-sip", (await unlocked()).includes("first-sip"));

await page.getByRole("button", { name: /caffeine .* click to refill/ }).click();
await page.waitForTimeout(2200);
ok("barista (refill)", (await unlocked()).includes("barista"));

await page.mouse.click(700, 450); // focus the page, not an input
await page.keyboard.type("fix");
await page.waitForTimeout(700);
await page.screenshot({ path: "shots/check-fixbro.png" });
ok("prompt-engineer (fix -> BRO)", (await unlocked()).includes("prompt-engineer"));
await page.waitForTimeout(1500);

await scrollTo("origin");
await page.getByRole("button", { name: "poke the robot" }).click();
await page.waitForTimeout(300);
ok("robot beep tooltip", (await page.getByRole("status").filter({ hasText: "beep." }).count()) > 0);
await page.getByRole("button", { name: "look at the laurel wreath" }).click();
await page.waitForTimeout(400);
ok("et-tu (laurel)", (await unlocked()).includes("et-tu"));

await scrollTo("events");
await page.getByRole("button", { name: /fall kickoff 2024/ }).first().click();
await page.waitForTimeout(500);
const dialog = page.getByRole("dialog", { name: "fall kickoff 2024" });
ok("polaroid enlarges", await dialog.isVisible());
await page.screenshot({ path: "shots/check-polaroid.png" });
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
ok("polaroid closes on escape", !(await dialog.isVisible().catch(() => false)));

await scrollTo("twin");
await page.getByRole("button", { name: "best project?" }).click();
await page.waitForTimeout(6000);
const reply = await page.locator("#twin [aria-live] p").last().innerText().catch(() => "");
ok("twin replies", reply.length > 20, reply.slice(0, 90));
ok("twin achievement", (await unlocked()).includes("twin"));
await page.screenshot({ path: "shots/check-twin.png" });

await scrollTo("night", true);
ok("night-owl", (await unlocked()).includes("night-owl"));
await page.getByRole("button", { name: "do not click" }).click();
await page.waitForTimeout(300);
ok("do-not-click label flips", (await page.getByRole("button", { name: /you clicked it/ }).count()) > 0);
ok("reverse-psychologist", (await unlocked()).includes("reverse-psychologist"));

const [download] = await Promise.all([page.waitForEvent("download", { timeout: 5000 }).catch(() => null), page.getByRole("link", { name: /resume/ }).first().click()]);
ok("resume downloads", !!download, download?.suggestedFilename());
await page.waitForTimeout(1500);
ok("recruiter (resume)", (await unlocked()).includes("recruiter"));
const all = await unlocked();
ok("all 8 unlocked", all.length === 8, all.join(","));
ok("dialed in gold toast", (await page.getByText("you're dialed in").count()) > 0);
await page.screenshot({ path: "shots/check-dialed-in.png" });

await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: /pull the shot/ }).click({ timeout: 20000 });
await page.waitForTimeout(1000);
ok("achievements persist across reload", (await page.getByRole("button", { name: /achievements: 8 of 8/ }).count()) > 0);

console.log(results.join("\n"));
console.log(errors.length ? `\nconsole errors:\n  ${[...new Set(errors)].join("\n  ")}` : "\nno console errors");
await browser.close();
