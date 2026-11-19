// Renders the social preview card to public/og.png. Run: node scripts/make-og.mjs
import sharp from "sharp";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2f4bff" stop-opacity="0.30"/>
      <stop offset="60%" stop-color="#2f4bff" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0V72" fill="none" stroke="#151c4c" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#0d1236"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <circle cx="80" cy="86" r="7" fill="#2f4bff"/>
  <text x="104" y="94" font-family="DejaVu Sans, Helvetica, Arial, sans-serif" font-size="27" fill="#b3b9d6" letter-spacing="1">Josep Mampel Marqu&#233;s</text>
  <text x="80" y="248" font-family="DejaVu Sans, Helvetica, Arial, sans-serif" font-size="67" font-weight="bold" fill="#eef0fa">I build things, then try</text>
  <text x="80" y="326" font-family="DejaVu Sans, Helvetica, Arial, sans-serif" font-size="67" font-weight="bold" fill="#eef0fa">to break them.</text>
  <rect x="80" y="358" width="330" height="5" rx="2.5" fill="#2f4bff"/>
  <text x="80" y="452" font-family="DejaVu Sans Mono, monospace" font-size="25" fill="#b3b9d6">Some Go, some Kubernetes, one bird detector.</text>
  <rect x="78" y="516" width="1044" height="1" fill="#29316a"/>
  <text x="80" y="570" font-family="DejaVu Sans Mono, monospace" font-size="23" fill="#8088ad">Barcelona</text>
  <text x="1120" y="570" text-anchor="end" font-family="DejaVu Sans Mono, monospace" font-size="23" fill="#8088ad">github.com/Mampiz</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og.png");
console.log("wrote public/og.png");
