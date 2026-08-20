# Deploying CommunityOS (Vercel)

The web app is a **Next.js** app in a pnpm monorepo (`apps/web`). Vercel must not use a static `public` output directory.

## Required Vercel project settings

In **Project → Settings → General / Build & Development**:

| Setting | Value |
|--------|--------|
| **Framework Preset** | Next.js |
| **Root Directory** | `apps/web` |
| **Build Command** | leave default (uses `apps/web/vercel.json`) or `cd ../.. && pnpm --filter @communityos/web... build` |
| **Install Command** | leave default or `cd ../.. && pnpm install` |
| **Output Directory** | **empty / cleared** (do not set `public`) |
| **Include source files outside Root Directory** | **Enabled** (needed for workspace packages) |

If Output Directory is still `public`, clear it and redeploy. That setting is what triggers:

`No Output Directory named "public" found after the Build completed`

## Environment variables (web)

Set at least:

- `NEXT_PUBLIC_API_URL` — public URL of the Fastify API (separate host if API is not on Vercel)

Optional society/auth keys as needed for browser Supabase client.

## Repo config

- Root `vercel.json` — Next.js framework + monorepo build filter
- `apps/web/vercel.json` — install/build from monorepo root when Root Directory is `apps/web`
- `apps/web/public/` — static assets (robots.txt); not the Vercel output directory
