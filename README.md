# teesql-website

Marketing/landing site for [teesql.com](https://teesql.com). Static
export, deployed to Cloudflare Workers Assets on every push to `main`.

The customer dashboard, auth, billing, and `/api/*` previously lived
alongside this in a monolithic Next.js app — those have moved to the
monitoring hub. This repo is **landing page only** and intentionally
stays free of any server-side runtime.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build

```bash
npm run build    # writes static site to ./out
```

`next.config.ts` sets `output: "export"`, so `next build` produces a
fully static site under `out/`. Any static host can serve it; we
deploy via Cloudflare's Workers Builds + Workers Assets.

## Deploy

Cloudflare's "Connect to Git" project watches `main` and runs the
build itself on every push. There are no GitHub Actions secrets; the
deploy is wired through `wrangler.jsonc` in this repo.

One-time CF project setup (already done — listed here for context):

1. CF dashboard → top-bar search for **"Workers"** → Create →
   Connect to Git → pick `TeeSQL/teesql-website`.
2. Build settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy` (default)
   - Output dir is read from `wrangler.jsonc` (`./out`); leave the
     project's "Output directory" field blank.
3. Add `teesql.com` and `www.teesql.com` under "Custom domains" once
   the first deploy lands.

`wrangler.jsonc` declares the Worker as assets-only (no `main`
script — CF serves the contents of `out/` directly with
`not_found_handling: 404-page`). This keeps wrangler from running its
Next.js auto-detection, which otherwise tries to convert this into an
SSR Worker via OpenNext and crashes against `output: "export"`.

To deploy from a laptop:

```bash
npm run build
npx wrangler deploy           # uses wrangler.jsonc
```

## Hard rules

- **No server-side runtime.** No `/api/*` routes, no server actions,
  no `next/headers`/cookies. The whole app must build cleanly under
  `output: "export"`.
- **No auth, no Stripe, no Prisma here.** Those live in the
  monitoring hub. If you need to link to the dashboard, it's a plain
  `<a href="https://hub.teesql.com">` — never `import { signIn }` or
  similar.
- **No emojis** in code, comments, or copy. (Existing convention.)
- **No AI attribution** in commit messages.
