# Deploying CommunityOS web on Vercel

The web app is **Next.js** at `apps/web` in a pnpm monorepo.

## Recommended (dashboard)

**Project → Settings → Build and Deployment:**

| Setting | Value |
|--------|--------|
| Framework Preset | **Next.js** |
| Root Directory | **`apps/web`** |
| Include files outside Root Directory | **On** |
| Output Directory | Override **Off** (never `public`) |
| Install / Build | leave default, or use `apps/web/vercel.json` |

Then remove any yellow **Production Overrides** still forcing Output Directory = `public`.

## If Root Directory stays at the repo root

Root `vercel.json` uses the Next.js builder on `apps/web/package.json` so Vercel does not look for a static `public` output folder:

```json
{
  "installCommand": "pnpm install",
  "builds": [{ "src": "apps/web/package.json", "use": "@vercel/next" }]
}
```

Prefer switching Root Directory to `apps/web` when you can; `builds` is the legacy monorepo path.

## Environment

- `NEXT_PUBLIC_API_URL` — public URL of the Fastify API
