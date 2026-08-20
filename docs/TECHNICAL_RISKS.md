# Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Address / coordinate leakage via map or IDOR | Critical | Medium without controls | Precision ladder, authz tests, no raw points to residents |
| Minor/dependent exposure in search or AI | Critical | Medium if coupled to residents | Separate tables; hard exclusions; dedicated perms |
| Cross-tenant data access | Critical | Medium at speed | society_id everywhere, RLS, automated isolation tests |
| Heatmap re-identification (small N) | High | High in small societies | Min bucket threshold; admin-only low-N |
| PostGIS + ORM friction slows M1 | Medium | Medium | ADR-007 evaluation; raw SQL helpers for spatial |
| Map performance at 50k–100k residents | High | Medium | Aggregates, bbox, simplify, clustering, workers |
| Supabase vendor coupling | Medium | Certain | Ports for storage/realtime; own schema migrations |
| Stale professional data → bad intelligence | High | High | Completeness score, verification, confirmations |
| Premature AI search complexity | Medium | Medium | FTS first; shared search abstraction |
| Overbuilding UI before privacy serializers | High | High if rushed | M0–M2 gate before broad directories |
| Import destroying occupancy history | High | Medium | Staging imports; occupancy time ranges |
| Admin over-privilege culture | High | Medium | Granular perms, audited exports, purpose policies |
| Realtime messaging scale | Medium | Later | Cursor pagination, channel auth, extract later |
| Analytics hammering OLTP | Medium | High without snapshots | Snapshots + Redis from M12 (design from M0) |

## Architecture review checklist (internal)

Reviewed against:

- [x] Scalability path (modular monolith, cursors, aggregates, cache)  
- [x] Privacy & consent model  
- [x] Address security & geo precision  
- [x] Minor/dependent protection  
- [x] Multi-tenancy  
- [x] Normalization (property ≠ household ≠ resident)  
- [x] GIS performance approach  
- [x] Search abstraction  
- [x] Community intelligence vs vanity charts  
- [x] Professional filtering & taxonomies as data  
- [x] Business multi-owner relationships  
- [x] Long-term analytics snapshots  

**Conclusion:** Architecture is approved to proceed with **Milestone 0 implementation** (toolchain + skeleton only), then M1 geography.
