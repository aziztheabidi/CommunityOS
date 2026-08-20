# Authorization Model

## Rules

1. Authenticate first; anonymous only for explicitly public routes.  
2. Authorize with **permissions**, not role display names.  
3. Every resource check includes **society tenancy**.  
4. Field-level privacy is applied **after** permission grants (intersection).  
5. Server enforcement is mandatory; UI only mirrors capabilities.

## Initial roles (seed templates)

| Role | Intent |
|------|--------|
| Platform Super Admin | Cross-tenant platform ops |
| Society Owner | Tenant owner |
| Society Super Admin | Full society administration |
| Society Admin | Day-to-day admin |
| Community Manager | Engagement, events, groups |
| Data Manager | Imports, taxonomies, verification |
| Sector Admin | Scoped to assigned geo areas |
| Moderator | Feed/reports |
| Security Staff | Gates/ops views (limited PII) |
| Event Manager | Events only |
| Resident | Standard member |
| Guest | Public-limited |

Roles are bundles of permissions; custom roles allowed later.

## Permission catalog (initial)

```
societies.read / societies.manage
settings.manage
geo.read / geo.manage
properties.read / properties.manage
households.read / households.manage
residents.read / residents.manage
sensitive_resident_data.read
children_data.read / children_data.manage
professional_data.read / professional_data.manage
taxonomies.manage
businesses.read / businesses.manage
businesses.verify
map.resident_view / map.admin_view
analytics.read / analytics.sensitive_read
exports.create
roles.manage
moderation.manage
audit.read
feed.manage
announcements.manage
events.manage
opportunities.manage
groups.manage
messaging.use
notifications.manage
imports.manage
```

Sector Admin permissions are evaluated with **geo scope** constraints on resources.

## Evaluation algorithm

```
authorize(actor, permission, resource):
  if !actor.memberships[resource.societyId]: deny
  if permission in actor.effectivePermissions(societyId, resource.scope): allow
  else deny
```

Effective permissions = union of role permissions − explicit denies (future) + scoped grants.

## Intersection with privacy

Example: actor has `residents.read` and subject set `phone = connections` → return phone only if connection accepted (or actor has `sensitive_resident_data.read` / admin override policy—prefer **not** silent admin override without audit).

Document society policy: whether admins bypass member visibility for ops. Default recommendation: **admin bypass for operational fields with audit**, never for casual browsing UI without purpose.

## Testing matrix (minimum)

- Resident cannot read another society’s residents  
- Resident cannot read exact address without privilege  
- Resident cannot read dependents  
- Sector admin cannot manage outside sector  
- Export without `exports.create` fails  
- Map aggregate below threshold hidden for resident tier  

## Implementation home

`packages/permissions` owns constants + pure evaluators.  
API plugins attach `ctx.authz`.  
Optional RLS policies mirror critical denies.
