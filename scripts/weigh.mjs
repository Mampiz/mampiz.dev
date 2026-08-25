import { chromium } from "playwright";
const EXE = process.env.CHROME_PATH;
const b = await chromium.launch(EXE ? { executablePath: EXE } : {});
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
let bytes = 0; const byType = {};
p.on("response", async (r) => {
  try { const buf = await r.body(); bytes += buf.length;
    const t = r.request().resourceType(); byType[t] = (byType[t] ?? 0) + buf.length; } catch {}
});
await p.goto("http://localhost:4321/mampiz.dev/", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
console.log("initial load:", (bytes/1024).toFixed(0), "KB");
console.log(Object.entries(byType).map(([k,v]) => `  ${k}: ${(v/1024).toFixed(0)} KB`).join("\n"));
await b.close();
