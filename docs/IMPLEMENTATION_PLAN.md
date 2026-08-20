# Implementation Plan

## Method

For each milestone: read `AGENTS.md` → read relevant docs → implement schema → API → authz → UI → tests → self-review → completion report.

---

## Milestone 0 — Architecture & Engineering Foundation

### Objectives

Establish monorepo, tooling, DB package with PostGIS readiness, auth stub, CI, design tokens, logging, security baseline, docs (this set).

### Schema

- Minimal: `platform_users`, `societies`, `society_memberships`, `society_settings`  
- Enable PostGIS extension in migration  

### Backend

- Fastify hello + health + auth middleware stub  
- Config via Zod env  
- Permissions package with catalog  

### Frontend

- Next.js app shell skeleton + design tokens + placeholder Home  
- shadcn/ui init  

### Security / tests

- CI: lint, typecheck, unit smoke  
- Secure headers baseline  
- `.env.example`  

### DoD

- [x] `pnpm install && pnpm lint && pnpm typecheck && pnpm test && pnpm build` pass  
- [x] Docs + `AGENTS.md` present  
- [x] Empty remote populated with foundation  

### Dependencies / risks

- ORM choice: **Prisma** accepted (ADR-007); PostGIS via SQL + `$queryRaw`  
- Supabase project provisioning still required before migrate deploy  

---

## Milestone 1 — Society Geography & Properties

**Obj:** Configurable geo hierarchy, properties, boundaries, interactive base map.  
**Schema:** geo levels/areas, streets/plots, properties, geo_boundaries/features.  
**API:** CRUD areas/properties; GeoJSON endpoints.  
**UI:** Map standard mode, admin geo tools.  
**Sec:** `geo.*`, `properties.*`, `map.*`.  
**Tests:** spatial contains, tenant isolation.  
**Risks:** bad GeoJSON imports; mobile map UX.

## Milestone 2 — Households & Residents

**Obj:** Occupancy history, households, residents, dependents, privacy settings, CSV import preview.  
**Sec:** children exclusion; address precision.  
**Tests:** privacy projection; dependent denial.

## Milestone 3 — Professional Intelligence

**Obj:** Taxonomies, employment, skills, education, professional directory + filters.  
**UI:** category landing + faceted directory.

## Milestone 4 — Business Ecosystem

**Obj:** Businesses, ownership, services, directory + map pins, verification basics.

## Milestone 5 — Society Intelligence Map

**Obj:** Profession layers, heatmaps, spatial filters, sector drawer, aggregation thresholds, URL state.

## Milestone 6 — Networking

**Obj:** Connections vs follows, discovery rules, mentoring flags in directory.

## Milestone 7 — Social Community

**Obj:** Feed, media, comments, reactions, announcements targeting, polls, moderation hooks, cursor pagination.

## Milestone 8 — Groups & Events

**Obj:** Groups, events, RSVP/waitlist architecture, calendar, map location.

## Milestone 9 — Opportunity & Prosperity Hub

**Obj:** Jobs/internships/freelance/volunteer/mentorship + applications + basic matching.

## Milestone 10 — Messaging & Notifications

**Obj:** DM/group chat optimistic UI, realtime, attachments, notification center + prefs.

## Milestone 11 — Administration & Moderation

**Obj:** Granular roles UI, reports, audit, advanced imports/exports with controls.

## Milestone 12 — Analytics & Community Intelligence

**Obj:** Interactive dashboard, snapshots, gaps, drill-downs, geographic analysis.

## Milestone 13 — Production Hardening

**Obj:** Perf, security audit, load tests, a11y, observability, backup/DR.

---

## Cross-cutting always

Authorization tests · tenant tests · privacy tests · no secrets in client · update docs/DECISIONS for significant ADRs.
