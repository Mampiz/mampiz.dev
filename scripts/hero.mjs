import { chromium } from "playwright";
// Set CHROME_PATH to use a browser Playwright did not install itself.
const EXE = process.env.CHROME_PATH;
const out = "/tmp/claude-1000/-home-mampi/51cd585a-6061-42a7-86f6-9e2721fe8b17/scratchpad/shots";
const b = await chromium.launch(EXE ? { executablePath: EXE } : {});
for (const [name, w, h, theme] of [["hero-dark",1440,900,"dark"],["hero-light",1440,900,"light"],["hero-mobile",390,844,"dark"],["mobile-work",390,844,"dark"]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.addInitScript((t) => localStorage.setItem("theme", t), theme);
  await p.goto("http://localhost:4321/mampiz.dev/", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  if (name === "mobile-work") { await p.locator("#webapp-operator").scrollIntoViewIfNeeded(); await p.waitForTimeout(900); }
  await p.screenshot({ path: `${out}/${name}.png` });
  await p.close();
}
await b.close();
console.log("hero shots done");
