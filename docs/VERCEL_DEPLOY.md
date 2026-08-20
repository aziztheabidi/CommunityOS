# Deploy CommunityOS web on Vercel

## Required dashboard settings (this fixes 404 NOT_FOUND)

The platform `404: NOT_FOUND` page means Vercel deployed without a Next.js routing manifest — usually wrong Root Directory, Framework “Other”, or Output Directory forced to `public` (only `robots.txt` is there, so `/` 404s).

In **Project → Settings → Build and Deployment**:

1. **Framework Preset** → **Next.js** (turn Override **off** if it says Other)
2. **Root Directory** → click Edit → select **`apps/web`** → Save  
   - Enable **Include source files outside of the Root Directory**
3. **Output Directory** → Override **OFF** (must not be `public`)
4. Clear any yellow **Production Overrides**
5. **Deployments** → Redeploy → uncheck **Use existing Build Cache**

Do **not** set Root Directory to the repo root. Do **not** use a root `vercel.json` with legacy `builds`.

## Repo config

`apps/web/vercel.json` (used when Root Directory is `apps/web`):

- `framework: nextjs`
- `outputDirectory: null` (clears a stuck `public` override)
- monorepo `installCommand` / `buildCommand`

## Env

- `NEXT_PUBLIC_API_URL` — Fastify API public URL
