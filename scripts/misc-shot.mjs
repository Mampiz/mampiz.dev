import { chromium } from "playwright";
const EXE = process.env.CHROME_PATH;
const out = "/tmp/claude-1000/-home-mampi/51cd585a-6061-42a7-86f6-9e2721fe8b17/scratchpad/shots";
const b = await chromium.launch(EXE ? { executablePath: EXE } : {});
const errs = [];
// 404
let p = await b.newPage({ viewport: { width: 1280, height: 800 } });
p.on("pageerror", e => errs.push("404: " + e.message));
await p.goto("http://localhost:4321/mampiz.dev/404.html", { waitUntil: "networkidle" });
await p.waitForTimeout(600);
await p.screenshot({ path: `${out}/notfound.png` });
await p.close();
// mobile: hero + team
p = await b.newPage({ viewport: { width: 390, height: 844 } });
p.on("pageerror", e => errs.push("mobile: " + e.message));
await p.goto("http://localhost:4321/mampiz.dev/", { waitUntil: "networkidle" });
await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=400){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,40));} window.scrollTo({top:0,behavior:'instant'}); });
await p.waitForTimeout(900);
await p.locator(".panels").screenshot({ path: `${out}/panels-mobile.png` });
await p.locator("#team").scrollIntoViewIfNeeded();
await p.waitForTimeout(500);
await p.screenshot({ path: `${out}/team-mobile.png` });
await p.close();
await b.close();
console.log(errs.length ? errs.join("\n") : "no page errors");
