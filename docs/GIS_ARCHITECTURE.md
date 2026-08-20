# GIS Architecture

## Intent

The **Society Intelligence Map** is a signature product surface: interactive, modern, responsive—not a static iframe. Geography is a first-class domain.

## Stack

| Concern | Choice |
|---------|--------|
| Storage | PostgreSQL + PostGIS |
| Client | MapLibre GL JS |
| Basemap | OpenStreetMap raster/vector tiles (swappable) |
| Interchange | GeoJSON import/export |
| Server queries | Bounding box, `ST_Intersects`, `ST_DWithin`, `ST_Contains`, simplify |

Core geometries are **never** owned by Mapbox/Google—only rendering may use commercial tiles if justified later.

## Spatial entities

| Entity | Geometry | Notes |
|--------|----------|-------|
| Society boundary | MultiPolygon | Outer fence |
| Geo areas (phase/sector/block) | MultiPolygon | Choropleth units |
| Streets | LineString / MultiLineString | Optional |
| Plots / properties | Polygon or Point | Precision restricted by role |
| Amenities / facilities | Point (+ optional poly) | Parks, gates, mosques, schools, clinics, offices |
| Businesses | Point | Distinct styling from homes |
| Events | Point | Temporary markers |
| Resident density / profession heat | Derived aggregates | Not raw resident points for general users |

SRID: **4326**. Spatial indexes: **GIST**.

## Layer architecture

Client maintains a layer registry:

1. Society boundary  
2. Phase / Sector / Block outlines + fills  
3. Properties (admin / authorized)  
4. Amenities & community facilities  
5. Business locations  
6. Events  
7. Resident density (aggregated)  
8. Profession / industry heatmap (aggregated)  
9. Emergency / volunteer resources (permissioned)  
10. Infrastructure issues (future)  

Layers toggle independently; filter state serializes to URL query (`layers`, `profession`, `sector`, `op`, etc.).

## Map modes

- **Standard** — areas, amenities, community locations  
- **Resident distribution** — density by geo area (thresholded)  
- **Profession heatmap** — category → choropleth counts  
- **Business** — pins + category filters  
- **Ops** — gates, offices, issues (admin)  

## Filter model

Filters compose with AND (default) and optional OR groups:

`professionCategory` · `profession` · `skill` · `employmentStatus` · `businessOwner` · `mentor` · `volunteer` · `phase/sector/block` · `propertyType` · `group` · `event`

Example: Technology ∧ Software Engineering ∧ Open to Mentoring ∧ Sector B.

## Privacy-aware precision

| Viewer | Typical precision |
|--------|-------------------|
| Society Super Admin / authorized ops | Property / household (where permitted) |
| Society management | Administrative property as required |
| Resident | Sector/block/approximate or none per subject privacy |
| Guest | Public amenities only |

**Never** expose exact private household coordinates solely because they exist in DB.

Heatmaps for non-privileged users:

- Aggregate to geo area (or grid)  
- Suppress buckets `< heatmap_min_bucket_size` (default 5)  
- Prefer counts/rates without identifiable markers  

## API patterns

- `GET /maps/geojson?bbox=&layers=&z=` — simplified geometries for viewport  
- `GET /maps/aggregates?metric=profession&categoryId=` — choropleth values  
- `GET /maps/features/:id` — detail drawer payload after authz  

Use zoom-based simplification (`ST_SimplifyPreserveTopology`) and pagination/clustering for points.

## Interaction UX

- Smooth zoom/pan; hover outlines; click sector → side drawer analytics  
- Map ↔ list sync for directories  
- Profile / business preview drawers  
- Mobile: bottom sheet filters + limited gesture chrome  

## Performance

- Prefetch society boundary; lazy load detailed layers  
- Cache aggregates in Redis keyed by society + filter hash + privacy tier  
- Recompute aggregates in workers on profession/geo changes  
- Avoid shipping full resident point clouds to browsers  

## Import / export

Admin GIS tools accept GeoJSON FeatureCollections mapped to `geo_boundaries` / `geo_features` / area updates. Validation: CRS, self-intersection, society containment. Export mirrors import for backups/portability.

## Accessibility

Provide non-map equivalents (sector tables, lists) for critical insights; keyboard-focusable controls; don’t rely on color alone (patterns/labels in legends).
