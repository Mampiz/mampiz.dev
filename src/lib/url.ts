const base = import.meta.env.BASE_URL.replace(/\/+$/, "");

/** Prefix a public/ asset with the deploy base path. */
export function asset(path: string): string {
  return `${base}/${path.replace(/^\/+/, "")}`;
}

export const siteBase = base;

/**
 * Small WebP preview of a media file, built by `npm run thumbs`. Used wherever
 * an image is shown at thumbnail size, so the first screen does not pull down
 * multi-megabyte recordings.
 */
export function thumb(file: string): string {
  const name = file.replace(/\.[^.]+$/, "");
  return asset(`media/thumbs/${name}.webp`);
}
