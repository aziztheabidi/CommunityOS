# CommunityOS

**Society Intelligence, Management & Community Network Platform**

CommunityOS is a privacy-aware platform for residential societies and gated communities. It combines society operations, household intelligence, professional networking, local business discovery, community social features, GIS, events, opportunities, and community analytics into one **Community Graph**—not a standalone HOA dashboard, CRM, member directory, or chat app.

## Status

Product surface for **Jaffar-e-Tayyar Society** is available: geography & map, residents & professionals, businesses, network, feed, events, opportunities, analytics, and an administrator console.

See [Supabase setup](./docs/SUPABASE_SETUP.md) to connect live data.

### Quick start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

- Web: http://localhost:3000  
- Map: http://localhost:3000/map  
- Admin: http://localhost:3000/admin  
- API health: http://localhost:4000/health  
- Map GeoJSON: http://localhost:4000/v1/societies/jaffar-e-tayyar/map/geojson  

When Supabase SQL is applied (or Prisma URLs are set):

```bash
# Option A: run packages/database/prisma/manual/*.sql in SQL Editor (see docs/SUPABASE_SETUP.md)
# Option B: set DATABASE_URL + DIRECT_URL then:
pnpm db:migrate
pnpm db:seed
```

## Documentation

| Document | Purpose |
|----------|---------|
| [AGENTS.md](./AGENTS.md) | Mandatory agent/engineer operating rules |
| [Product Vision](./docs/PRODUCT_VISION.md) | Long-term product intent |
| [Supabase setup](./docs/SUPABASE_SETUP.md) | SQL Editor + env configuration |
| [Vercel deploy](./docs/VERCEL_DEPLOY.md) | Fix Next.js monorepo deploy (not `public` output) |
| [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md) | Delivery tasks |
| [Roadmap](./docs/ROADMAP.md) | Milestone overview |
