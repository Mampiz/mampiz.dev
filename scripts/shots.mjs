import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

// Set CHROME_PATH to use a browser Playwright did not install itself.
const EXE = process.env.CHROME_PATH;
const url = process.env.URL ?? "http://localhost:4321/mampiz.dev/";
const out = process.env.OUT ?? "/tmp/claude-1000/-home-mampi/51cd585a-6061-42a7-86f6-9e2721fe8b17/scratchpad/shots";
const theme = process.env.THEME ?? "dark";
const width = Number(process.env.W ?? 1440);
mkdirSync(out, { recursive: true });

const browser = await chromium.launch(EXE ? { executablePath: EXE } : {});
const height = Number(process.env.H ?? 900);
const page = await browser.newPage({ viewport: { width, height } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(e.message));
await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 300) {
    window.scrollTo({ top: y, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 50));
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
});
await page.waitForTimeout(900);

const targets = process.env.ONLY
  ? process.env.ONLY.split(",")
  : ["#webapp-operator", "#idp-backstage", "#birdvision", "#llm-gateway", "#stack", "#about", "#contact"];

for (const sel of targets) {
  const el = page.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const name = sel.replace(/[^a-z0-9-]/gi, "") + `-${theme}-${width}`;
  await el.screenshot({ path: `${out}/${name}.png` });
}

await browser.close();
console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "no console errors");
