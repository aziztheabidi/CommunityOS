# Security

## Threat model (abridged)

| Asset | Threats |
|-------|---------|
| Resident PII / addresses | IDOR, scraping, export abuse, map leak |
| Minors data | Accidental indexing, admin overreach |
| Cross-tenant data | Missing society filters, RLS gaps |
| Auth sessions | Token theft, fixation, weak reset |
| Uploads | XSS via SVG, malware, SSRF via URL fetch |
| Admin actions | Privilege escalation, unaudited changes |

## Controls

### Authentication

- Supabase Auth (email magic link / OAuth as enabled)  
- Secure cookie or bearer JWT to API  
- MFA encouraged for admin roles (phase in)  
- Brute-force protection on auth endpoints  

### Authorization

See `AUTHORIZATION.md`. Server-side only.

### Tenant isolation

- Mandatory `society_id` predicates  
- Automated tests for cross-tenant reads/writes  
- RLS on Supabase-exposed tables  

### Input / output

- Zod validation  
- Output encoding in React (default)  
- CSP headers on web  
- Sanitize HTML if rich text introduced (prefer Markdown subset)  

### CSRF

- API bearer tokens reduce classic CSRF; if cookie sessions used, SameSite + CSRF tokens  

### SQL injection

- Parameterized ORM/queries only; raw SQL review checklist for PostGIS  

### SSRF

- Disable arbitrary server-side URL fetch from user input; allowlist hosts for link unfurls  

### File uploads

- MIME sniffing + allowlist; size limits; virus scan later; store in Supabase Storage with signed URLs  

### Secrets

- Server env only; rotate; never `NEXT_PUBLIC_` for service keys  

### Logging

- No phones, exact addresses, tokens in logs  
- Audit sensitive access separately  

### Dependencies

- Lockfile; Dependabot/Renovate; CI audit  

### Rate limiting & abuse

- Redis-backed limits; anomaly alerts on export/search  

## Secure SDLC

- PR checks: lint, types, tests including authz/privacy  
- Security review checklist on milestones touching PII/GIS/exports  
- Periodic access review of Platform Super Admin  

## Incident readiness

- Audit logs retained  
- Ability to revoke sessions  
- Break-glass admin procedure documented (ops runbook — Milestone 13)  
