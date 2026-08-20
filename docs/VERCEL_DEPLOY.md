# Deploy CommunityOS web on Vercel

The live site must run as **Next.js** (not a static `public/` export). Pages call same-origin `/v1/*` Route Handlers (BFF) backed by `@communityos/database` / demo / Supabase.

## Project settings (required)

**Project → Settings → Build & Development Settings:**

| Setting | Value |
|--------|--------|
| **Framework Preset** | **Next.js** |
| **Root Directory** | **`apps/web`** |
| **Output Directory** | **Empty** — clear `public` if it is set |
| **Include files outside the Root Directory** | **On** |

`vercel.json` sets Framework to Next.js and must **not** set `outputDirectory`. If Output Directory stays `public`, Vercel will treat the app as static HTML and `/v1` APIs will not run → browser **Failed to fetch**.

Redeploy **without** build cache after changing these settings.

## Env (Vercel → Project → Environment Variables)

| Variable | Notes |
|----------|--------|
| Leave **`NEXT_PUBLIC_API_URL` unset** | Browser uses same-origin `/v1` BFF |
| `COMMUNITYOS_DEMO_DATA` | `1` until Supabase is seeded (`0` only when DB is ready) |
| `SUPABASE_URL` | Optional; enables live society data |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; never expose to the browser |
| `SUPABASE_ANON_KEY` / `NEXT_PUBLIC_*` | Only if the client needs Auth |

Do **not** set `NEXT_PUBLIC_API_URL` to `http://localhost:4000` on Vercel — that is what caused Failed to fetch in production.

## Local

- Prefer empty `NEXT_PUBLIC_API_URL` so the web app uses the Next BFF.
- Or run Fastify (`apps/api`) and set `NEXT_PUBLIC_API_URL=http://localhost:4000`.
