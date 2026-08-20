# Deploy CommunityOS web on Vercel

## New project (required)

When importing the GitHub repo, set:

| Setting | Value |
|--------|--------|
| **Framework Preset** | **Next.js** |
| **Root Directory** | **`apps/web`** (not `apps/api`, not empty if the UI offers a picker) |
| **Include files outside the root directory** | **On** |
| **Output Directory** | leave **empty** |
| Build / Install overrides | **Off** (uses `apps/web/vercel.json`) |

If Root Directory is `apps/api`, the deploy will fail on purpose — that folder is the Fastify API, not the website.

## Env

| Variable | Notes |
|----------|--------|
| `COMMUNITYOS_DEMO_DATA` | `1` |
| Do **not** set `NEXT_PUBLIC_API_URL` | App uses same-origin `/v1` |

Optional: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` for live data.

## After settings change

Redeploy **without** build cache.
