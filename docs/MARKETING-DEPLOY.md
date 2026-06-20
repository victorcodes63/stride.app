# Stride marketing deploy — getstride.co.ke

Public marketing site lives in **hris-demo** (`src/app/page.tsx`, `(marketing)/`, `/contact`).

## Domain map

| Host | Purpose |
|------|---------|
| `getstride.co.ke` | Marketing site (this deploy) |
| `app.getstride.co.ke` | Client product / dashboard (separate Vercel project or env profile) |

## Vercel checklist (RAV-44)

1. **Link project** — `cd hris-demo && vercel link` (or use existing hris-demo project).
2. **Env vars** — run:
   ```bash
   cd hris-demo
   node scripts/setup-marketing-vercel-env.mjs
   ```
   Or copy `deployments/marketing-getstride.env` into Vercel Production + Preview.
3. **Custom domain** — Vercel → Settings → Domains → add `getstride.co.ke` (and `www.getstride.co.ke` if needed).
4. **DNS** — point apex/`www` CNAME/A records per Vercel instructions.
5. **Redeploy** production after env + domain changes.
6. **OAuth** (if dashboard on same host) — update Microsoft/Google redirect URIs to use `NEXT_PUBLIC_SITE_URL`.

## Local preview

```bash
cd hris-demo
NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run dev
```

Home (`/`) renders the studio-craft v3 homepage. `/v3` redirects to `/`.

## Smoke test (RAV-46)

- `/`, `/platform`, `/industries`, `/pricing`, `/about`, `/contact`
- Footer: `/privacy`, `/terms`, `/careers`
- Book demo form on `/contact`
- Mobile nav (studio-craft drawer)

## Reference

- Content config: `src/lib/marketing-config.ts`
- Env profile: `deployments/marketing-getstride.env`
