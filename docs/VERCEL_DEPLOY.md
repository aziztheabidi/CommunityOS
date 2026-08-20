# Deploy CommunityOS web on Vercel

The live site must run as **Next.js** (not a static `public/` export). Pages call same-origin `/v1/*` Route Handlers (BFF).

## Recommended project settings

**Project → Settings → Build & Development Settings:**

| Setting | Value |
|--------|--------|
| **Framework Preset** | **Next.js** |
| **Root Directory** | leave **empty** (monorepo root) **or** `apps/web` |
| **Output Directory** | **clear / empty** (never `public`) |
| **Include files outside the Root Directory** | **On** when Root is `apps/web` |

### Why `/vercel/path0/.next` was missing

The Next app builds to `apps/web/.next`. If Vercel’s Root Directory is the **repo root**, it looks for `.next` at `/vercel/path0/.next`. Root `vercel.json` runs `scripts/stage-next-output.mjs` to copy `apps/web/.next` → `.next` after the build.

If Root Directory is **`apps/web`**, use `apps/web/vercel.json` (no staging) and clear Output Directory so Vercel uses the local `.next`.

Redeploy **without** build cache after changing settings.

## Env

| Variable | Notes |
|----------|--------|
| **Delete** `NEXT_PUBLIC_API_URL` | Must not be `http://localhost:4000` |
| `COMMUNITYOS_DEMO_DATA` | `1` until Supabase is seeded |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Optional live data |

## Local

Web uses same-origin `/v1` BFF — no separate API URL required.
