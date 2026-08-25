# mampiz.dev

My portfolio: a single static page that opens straight onto the work — real
recordings and screenshots from the projects, not stock illustrations — followed
by a case study for each one.

Built with [Astro](https://astro.build) and Tailwind CSS v4, no client framework.
The whole page ships as one HTML file with a few kilobytes of inline JavaScript
for the scroll reveals, the gallery and the theme toggle.

## Running it

```bash
npm install
npm run dev      # http://localhost:4321/mampiz.dev
npm run build    # static output in dist/
npm run preview  # serve dist/ exactly as it will be deployed
```

Node 22 or newer.

## Editing the content

Everything a visitor reads lives in [`src/data/site.ts`](src/data/site.ts):
personal details, the project case studies with their metrics and stack, the
toolbox and the archive list. Adding a project is one object in the `projects`
array — the page renders the section, the metric strip and the entry in the hero
rail from it.

Screenshots and recordings go in `public/media/` and are referenced by filename
from a project's `media` array. A project with no media renders an inline SVG
diagram instead ([`src/components/Diagram.astro`](src/components/Diagram.astro)).
Large recordings can carry a `poster` so the GIF only downloads when a visitor
asks to play it.

## Layout

```
src/
  data/site.ts          all copy and project data
  layouts/Layout.astro  document head, theme bootstrap, page scripts
  components/           header, hero, project section, gallery, diagrams
  styles/global.css     design tokens, light/dark themes, component classes
scripts/
  make-thumbs.mjs       WebP previews for the hero rail and gallery strips
  make-og.mjs           regenerates the social preview card (public/og.png)
  shots.mjs, hero.mjs   headless screenshots, used while designing the page
  weigh.mjs             reports what the first screen actually downloads
```

After adding or replacing anything in `public/media/`, run `npm run thumbs`.
Nothing on the first screen loads a full-size recording: the hero rail and the
gallery strips use those previews, and a multi-megabyte GIF is only fetched when
a visitor presses play.

## Deployment

Pushing to `main` builds and publishes to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Enable it once
under **Settings → Pages → Source → GitHub Actions**.

The base path is injected at build time, so moving to a custom domain means
setting `PUBLIC_SITE` and `PUBLIC_BASE` (to `/`) and adding a `CNAME` file —
nothing in the source changes.

## Licence

Code under the [MIT licence](LICENSE). The written content, screenshots and
photographs are mine and not covered by it.
