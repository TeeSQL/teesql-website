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

CI runs `.github/workflows/deploy.yml` on every push to `main`:

1. `npm ci` + `npm run build`
2. `cloudflare/wrangler-action@v3` runs `wrangler pages deploy out --project-name teesql-website --branch main`

### Required GitHub repository secrets

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | CF dashboard → My Profile → API Tokens. Permissions: `Account:Cloudflare Pages:Edit` on the teesql account. |
| `CLOUDFLARE_ACCOUNT_ID` | CF dashboard sidebar → Account Home → "Account ID". |

### One-time Cloudflare Pages project setup

The workflow assumes a Pages project named `teesql-website` already
exists on the account. Create it via the dashboard (Workers & Pages
→ Create → Pages → Direct Upload) or one-shot via wrangler:

```bash
wrangler pages project create teesql-website --production-branch main
```

Then point `teesql.com` and `www.teesql.com` at the Pages project as
custom domains.

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
