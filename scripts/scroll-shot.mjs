import { chromium } from "playwright";
const EXE = process.env.CHROME_PATH;
const b = await chromium.launch(EXE ? { executablePath: EXE } : {});
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.addInitScript((t) => localStorage.setItem("theme", t), process.env.THEME ?? "dark");
await p.goto("http://localhost:4321/mampiz.dev/", { waitUntil: "networkidle" });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo({top:y,behavior:'instant'}); await new Promise(r=>setTimeout(r,50)); } });
for (const y of (process.env.YS ?? "900").split(",")) {
  await p.evaluate((v) => window.scrollTo({ top: Number(v), behavior: "instant" }), y);
  await p.waitForTimeout(500);
  await p.screenshot({ path: `/tmp/claude-1000/-home-mampi/51cd585a-6061-42a7-86f6-9e2721fe8b17/scratchpad/shots/at-${y}.png` });
}
await b.close();
console.log("done");
