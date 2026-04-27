# CLAUDE.md — teesql-website

You are an agent helping a developer maintain the **landing page only**
for teesql.com. The customer dashboard, auth, billing, and any
`/api/*` routes live in the monitoring hub at `hub.teesql.com` — NOT
here.

The site is **Astro 6** + **Svelte 5** + **Tailwind v4**, deployed to
Cloudflare Workers Assets via the committed `wrangler.jsonc`. Originally
this repo was a Next.js static export carved out of the old `web/`
monolith; we rewrote in Astro on 2026-04-27 to escape Next/CF runtime
auto-detection (every wrangler / Next release became a possible
regression). Layout, design tokens, and visible copy are 1:1 with the
Next version.

---

## Hard rules

These are non-negotiable when working in this repo:

1. **No server-side runtime.** Do not add SSR routes, API endpoints,
   middleware, or anything that requires a Worker script. The site is
   `output: "static"` — `astro build` writes plain HTML/CSS/JS to
   `./out`, and Cloudflare serves it as a static asset Worker (no
   `main` field in `wrangler.jsonc`).
2. **No auth code.** No login flow, no session reads. The "Sign in" /
   "Dashboard" CTAs are plain `<a href>` links to `https://hub.teesql.com`.
3. **No data layer.** No Prisma, no `pg`, no Stripe, no Resend.
   `package.json` should stay tiny — `astro`, `@astrojs/svelte`,
   `svelte`, `tailwindcss`, `@tailwindcss/vite`, three `@fontsource*`
   packages. Adding a runtime dep needs a clear reason.
4. **Svelte islands ONLY for genuinely interactive components.** State
   that lives in the DOM, complex animations (canvas, typing loops),
   form state, clipboard. Things that are "toggle one class on
   visible" or "expand on click" are `.astro` files with a tiny inline
   `<script>` instead — cheaper than a hydration island per occurrence.
5. **No emojis** in code, comments, or visible copy.
6. **No AI attribution** in commit messages.
7. **No tracking pixels / analytics** added without an operator
   decision in writing — the audience cares about TEEs and we
   shouldn't ship a privacy regression.

---

## What's here

| Path | What it is |
|---|---|
| `src/pages/index.astro` | The landing page. Composes the 9 section components in order. |
| `src/layouts/BaseLayout.astro` | Root layout — `<html>`, metadata, body class, imports `globals.css`. |
| `src/styles/globals.css` | Tailwind v4 + design tokens (colors, fonts, keyframes) + `@fontsource` imports. |
| `src/components/*.astro` | Static + lightly-interactive components (Reveal, FaqItem, etc — vanilla JS via `<script>` tag). |
| `src/components/*.svelte` | The 5 hydration islands: NavBar, HeroOriginal (canvas), Terminal (typing loop), MCPInstall (clipboard), WaitlistForm (submit-locked state). |
| `public/` | Static assets (`dstack-logo.svg`). |
| `astro.config.mjs` | `output: "static"`, `outDir: "./out"` (so `wrangler.jsonc`'s `assets.directory` keeps working unchanged). |
| `wrangler.jsonc` | Workers-Assets-only config. No `main` script, just `assets.directory: "./out"`. |
| `tsconfig.json` | Extends `astro/tsconfigs/strict`. |

---

## Common tasks

### "Tweak a section"

Edit `src/components/<Name>Section.astro`. Run `npm run dev` and
reload at `localhost:4321`. Push when happy — Cloudflare's
Connect-to-Git project rebuilds + redeploys.

### "Add a new section"

1. Create `src/components/<Name>Section.astro` (mirror an existing
   one — `<Reveal>` wrapper, `id`, padding scale).
2. Import + place it in `src/pages/index.astro` between existing
   sections.
3. Re-use design tokens (e.g. `bg-surface-raised`, `text-ink-body`,
   `font-mono`) instead of hardcoding hex.

### "Add interactivity to a section"

Decide first whether it actually needs Svelte:

- **Stays as `.astro`** if it's "toggle a class on visible / on
  click" — write a `<script>` tag inside the `.astro` file with a
  `data-*` selector. Examples: `Reveal.astro`, `FaqItem.astro`,
  `ArchLine.astro`, `Comparison.astro`.
- **Becomes a `.svelte` island** if it has multiple pieces of state
  that change together, holds DOM refs, runs animation loops, or owns
  form lifecycle. Examples: `NavBar.svelte` (open/closed +
  body-scroll-lock + ESC), `Terminal.svelte` (typing loop with
  cancellation), `HeroOriginal.svelte` (canvas + rAF).

Wire Svelte from Astro with `<MyComponent client:load />` (or
`client:visible` for below-the-fold heavy ones like Terminal).

### "The 'Get started' CTA should go to the dashboard"

Change the relevant `<a href>` to `https://hub.teesql.com`. NavBar
and FinalCTA both currently point at `#early-access` — update them
both, plus `EarlyAccessSection.astro` if you're removing the inline
form.

### "Run the build locally"

```bash
npm install
npm run build
npx astro preview      # serves ./out at http://localhost:4321
```

### "Bump dependencies"

`npm outdated`, then `npm install <pkg>@latest` for the candidates.
Astro + Svelte minor bumps are usually clean; check the dev server
boots after each. Tailwind v4 stays on the same major.

---

## The Astro/Svelte split — why each interactive piece lives where it does

| Component | File | Reason |
|---|---|---|
| `Reveal` | `.astro` | One IntersectionObserver, one class toggle. Vanilla JS handles every `[data-reveal]` element with one global script. |
| `ArchLine` | `.astro` | Same shape as Reveal — fill the line on first visibility. |
| `Comparison` | `.astro` | Two reveal targets (glow + "NONE" word) inside one container, gated on one IntersectionObserver. |
| `FaqItem` | `.astro` | Per-row click toggle; expensive to spin up 8 Svelte islands when a single `addEventListener` loop suffices. |
| `NavBar` | `.svelte` | Open/closed state + ESC handler + body overflow lock + hashchange listener — multiple effects coordinating. |
| `WaitlistForm` | `.svelte` | Form's `submitted` state controls input/button styling and the button's text. |
| `Terminal` | `.svelte` | Async loop with cancel-on-unmount, dynamic line list, scroll-to-bottom. Hydrates with `client:visible` since the hero is above it. |
| `HeroOriginal` | `.svelte` | Canvas + `requestAnimationFrame` loop. |
| `MCPInstall` | `.svelte` | Clipboard write + transient `copied` state. |

If you find yourself adding a 6th Svelte island for a one-class
toggle, stop and think — vanilla JS in `.astro` is the right answer
~80% of the time on this site.

---

## Conventions

- **Tailwind v4** — `@theme` block in `globals.css` defines tokens;
  use `bg-surface-raised`, `text-ink-body`, `font-mono`, etc. The
  `--font-outfit` / `--font-instrument-serif` / `--font-ibm-plex-mono`
  CSS variables resolve to the `@fontsource` family names.
- **Imports** — relative (`./Reveal.astro`, `./HeroOriginal.svelte`).
  No path aliases; the file tree is flat.
- **Type hints** — Astro components use TypeScript in the frontmatter;
  Svelte components use `<script lang="ts">`.
- **HTML** — write entities as the literal Unicode character
  (`—` not `&mdash;`) where Astro accepts it. `&apos;` and `&copy;`
  are kept where they read better.
- **Commit messages** — short imperative subject, body explains *why*
  if not obvious. No AI attribution.
