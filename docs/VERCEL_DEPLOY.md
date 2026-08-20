# Deploying CommunityOS web on Vercel

The web app is **Next.js** in a pnpm monorepo (`apps/web`). It is not a static site. Do **not** use Output Directory `public`.

`rootDirectory` is a **dashboard** setting only — it is not allowed in `vercel.json` (schema rejects it).

## Fix for: `No Output Directory named "public"`

1. Open **Project → Settings → Build and Deployment**
2. **Framework Preset** → **Next.js** (turn **Override** off if it forces “Other”)
3. **Root Directory** → `apps/web` (Edit → select `apps/web`)
4. **Include source files outside of the Root Directory** → **Enabled**
5. **Output Directory** → turn **Override** **OFF** (field must be empty — never `public`)
6. Save → **Deployments** → Redeploy

## Expected settings

| Setting | Value |
|--------|--------|
| Framework Preset | Next.js |
| Root Directory | `apps/web` (dashboard only) |
| Install Command | default, or from `apps/web/vercel.json` |
| Build Command | default, or from `apps/web/vercel.json` |
| Output Directory | **cleared / override off** |
| Include files outside Root Directory | **On** |

## Environment variables

- `NEXT_PUBLIC_API_URL` — public URL of the Fastify API

## Repo files

- `/apps/web/vercel.json` — `framework: nextjs` + monorepo install/build (used when Root Directory is `apps/web`)
- `/apps/web/public/` — static assets only (e.g. `robots.txt`); **not** the Vercel build output
