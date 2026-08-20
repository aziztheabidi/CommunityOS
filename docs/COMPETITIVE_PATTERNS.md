# Competitive Pattern Analysis

Research focus: **interaction patterns worth adapting**, not cloning products or brands. Document date: 2026-08-20.

## Pattern sources (conceptual)

| Domain | Example products (category) | Useful patterns |
|--------|-----------------------------|-----------------|
| Professional network | LinkedIn-class | Structured professional identity, intent flags, category directories, mutual context |
| Neighborhood | Nextdoor-class | Locality context, recommendations, local services, geo relevance |
| Membership community | Hivebrite-class | Searchable member network, groups, events, admin analytics |
| HOA / society ops | Various HOA suites | Properties, households, announcements targeting, admin workflows |
| GIS / civic | Modern GIS dashboards | Layers, choropleths, legends, click-to-inspect, URL state |
| Business directory | Local discovery apps | Category browse, map pins, hours, verification badges |
| Premium SaaS admin | Stripe/Linear-class | Command palette, density, speed, empty states, keyboard |

## Adaptations for CommunityOS

1. **Professional identity × local geo** — LinkedIn-like profile richness constrained by society membership and privacy.  
2. **Directory trinity** — Members / Professionals / Businesses as separate UX entry points sharing one graph.  
3. **Map as product, not widget** — GIS-grade layers + privacy-degraded precision.  
4. **Targeted announcements** — HOA-like audience segments (sector, profession) with consent for comms.  
5. **Opportunity hub** — Jobs/mentoring/volunteer as first-class, not forum posts alone.  
6. **Intelligence with drill-down** — KPIs navigate to filtered directories (analytics SaaS pattern).  
7. **Command palette** — Power-user navigation across dense IA.  

## Anti-patterns to avoid

- Public white-pages of residents  
- Exact home pins for all members  
- Children in member search  
- Feed-only “community” without structured graph  
- Rigid single geo vocabulary (Tower-only assumptions)  
- Role-name-only authz  

## Differentiation summary

CommunityOS unique combination:

**Professional graph + household/property ops + PostGIS society map + resident business network + privacy engine + community intelligence**

That combination should not collapse into “another HOA portal” or “another social network.”

## Reference UI notes (provided mocks)

- Community admin mock: KPI row, dual charts, member table, clear sidebar IA → good density reference for Intelligence + Residents.  
- Healthcare SaaS mock: center analytics + right contextual panel → good pattern for Map sector drawer / consultation-style context.  

Use as **layout rhythm** references only; CommunityOS branding remains original.
