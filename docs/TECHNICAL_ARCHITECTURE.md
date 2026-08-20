# Technical Architecture

## 1. Style

**Modular monolith** in a **pnpm + Turborepo** monorepo.

```
Client (Next.js) ──HTTPS──► API (Fastify)
                              │
                              ├── PostgreSQL + PostGIS
                              ├── Redis (cache / rate limit / BullMQ)
                              ├── Supabase Auth (JWT validation)
                              ├── Supabase Storage (media)
                              └── Supabase Realtime (channels)
Worker (BullMQ) ◄── Redis queue
```

Next.js may host public marketing pages and authenticated app UI. Domain mutations and sensitive reads go through Fastify (or Next Route Handlers that call the same domain services)—**not** direct privileged Supabase client usage from the browser for admin data.

## 2. Stack (default)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Web | Next.js App Router, React, TS, Tailwind, shadcn/ui | Modern DX, SSR/streaming, solid a11y baseline |
| API | Fastify + Zod | Performance, schema validation, clean plugins |
| DB | PostgreSQL + PostGIS via Supabase | Managed Postgres + spatial |
| ORM | Prisma **or** Drizzle (decision in Milestone 0) | Prefer strong typing; PostGIS via raw/extensions as needed |
| Auth | Supabase Auth | Fast path; custom claims/membership in our DB |
| Cache | Upstash Redis | Serverless-friendly |
| Jobs | BullMQ | Imports, aggregations, notifications |
| Maps | MapLibre GL + OSM tiles | Provider-independent geometry |
| Search | Postgres FTS + pg_trgm | Adequate to ~100k with good indexes |
| Observability | Sentry + structured logs | Errors + performance |
| Product analytics | PostHog + first-party events | Funnel + internal intelligence |
| Hosting | Vercel (web), Render/Railway (API/worker) | Simple split |

## 3. Apps

### `apps/web`

- Application shell, directories, map, feed, admin UI  
- Server Components for non-sensitive shells; client for map/chat  
- Never embed service role keys  

### `apps/api`

- Versioned REST (OpenAPI generated from Zod)  
- Plugins: auth, tenancy, rate-limit, audit  
- Cursor pagination conventions  

### `apps/worker`

- CSV/XLSX import pipelines  
- Analytics snapshots  
- Notification delivery  
- Search reindex jobs  
- Image processing hooks  

## 4. Packages

- `database` — schema, migrations, client factory  
- `auth` — JWT verify, session context  
- `permissions` — catalog + `authorize(actor, perm, resource)`  
- `validation` — shared Zod  
- `types` — DTO / domain types  
- `ui` — design system  
- `maps` — layers, GeoJSON helpers, privacy precision utils  
- `search` — `SearchProvider` interface  
- `config` — env parsing (Zod)  

## 5. Request pipeline (API)

1. TLS termination  
2. Rate limit  
3. Authenticate JWT → `PlatformUser`  
4. Resolve `societyId` (header/subdomain/path) + membership  
5. Authorize permission + resource tenancy  
6. Validate body/query (Zod)  
7. Domain service  
8. Project response through **visibility serializer**  
9. Audit if sensitive  

## 6. Caching strategy

| Data | Cache | TTL / invalidation |
|------|-------|--------------------|
| Taxonomy lists | Redis | On admin update |
| Dashboard snapshots | Redis + DB snapshot table | Scheduled job |
| Map aggregates | Redis keyed by filter hash | On profession/geo change jobs |
| Permissions | In-request memo + short Redis | On role change |

## 7. Search abstraction

```ts
interface CommunitySearch {
  index(doc: SearchDocument): Promise<void>;
  remove(id: string): Promise<void>;
  query(q: SearchQuery, viewer: ViewerContext): Promise<SearchResult>;
}
```

Initial impl: SQL FTS. Later: Typesense/Meilisearch/embeddings without rewriting product code. **ViewerContext always applied.**

## 8. Realtime

- Messaging, typing, presence, notification badges via Supabase Realtime channels scoped by conversation/society  
- Authorization on channel join enforced server-side  

## 9. Multi-tenancy enforcement

- Every query filters `society_id`  
- Prefer Supabase RLS for defense in depth on tables exposed to Supabase clients  
- API uses service role carefully; still applies app-level tenancy checks  

## 10. Performance guardrails

- Cursor pagination everywhere lists can grow  
- Bounding-box + simplify for map vector tiles/GeoJSON  
- Marker clustering client-side; server aggregates for heatmaps  
- No N+1: dataloader or joined selects  
- Pre-aggregated analytics; avoid live `COUNT(*)` storms on dashboards  
- Image CDN + Next Image optimization  

## 11. Environments

`local` · `staging` · `production`  
Secrets via host secret stores; `.env.example` documents keys without values.

## 12. CI/CD (Milestone 0)

- Lint, typecheck, unit/integration tests on PR  
- Migrate deploy on release pipelines  
- Block merge on failing authz/privacy tests  

## 13. Future split candidates

Messaging, search, and analytics workers are the first modules that could become separate services if load demands—interfaces should already be package-local.
