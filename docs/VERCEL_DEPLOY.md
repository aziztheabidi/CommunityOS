# Deploy CommunityOS web on Vercel

The dashboard is stuck expecting **Output Directory = `public`**. The app now static-exports and stages files into `public/` so that setting works.

## What the build does

1. `pnpm --filter @communityos/web... build` → Next `output: "export"` → `apps/web/out`
2. `node scripts/stage-web-public.mjs` → copies export into `public/`
3. Vercel deploys `public/`

## Dashboard (either Root Directory is fine)

| Setting | Value |
|--------|--------|
| Framework Preset | **Other** (or leave default) |
| Root Directory | empty **or** `apps/web` |
| Output Directory | **`public`** (matches the stuck setting) |
| Install / Build | from `vercel.json` |

Redeploy **without** build cache.

## Env

- `NEXT_PUBLIC_API_URL` — Fastify API URL (browser calls this at runtime)
