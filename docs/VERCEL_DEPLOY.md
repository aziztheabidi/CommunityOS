# Deploy CommunityOS web on Vercel

Production: https://jtcommunity.vercel.app

## Project settings (managed via CLI / dashboard)

| Setting | Value |
|--------|--------|
| **Framework Preset** | **Next.js** |
| **Root Directory** | **`apps/web`** |
| **Include files outside the root directory** | **On** |
| **Output Directory** | empty |
| Build / Install | from `apps/web/vercel.json` |

## Env

| Variable | Notes |
|----------|--------|
| `COMMUNITYOS_DEMO_DATA` | `1` |
| Do **not** set `NEXT_PUBLIC_API_URL` | App uses same-origin `/v1` |
| `SUPABASE_*` | Optional live data |

## CLI

```bash
vercel link --project jtcommunity --yes
vercel deploy --prod --yes
```
