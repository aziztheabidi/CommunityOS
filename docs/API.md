# API Conventions

## Style

- REST + JSON over HTTPS  
- Version prefix: `/v1`  
- Society context: `X-Society-Id` header (or path `/v1/societies/:societyId/...`—pick one in Milestone 0 and stick to it; **recommendation:** path-scoped for clarity)  

Recommended:

```
/v1/societies/:societyId/residents
/v1/societies/:societyId/map/aggregates
```

## Auth

`Authorization: Bearer <jwt>`  
Impersonation (if ever): separate audited header; disabled by default.

## Errors

Problem-details-like JSON:

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Missing permission residents.manage",
    "details": []
  }
}
```

Use 401 unauthenticated, 403 forbidden, 404 for both not-found and unauthorized-existence where enumeration matters (document per route).

## Pagination

Cursor-based:

```
?cursor=...&limit=25
```

Response:

```json
{
  "data": [],
  "pageInfo": { "nextCursor": "...", "hasNextPage": true }
}
```

## Filtering & sort

Explicit allowlists. Never pass raw SQL. Complex directory filters as structured query objects validated by Zod.

## Idempotency

Mutations that may retry (imports, message send client ids) accept `Idempotency-Key`.

## Visibility

Responses are **already projected**. Clients must not assume absence means non-existence vs hidden—use explicit `visibility` metadata only when safe.

## Key route groups (planned)

| Group | Examples |
|-------|----------|
| Auth/session | `/v1/me`, memberships |
| Geography | areas, boundaries, features GeoJSON |
| Properties/households/residents | CRUD + claim/invite |
| Taxonomies | professions, skills, industries |
| Directories | residents, professionals, businesses, resources |
| Map | layers, aggregates, feature detail |
| Social | posts, comments, reactions, announcements |
| Network | connections, follows, discovery |
| Events/groups/opportunities | RSVP, apply |
| Messaging | conversations, messages |
| Notifications | list, prefs, mark read |
| Admin | roles, imports, exports, audit, moderation |
| Analytics | snapshots, intelligence widgets |
| Search | `/v1/societies/:id/search?q=` |

## Realtime

Not REST: channel auth endpoints issue short-lived tokens for conversation/society topics.

## OpenAPI

Generated from Zod routers; published in CI artifacts.

## Rate limits

Per IP + per user; stricter on search, export, auth, messaging send.
