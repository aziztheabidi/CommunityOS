# AGENTS.md — CommunityOS

**Read this file before any significant implementation.**

CommunityOS is a Society Intelligence, Management & Community Network Platform. It is not an HOA CRUD app, CRM, social feed, or property-management clone. The product goal is a permissioned **Community Graph** that connects people, places, professions, businesses, skills, events, and opportunities so societies can improve connection, opportunity, and prosperity—without turning sensitive household data into an unrestricted public directory.

---

## Architecture

- **Shape:** Modular monolith monorepo (`apps/` + `packages/` + domain modules).
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui.
- **API:** Node.js + Fastify + TypeScript (thin BFF routes in Next.js only when justified).
- **Data:** PostgreSQL + PostGIS (Supabase initially), Redis/Upstash cache, BullMQ workers.
- **Auth:** Supabase Auth; **all authorization is server-enforced** with granular permissions (not role-name checks alone).
- **Maps:** MapLibre GL + OSM; geometry stored independently (GeoJSON import/export). Never lock core spatial data to a commercial provider.
- **Search:** PostgreSQL FTS + `pg_trgm` first; Typesense/Meilisearch later behind a search abstraction.
- **Realtime:** Supabase Realtime initially for messaging/presence/notifications.
- **Multi-tenancy:** Platform → Societies; every tenant-owned row is society-scoped and enforced in API + DB (RLS where applicable).

Do **not** introduce microservices prematurely. Keep module boundaries clean so high-load domains can split later.

---

## Repository structure

```
apps/
  web/          # Next.js App Router UI
  api/          # Fastify HTTP API
  worker/       # BullMQ background jobs
packages/
  database/     # Prisma/Drizzle schema, migrations, client
  auth/         # Session helpers, claims
  ui/           # Design system / shared components
  maps/         # MapLibre wrappers, layer types, GeoJSON utils
  permissions/  # Permission constants + policy helpers
  search/       # Search abstraction (FTS now, vector later)
  types/        # Shared domain types
  validation/   # Zod schemas
  config/       # Env + shared config
modules/        # Domain logic boundaries (importable by apps)
  societies/ geography/ properties/ households/ residents/
  professions/ employment/ businesses/ skills/ connections/
  feed/ events/ opportunities/ groups/ messaging/
  notifications/ search/ discovery/ moderation/ analytics/
docs/           # Product & engineering documentation
```

---

## Coding standards

- Strict TypeScript; avoid `any`. Do not disable lint/type errors to “make it pass.”
- No hardcoded society IDs, user IDs, roles, or profession taxonomies in application logic.
- Prefer small, focused modules over enormous components/services.
- Business rules live in domain modules / API services—not duplicated in React components.
- Validate all inputs with Zod at API boundaries.
- Secrets never ship to the browser. Service keys stay server-side only.
- Do not use unstructured JSON blobs as substitutes for modeled relationships.
- Prefer cursor pagination for lists, feeds, and messages.
- Optimistic UI for messaging and lightweight interactions; reconcile with server truth.

---

## Database standards

- Normalized relational model; PostGIS for geometry.
- Every tenant-owned table includes `society_id` (or equivalent) and is indexed accordingly.
- Soft history for occupancy/household changes where required—do not destructively overwrite occupancy history.
- Prefer explicit join tables for many-to-many (skills, professions, interests, business owners).
- Add indexes for frequent filters, FKs, and spatial queries (`GIST` for geometry).
- Migrations are the only schema change path. Never hand-edit production schema.
- Materialized views / snapshots for analytics; do not recompute heavy dashboards from OLTP on every request.

---

## Migration rules

1. Write forward migrations only (no destructive surprise drops without a plan).
2. Name migrations descriptively: `add_household_occupancy_history`.
3. Include indexes in the same migration that needs them for correctness/perf.
4. Backfill scripts run via workers when data volume is non-trivial.
5. Document breaking changes in `docs/DECISIONS.md`.
6. Local: migrate → generate client → run tests before PR.

---

## Authorization rules

- Authorize with **permissions**, not role display names.
- Examples: `residents.read`, `households.manage`, `sensitive_resident_data.read`, `map.admin_view`, `children_data.read`, `exports.create`, `analytics.sensitive_read`.
- Every API handler checks authn + authz + tenant scope.
- Frontend hiding is never a security control.
- IDOR tests are mandatory for resident, household, address, dependent, and export endpoints.

---

## Privacy rules

- Field-level visibility: `private | household | connections | members | society_admin | public`.
- Exact household coordinates and street addresses are **administrative / high-restriction** by default.
- Dependents/minors: **private by default**; excluded from search, directories, maps, and discovery.
- Map heatmaps use aggregation + configurable minimum bucket thresholds (default ≥ 5) to prevent singling out households.
- Consent records and purpose limitation for sensitive processing.
- Sensitive exports require elevated permission + audit log.
- AI / future retrieval must use the same authorization filters as APIs—no privileged bypass.

---

## GIS rules

- Store geometry in PostGIS (`geometry` / `geography`) independently of map tiles/provider.
- Support GeoJSON import/export for boundaries and features.
- Serve map data by bounding box + zoom-appropriate simplification; never dump full society geometry blindly.
- Layer architecture: boundary, phase, sector, block, property, density, profession heatmap, businesses, amenities, events, emergency resources.
- Precision degradation by viewer permission (exact → block → sector → none).
- URL-serializable map filter state for shareable internal views.

---

## UI conventions

- Premium, modern, interactive SaaS—not government CRUD, Bootstrap admin, or spreadsheet-with-routes.
- Clarity, density without clutter, strong hierarchy, human identity, geographic visualization.
- Application shell: global search, command palette, notifications, profile menu, consistent nav.
- Every list/detail: loading, empty, and error states.
- Responsive: dedicated mobile patterns for map (drawers/bottom sheets)—not scaled-down desktop.
- Accessibility: semantic HTML, keyboard nav, focus rings, contrast, `prefers-reduced-motion`.
- Motion communicates state; do not over-animate.
- Design tokens in CSS variables; consistent spacing/typography via the shared UI package.
- Inspiration (patterns only, not branding): Linear, Notion, Stripe, Airbnb, LinkedIn, modern GIS dashboards.

---

## Testing requirements

Mandatory coverage for:

- Unit, integration, API, authorization, tenant isolation, geospatial, privacy, E2E smoke.
- Critical scenarios: household create/join, profession update + visibility, professional search, map filters, address denial, dependent denial, business register/discover, connections, posts, RSVP, opportunities, messaging, sensitive export.

A feature is not done until tests for its authz/privacy boundaries exist.

---

## Commands

```bash
# From repo root
pnpm install
pnpm dev                              # turbo: web + api + worker
pnpm --filter @communityos/web dev
pnpm --filter @communityos/api dev
pnpm --filter @communityos/worker dev
pnpm db:generate
pnpm db:migrate                       # requires local/Supabase DATABASE_URL
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

---

## Definition of Done

A feature is **not** complete because a page exists. Required where applicable:

- [ ] Database model + migration + indexes
- [ ] API + validation
- [ ] Authorization + privacy rules (server-enforced)
- [ ] UI with loading / empty / error states
- [ ] Responsive + accessibility reviewed
- [ ] Tests (esp. authz / tenant / privacy)
- [ ] Docs updated
- [ ] Lint + typecheck + production build pass
- [ ] Security + performance review
- [ ] No known tenant leaks or sensitive-data exposure

---

## Working method for milestones

1. Read `AGENTS.md` and relevant `docs/*`.
2. Inspect existing code.
3. Plan tasks (schema → API → authz → UI → tests).
4. Implement; run app; review UX/responsive/security/perf.
5. Self-review the diff as an independent senior engineer; fix issues.
6. Re-validate; write completion report.

---

## Primary product principle

The platform exists to answer, with consent:

**Who** lives here · **Where** · **What** they do · **What skills/businesses/resources** exist · **What** the community needs · **Who can help whom**—and to turn that into opportunity without violating privacy.
