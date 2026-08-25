// Builds small WebP previews for the hero rail and the gallery strips, so the
// first screen costs kilobytes instead of the full-size recordings.
// Run: npm run thumbs
import sharp from "sharp";
import { readdirSync, mkdirSync, statSync } from "node:fs";
import { join, parse } from "node:path";

const source = "public/media";
const target = join(source, "thumbs");
mkdirSync(target, { recursive: true });

const WIDTH = 720;
let saved = 0;

for (const file of readdirSync(source)) {
  const { name, ext } = parse(file);
  if (![".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext.toLowerCase())) {
    continue;
  }

  const from = join(source, file);
  const to = join(target, `${name}.webp`);

  // Animated sources need a frame from the middle of the run: frame 0 of a
  // terminal recording is an empty prompt, which makes a useless thumbnail.
  const { pages = 1 } = await sharp(from).metadata();
  const page = pages > 1 ? Math.floor(pages * 0.65) : 0;

  await sharp(from, { page })
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: 74 })
    .toFile(to);

  const before = statSync(from).size;
  const after = statSync(to).size;
  saved += before - after;
  console.log(
    `${file.padEnd(30)} ${(before / 1024).toFixed(0).padStart(5)} KB → ${(
      after / 1024
    )
      .toFixed(0)
      .padStart(4)} KB`,
  );
}

console.log(`\nthumbnails would save ${(saved / 1024).toFixed(0)} KB per full load`);
