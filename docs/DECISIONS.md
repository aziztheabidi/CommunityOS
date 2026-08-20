# Architecture Decisions

Format: short ADRs. Append; do not rewrite history—supersede with a new ADR.

---

## ADR-001: Greenfield modular monolith

- **Status:** Accepted  
- **Context:** Empty repository; large multi-domain product.  
- **Decision:** pnpm monorepo modular monolith (`web` / `api` / `worker` + packages).  
- **Consequences:** Faster delivery; clear module boundaries for future extract.

## ADR-002: PostgreSQL + PostGIS as system of record

- **Status:** Accepted  
- **Context:** Geography is first-class; heatmaps and containment queries required.  
- **Decision:** PostGIS for all core geometries; GeoJSON interchange; MapLibre for render.  
- **Consequences:** Strong spatial capability; need PostGIS-capable hosting (Supabase).

## ADR-003: Permission-based authorization + field privacy

- **Status:** Accepted  
- **Context:** Sensitive household and minor data; multi-role societies.  
- **Decision:** Granular permissions; field visibility enum; dependents isolated.  
- **Consequences:** More upfront modeling; safer directories/maps.

## ADR-004: Supabase for Auth / Realtime / Storage initially

- **Status:** Accepted  
- **Context:** Speed to MVP without building auth/realtime from scratch.  
- **Decision:** Supabase Auth + Realtime + Storage; application DB schema still owned in-repo migrations.  
- **Consequences:** Vendor coupling on auth/realtime; abstract messaging ports where practical.

## ADR-005: Search provider abstraction; FTS first

- **Status:** Accepted  
- **Context:** NL/AI search desired long-term but not MVP-critical.  
- **Decision:** `CommunitySearch` interface; Postgres FTS + trigram initially.  
- **Consequences:** Avoid premature ops cost; migration path preserved.

## ADR-006: Heatmap minimum bucket threshold

- **Status:** Accepted  
- **Context:** Re-identification risk from sparse profession×geo cells.  
- **Decision:** Default suppress aggregates with count &lt; 5 for non-admin tiers; configurable per society.  
- **Consequences:** Some sparsity in small societies; admins with sensitive analytics perm may see fuller data audited.

## ADR-007: Prisma as primary ORM; PostGIS via SQL

- **Status:** Accepted  
- **Context:** Need typed client quickly; PostGIS geometry types are still awkward in most ORMs.  
- **Decision:** Use **Prisma** for relational models and migrations. Enable PostGIS in SQL migrations; use parameterized `$queryRaw` for spatial queries in Milestone 1+.  
- **Consequences:** Excellent DX for core CRUD; spatial helpers live in `packages/database` / geography module rather than Prisma model fields initially.

## ADR-008: Society ID in URL path

- **Status:** Accepted  
- **Context:** Need explicit tenancy in API.  
- **Decision:** `/v1/societies/:societyId/...`  
- **Consequences:** Clear audits/logs; slightly longer paths.
