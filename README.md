# teesql-website

Marketing/landing site for [teesql.com](https://teesql.com). Static
export, deployed to Cloudflare Pages on every push to `main`.

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
deploy to Cloudflare Pages.

## Deploy

There are two supported paths. The repo currently ships with both
options ready; pick one and disable the other.

### Path A — Cloudflare Pages "Connect to Git" (no Actions, no secrets)

The simplest setup. Cloudflare watches the GitHub repo directly and
runs the build itself on every push.

1. In the Cloudflare dashboard, search for **"Pages"** in the top-bar
   search (the sidebar labels rearrange — "Compute (Workers)" / "Pages"
   are separate sections in the current layout, but the search lands
   you on the right place every time).
2. Create a Pages project → "Connect to Git" → pick `TeeSQL/teesql-website`.
3. Build settings:
   - **Framework preset**: Next.js (Static HTML Export) — *not* the
     default Next.js preset, which expects a server runtime.
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: (leave blank)
4. Add `teesql.com` and `www.teesql.com` under the project's
   "Custom domains" tab — Cloudflare auto-creates the CNAMEs in the
   teesql.com zone.

If you go this route, delete `.github/workflows/deploy.yml` so two
deploy paths don't race each other.

### Path B — GitHub Actions + `wrangler pages deploy`

What the included `.github/workflows/deploy.yml` does today:

1. `npm ci` + `npm run build`
2. `cloudflare/wrangler-action@v3` runs `wrangler pages deploy out --project-name teesql-website --branch main`

Required GitHub repository secrets:

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Dashboard → top-right profile menu → "API Tokens" → Create Token → Custom token. Permissions: `Account → Cloudflare Pages → Edit`. |
| `CLOUDFLARE_ACCOUNT_ID` | Dashboard → top-right profile menu → "Account ID" (or visible in any Pages/Workers URL: `dash.cloudflare.com/<account-id>/...`). |

The Pages project must exist before the first run. Easiest one-shot:

```bash
CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=<id> \
  npx wrangler pages project create teesql-website --production-branch main
```

Then attach `teesql.com` / `www.teesql.com` as custom domains in the
Pages project settings (same UI as Path A step 4).

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
