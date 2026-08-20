# Deploying CommunityOS web on Vercel

The web app is **Next.js** in a pnpm monorepo (`apps/web`). It is not a static site. Do **not** use Output Directory `public`.

## Fix for: `No Output Directory named "public"`

That error means Vercel is treating the project as a static app. In the Vercel dashboard:

1. Open **Project → Settings → Build and Deployment**
2. **Framework Preset** → **Next.js** (turn **Override** off if it forces “Other”)
3. **Root Directory** → `apps/web` (Edit → select `apps/web`)
4. **Include source files outside of the Root Directory** → **Enabled**
5. **Output Directory** → turn **Override** **OFF** (field must be empty — never `public`)
6. Save → **Deployments** → Redeploy (or push a new commit)

Repo config also sets this in `vercel.json` (root + `apps/web`).

## Expected settings

| Setting | Value |
|--------|--------|
| Framework Preset | Next.js |
| Root Directory | `apps/web` |
| Install Command | default, or `cd ../.. && pnpm install` |
| Build Command | default, or `cd ../.. && pnpm --filter @communityos/web... build` |
| Output Directory | **cleared / override off** |
| Include files outside Root Directory | **On** |

## Environment variables

- `NEXT_PUBLIC_API_URL` — public URL of the Fastify API

## Repo files

- `/vercel.json` — `framework: nextjs`, `rootDirectory: apps/web`
- `/apps/web/vercel.json` — install/build from monorepo root when dashboard Root Directory is already `apps/web`
- `/apps/web/public/` — static assets only (e.g. `robots.txt`); **not** the Vercel build output
