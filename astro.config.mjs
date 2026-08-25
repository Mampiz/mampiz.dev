// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Set PUBLIC_SITE / PUBLIC_BASE at build time to move the site to a custom
// domain without touching the code. Defaults target GitHub Pages.
const site = process.env.PUBLIC_SITE ?? "https://mampiz.github.io";
const base = process.env.PUBLIC_BASE ?? "/mampiz.dev";

export default defineConfig({
  site,
  base,
  trailingSlash: "ignore",
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: "auto" },
});
