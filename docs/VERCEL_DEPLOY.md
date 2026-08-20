# Deploying CommunityOS web on Vercel

The web app is **Next.js** in a pnpm monorepo (`apps/web`). It is not a static site. Do **not** use Output Directory `public`.

`rootDirectory` is a **dashboard** setting only — it is not allowed in `vercel.json` (schema rejects it).

## Fix for: `No Output Directory named "public"`

`apps/web/vercel.json` sets `"outputDirectory": null` so Vercel auto-detects Next.js output and **overrides** a dashboard value of `public`.

Still set in the dashboard:

1. **Framework Preset** → **Next.js**
2. **Root Directory** → `apps/web`
3. **Include source files outside of the Root Directory** → **On**
4. **Output Directory** → Override **Off** (optional once `null` is in vercel.json)

Then redeploy.

## Environment variables

- `NEXT_PUBLIC_API_URL` — public URL of the Fastify API

## Repo files

- `/apps/web/vercel.json` — `framework: nextjs` + monorepo install/build (used when Root Directory is `apps/web`)
- `/apps/web/public/` — static assets only (e.g. `robots.txt`); **not** the Vercel build output
