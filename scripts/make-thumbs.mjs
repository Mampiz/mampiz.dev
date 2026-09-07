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
const SAMPLES = 14;
let saved = 0;

/**
 * Pick the frame of an animation with the most on screen.
 *
 * A fixed ratio does not work: a terminal recording spends most of its frames
 * on a pause, so "65% of the way through" lands on an empty prompt as often as
 * not. Standard deviation of the greyscale channel is a good enough proxy for
 * how much is drawn, and the busiest frame is the one worth showing.
 */
async function busiestFrame(file, pages) {
  let best = { page: 0, spread: -1 };
  for (let i = 0; i < SAMPLES; i++) {
    const page = Math.min(
      pages - 1,
      Math.round(((i + 1) / (SAMPLES + 1)) * pages),
    );
    const { channels } = await sharp(file, { page })
      .greyscale()
      .stats();
    const spread = channels[0].stdev;
    if (spread > best.spread) best = { page, spread };
  }
  return best.page;
}

for (const file of readdirSync(source)) {
  const { name, ext } = parse(file);
  if (![".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext.toLowerCase())) {
    continue;
  }

  const from = join(source, file);
  const to = join(target, `${name}.webp`);

  const { pages = 1 } = await sharp(from).metadata();
  const page = pages > 1 ? await busiestFrame(from, pages) : 0;

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
