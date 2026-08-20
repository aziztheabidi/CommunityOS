# Analytics & Community Intelligence

## Goal

Translate structured community data into **decision support**—not vanity charts. Dashboards must answer questions and deep-link into filtered directories/maps.

## Separation of concerns

| Path | Use |
|------|-----|
| OLTP | Operational CRUD |
| Analytics events | Append-only facts (profile_updated, search_performed, connection_accepted, …) |
| Snapshots / materialized aggregates | Dashboards, heatmaps, prosperity indicators |
| Product analytics (PostHog) | UX funnels (careful with PII) |

Do **not** compute heavy society-wide `GROUP BY` on hot paths every request.

## Intelligence domains

1. **Population** — residents, households, owner/tenant, active/inactive  
2. **Professional composition** — category distributions, seniority (when modeled), freelancers, mentors, open-to-work  
3. **Economic** — businesses, hiring, resident-owned, job posts  
4. **Skills** — top / rare / emerging; gap signals from search demand vs supply  
5. **Geographic** — density, profession choropleths, business distribution  
6. **Engagement** — connections, posts, events, groups  
7. **Opportunities** — jobs, applications, mentorship requests  
8. **Needs** — repeated unresolved searches / help requests  

## Privacy in analytics

- Respect classification: sensitive dashboards need `analytics.sensitive_read`  
- Aggregates for general admins may still omit low-N buckets  
- No child-level analytics beyond consented age-band aggregates  

## Prosperity indicators (future)

Composite indicators (diversity, connectivity, volunteerism, opportunity flow) are **directional**. Document methodology; never market as absolute “prosperity proof.”

## Pipeline

```
Domain write → analytics_event (optional)
     → worker aggregate → analytics_snapshots
     → Redis cache → API → interactive dashboard
```

Invalidate/recompute on schedules + event triggers for critical metrics.

## Interactivity requirement

Clicking “Healthcare Professionals: 327” opens Talent Directory pre-filtered.  
Clicking Sector D on map updates dashboard context + drawer stats.

## Search demand gaps

Log sanitized search queries (no PII) → match to taxonomy → surface “Potential Service Gap” when demand ≫ supply.
