# CommunityOS

**Society Intelligence, Management & Community Network Platform**

CommunityOS is a privacy-aware platform for residential societies and gated communities. It combines society operations, household intelligence, professional networking, local business discovery, community social features, GIS, events, opportunities, and community analytics into one **Community Graph**—not a standalone HOA dashboard, CRM, member directory, or chat app.

## Status

**Milestone 1 (Society Geography & Properties)** — in progress / demo-ready.

Interactive Society Map, property register, geography hierarchy, and Jaffar-e-Tayyar demo data work without Database URLs. See [Supabase setup](./docs/SUPABASE_SETUP.md).

### Quick start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

- Web: http://localhost:3000  
- Map: http://localhost:3000/map  
- API health: http://localhost:4000/health  
- Demo GeoJSON: http://localhost:4000/v1/societies/jaffar-e-tayyar/map/geojson  

When Supabase SQL is applied (or Prisma URLs are set):

```bash
# Option A: run packages/database/prisma/manual/supabase-sql-editor-bootstrap.sql in SQL Editor
# Option B: set DATABASE_URL + DIRECT_URL then:
pnpm db:migrate
pnpm db:seed
```


## Documentation

| Document | Purpose |
|----------|---------|
| [AGENTS.md](./AGENTS.md) | Mandatory agent/engineer operating rules |
| [Product Vision](./docs/PRODUCT_VISION.md) | Long-term product intent |
| [Product Architecture](./docs/PRODUCT_ARCHITECTURE.md) | Domains & module boundaries |
| [Technical Architecture](./docs/TECHNICAL_ARCHITECTURE.md) | Stack, apps, deployment |
| [Database Design](./docs/DATABASE_DESIGN.md) | ER model & conventions |
| [GIS Architecture](./docs/GIS_ARCHITECTURE.md) | PostGIS, maps, layers, privacy |
| [Privacy Model](./docs/PRIVACY_MODEL.md) | Classification, consent, minors |
| [Authorization](./docs/AUTHORIZATION.md) | Roles & permissions |
| [API](./docs/API.md) | API conventions |
| [Security](./docs/SECURITY.md) | Threat model & controls |
| [Analytics](./docs/ANALYTICS.md) | Intelligence & aggregation |
| [UI System](./docs/UI_SYSTEM.md) | Design system & IA |
| [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md) | Milestone tasks |
| [Roadmap](./docs/ROADMAP.md) | Milestone overview |
| [Decisions](./docs/DECISIONS.md) | ADRs |
| [Competitive Patterns](./docs/COMPETITIVE_PATTERNS.md) | Pattern research |
| [Repository Audit](./docs/REPOSITORY_AUDIT.md) | Initial audit |
| [Technical Risks](./docs/TECHNICAL_RISKS.md) | Risks & mitigations |

## Intended stack

Next.js · Fastify · PostgreSQL + PostGIS · Supabase Auth/Realtime/Storage · Redis · BullMQ · MapLibre · Zod · TypeScript monorepo

## License

Private / TBD by repository owner.
