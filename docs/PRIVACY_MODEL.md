# Privacy Model & Data Classification

## Principle

Privacy is enforced in **data model + API + serializers + map aggregation**—never by hiding UI controls alone.

## Data classification

| Class | Examples | Default audience |
|-------|----------|------------------|
| **Public community** | Society name, public events, public business listings, amenity locations | Public / guests as configured |
| **Member-visible** | Display name, member-visible profession/skills, public groups | Society members |
| **Connections** | Phone, deeper profile fields if opted | Accepted connections |
| **Household** | Shared household operational info | Household members |
| **Administrative** | Full address, occupancy admin fields, verification notes | Roles with explicit perms |
| **Sensitive** | Exact coordinates, DOB (if stored), detailed employment salary (if ever), exports | Elevated perms + audit |
| **Highly restricted** | Dependents/minors, guardian-linked child attributes, blood donor status (if ever) | Explicit `children_data.*` / purpose-bound consents |

## Field visibility enum

`private | household | connections | members | society_admin | public`

Stored in `resident_privacy_settings` (per field group):

- identity_photo  
- contact_phone / contact_email  
- exact_address / geo_precision  
- profession / skills / education  
- employment_history  
- business_associations  
- intents (hiring, open to work, mentoring)  
- interests  
- dependent_presence (aggregate only vs none)  

## Consent

`consent_records`: subject, purpose (`directory`, `map_aggregate`, `marketing_email`, `research`, …), policy version, granted/revoked timestamps, actor.

Processing beyond operational necessity requires consent + purpose binding.

## Minors / dependents

- Modeled separately from `residents`  
- **Private by default**  
- Excluded from: search, member directory, professional directory, map pins, discovery, smart search  
- Prefer **age bands** and society-level aggregates for planning  
- Collect DOB/school only with legitimate need + guardian consent  
- APIs require `children_data.read` (or manage) — separate from `residents.read`  

## Geographic disclosure

Precision ladder:

1. Exact property point  
2. Plot / street  
3. Block  
4. Sector / phase  
5. Society-only / hidden  

Return the **minimum** of (viewer permission, subject preference, feature policy).

## Search & AI

Search documents contain only fields the **viewer** may see. Indexing jobs store visibility metadata; query planner filters.

Future AI assistants must call the same authorized retrieval APIs. No privileged “god mode” embeddings over restricted fields.

## Exports

- `exports.create` permission  
- Sensitive exports additionally require `sensitive_resident_data.read` (or dedicated export perm)  
- Always write `audit_logs`  
- Prefer aggregated exports for intelligence use cases  

## Threats & mitigations

| Threat | Mitigation |
|--------|------------|
| Exact address via map or API IDOR | Authz + precision projection + tests |
| Heatmap re-identification | Min bucket threshold + admin-only low counts |
| Children in autocomplete | Separate tables + hard exclusion in search providers |
| Admin casual PII dump | Export perms + audit + UI friction |
| Phone scraping via directory | Default visibility connections/admin; rate limits |
| Stale public profession data | Verification timestamps + resident control |
| AI prompt injection → data leak | Tool-use only through authz APIs; no raw SQL tools |
| Tenant cross-access | society_id on all queries + RLS |

## Data subject rights

Account/data export and deletion workflows (Milestone 11+ hardening): verify identity, cascade per retention policy, audit completion. Household/admin operational records may retain minimized legal copies under policy—document in society settings.
