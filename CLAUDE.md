# CLAUDE.md — teesql-website

You are an agent helping a developer maintain the **landing page only**
for teesql.com. The customer dashboard, auth, billing, and any
`/api/*` routes live in the monitoring hub — NOT here.

This repo was extracted from the monolithic `web/` directory in
`dstackgres` after the dashboard / auth / Stripe pieces moved out.
The split exists so this site can be a static export served from
Cloudflare Pages, with zero server-side runtime to manage.

---

## Hard rules

These are non-negotiable when working in this repo:

1. **No server-side runtime.** Do not add `/api/*` routes, server
   actions, `next/headers`, cookies, dynamic params, or anything that
   would break `next build` under `output: "export"`. If you find
   yourself reaching for one of those, the feature belongs in the
   hub, not here.
2. **No auth code.** No `next-auth`, no `signIn`, no session reads.
   The "Sign in" / "Dashboard" CTAs are plain `<a href>` links to
   the hub's URL.
3. **No data layer.** No Prisma, no `pg`, no Stripe, no Resend.
   `package.json` should stay tiny — `next`, `react`, `react-dom`,
   tailwind. Adding a runtime dep needs a clear reason.
4. **No emojis** in code, comments, or visible copy.
5. **No AI attribution** in commit messages.
6. **No tracking pixels / analytics scripts** added without an
   operator decision in writing — the audience cares about TEEs and
   we shouldn't ship a privacy regression.

---

## What's here

| Path | What it is |
|---|---|
| `src/app/page.tsx` | The landing page. Composes section components. |
| `src/app/layout.tsx` | Root layout — fonts, `<html>`, metadata. |
| `src/app/globals.css` | Tailwind v4 + design tokens (colors, fonts, keyframes). |
| `src/app/components/*.tsx` | All section + atom components. Flat — no further nesting. |
| `public/` | Static assets (logo, etc). |
| `next.config.ts` | `output: "export"` — produces `out/` directory. |
| `.github/workflows/deploy.yml` | CI: build + `wrangler pages deploy`. |

---

## Common tasks

### "Tweak a section"

Edit the relevant `src/app/components/<section>.tsx`. Run
`npm run dev` and reload. Push when happy — CI deploys to CF Pages.

### "Add a new section"

1. Create `src/app/components/<name>-section.tsx` (mirror the shape of
   existing sections — `Reveal` wrapper, `id`, padding scale).
2. Import + place it in `src/app/page.tsx` between existing sections.
3. Re-use design tokens from `globals.css` (e.g. `bg-surface-raised`,
   `text-ink-body`, `font-mono`) instead of hardcoding hex values.

### "The 'Get started' CTA should go to the dashboard"

Change the relevant `<a href>` to `https://hub.teesql.com` (or whatever
the operator confirms is the dashboard URL). Do NOT import auth flow
helpers — the hub owns its own login.

### "Run the build locally"

```bash
npm install
npm run build
npx serve out      # or any static server
```

### "Bump dependencies"

`npm outdated` then `npm install <pkg>@latest` for the candidates.
Re-run the build. Push.

---

## Conventions

- **Tailwind v4** — `@theme` block in `globals.css` defines tokens;
  use `bg-surface-raised`, `text-ink-body`, `font-mono`, etc.
- **Client components.** Every component file in `src/app/components/`
  is `"use client"` because the page itself is interactive (smooth
  scroll, refs, form submit). Keep it that way unless something is
  truly static.
- **Imports** — relative (`./reveal`, `./pulse-eyebrow`). The
  `@/*` alias maps to `src/` if needed but most components don't
  cross app boundaries.
- **Type hints** — `from __future__ import annotations` doesn't
  apply here; just use modern TS.
- **Commit messages** — short imperative subject, body explains the
  *why* if not obvious. No AI attribution.
