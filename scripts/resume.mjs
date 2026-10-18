// Prints /recruiter (print stylesheet) to public/resume.pdf with headless Chrome.
// Usage: start the site (npm run dev or npm start), then: npm run resume [-- http://localhost:3000]
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const base = process.argv[2] || "http://localhost:3000";
const candidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) {
  console.error("Chrome not found. Set CHROME_PATH.");
  process.exit(1);
}
const out = resolve("public/resume.pdf");
execFileSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  `--print-to-pdf=${out}`,
  "--virtual-time-budget=4000",
  `${base}/recruiter`,
]);
console.log(`wrote ${out}`);
