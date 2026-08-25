// Renders the social preview card to public/og.png. Run: node scripts/make-og.mjs
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8b9bff" stop-opacity="0.30"/>
      <stop offset="60%" stop-color="#8b9bff" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0V72" fill="none" stroke="#191d23" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#08090b"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <circle cx="80" cy="86" r="7" fill="#8b9bff"/>
  <text x="104" y="94" font-family="DejaVu Sans, Helvetica, Arial, sans-serif" font-size="27" fill="#a3aab4" letter-spacing="1">Josep Mampel Marqu&#233;s</text>
  <text x="80" y="248" font-family="DejaVu Sans, Helvetica, Arial, sans-serif" font-size="67" font-weight="bold" fill="#f1f2f4">I build the layer</text>
  <text x="80" y="326" font-family="DejaVu Sans, Helvetica, Arial, sans-serif" font-size="67" font-weight="bold" fill="#f1f2f4">other engineers stand on.</text>
  <rect x="80" y="358" width="415" height="5" rx="2.5" fill="#8b9bff"/>
  <text x="80" y="452" font-family="DejaVu Sans Mono, monospace" font-size="25" fill="#a3aab4">Go &#183; Kubernetes &#183; platform engineering &#183; automotive firmware</text>
  <rect x="78" y="516" width="1044" height="1" fill="#23282f"/>
  <text x="80" y="570" font-family="DejaVu Sans Mono, monospace" font-size="23" fill="#6b727c">Barcelona &#183; open to remote</text>
  <text x="1120" y="570" text-anchor="end" font-family="DejaVu Sans Mono, monospace" font-size="23" fill="#6b727c">github.com/Mampiz</text>
</svg>`;

writeFileSync("public/og.svg", svg);
await sharp(Buffer.from(svg)).png().toFile("public/og.png");
console.log("wrote public/og.png");
