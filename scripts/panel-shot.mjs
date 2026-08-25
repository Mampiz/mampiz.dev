import { chromium } from "playwright";
const EXE = process.env.CHROME_PATH;
const out = "/tmp/claude-1000/-home-mampi/51cd585a-6061-42a7-86f6-9e2721fe8b17/scratchpad/shots";
const b = await chromium.launch(EXE ? { executablePath: EXE } : {});
for (const theme of ["dark", "light"]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.addInitScript((t) => localStorage.setItem("theme", t), theme);
  await p.goto("http://localhost:4321/mampiz.dev/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  const panels = p.locator(".panels");
  await panels.screenshot({ path: `${out}/panels-${theme}.png` });
  // and hovered
  await p.locator(".panel").nth(1).hover();
  await p.waitForTimeout(900);
  await panels.screenshot({ path: `${out}/panels-${theme}-hover.png` });
  await p.close();
}
await b.close();
console.log("panel shots done");
