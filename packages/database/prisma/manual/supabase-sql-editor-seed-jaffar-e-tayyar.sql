-- Seed: Jaffar-e-Tayyar Society (Malir, Karachi · ~24.88446 N, 67.196885 E · postal 75050)
-- Paste into Supabase SQL Editor on the CommunityOS project only.
-- Safe to re-run (upserts / ON CONFLICT).
BEGIN;

INSERT INTO societies (id, slug, name, timezone, "isActive", "createdAt", "updatedAt")
VALUES ('soc_demo_jaffar_e_tayyar', 'jaffar-e-tayyar', 'Jaffar-e-Tayyar Society', 'Asia/Karachi', true, now(), now())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  timezone = EXCLUDED.timezone,
  "updatedAt" = now();

INSERT INTO society_settings (id, "societyId", "heatmapMinBucketSize", "featureFlags", branding, "createdAt", "updatedAt")
VALUES (
  'settings_soc_demo_jaffar_e_tayyar',
  'soc_demo_jaffar_e_tayyar',
  5,
  '{}'::jsonb,
  '{"primaryLabel":"Jaffar-e-Tayyar","tagline":"Connected community. Shared opportunity.","location":{"district":"Malir District","city":"Karachi","postalCode":"75050","center":{"lat":24.88446,"lng":67.196885}}}'::jsonb,
  now(),
  now()
)
ON CONFLICT ("societyId") DO UPDATE SET
  branding = EXCLUDED.branding,
  "heatmapMinBucketSize" = EXCLUDED."heatmapMinBucketSize",
  "updatedAt" = now();

INSERT INTO geo_level_definitions (id, "societyId", key, label, "sortOrder", "createdAt", "updatedAt")
VALUES ('level_soc_demo_jaffar_e_tayyar_phase', 'soc_demo_jaffar_e_tayyar', 'phase', 'Phase', 1, now(), now())
ON CONFLICT ("societyId", key) DO UPDATE SET
  label = EXCLUDED.label,
  "sortOrder" = EXCLUDED."sortOrder",
  "updatedAt" = now();

INSERT INTO geo_level_definitions (id, "societyId", key, label, "sortOrder", "createdAt", "updatedAt")
VALUES ('level_soc_demo_jaffar_e_tayyar_sector', 'soc_demo_jaffar_e_tayyar', 'sector', 'Sector', 2, now(), now())
ON CONFLICT ("societyId", key) DO UPDATE SET
  label = EXCLUDED.label,
  "sortOrder" = EXCLUDED."sortOrder",
  "updatedAt" = now();

INSERT INTO geo_level_definitions (id, "societyId", key, label, "sortOrder", "createdAt", "updatedAt")
VALUES ('level_soc_demo_jaffar_e_tayyar_block', 'soc_demo_jaffar_e_tayyar', 'block', 'Block', 3, now(), now())
ON CONFLICT ("societyId", key) DO UPDATE SET
  label = EXCLUDED.label,
  "sortOrder" = EXCLUDED."sortOrder",
  "updatedAt" = now();

INSERT INTO geo_areas (id, "societyId", "levelKey", "parentId", name, code, "sortOrder", "geomJson", "centroidJson", metadata, "createdAt", "updatedAt")
VALUES (
  'area_phase_1',
  'soc_demo_jaffar_e_tayyar',
  'phase',
  NULL,
  'Phase 1',
  'P1',
  1,
  '{"type":"Polygon","coordinates":[[[67.184885,24.87646],[67.200885,24.87646],[67.200885,24.894460000000002],[67.184885,24.894460000000002],[67.184885,24.87646]]]}'::jsonb,
  '{"type":"Point","coordinates":[67.192885,24.88546]}'::jsonb,
  '{"residentEstimate":4820,"householdEstimate":1210}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "parentId" = EXCLUDED."parentId",
  "geomJson" = EXCLUDED."geomJson",
  "centroidJson" = EXCLUDED."centroidJson",
  metadata = EXCLUDED.metadata,
  "updatedAt" = now();

INSERT INTO geo_areas (id, "societyId", "levelKey", "parentId", name, code, "sortOrder", "geomJson", "centroidJson", metadata, "createdAt", "updatedAt")
VALUES (
  'area_phase_2',
  'soc_demo_jaffar_e_tayyar',
  'phase',
  NULL,
  'Phase 2',
  'P2',
  2,
  '{"type":"Polygon","coordinates":[[[67.200885,24.87646],[67.212885,24.87646],[67.212885,24.894460000000002],[67.200885,24.894460000000002],[67.200885,24.87646]]]}'::jsonb,
  '{"type":"Point","coordinates":[67.206885,24.88546]}'::jsonb,
  '{"residentEstimate":3160,"householdEstimate":840}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "parentId" = EXCLUDED."parentId",
  "geomJson" = EXCLUDED."geomJson",
  "centroidJson" = EXCLUDED."centroidJson",
  metadata = EXCLUDED.metadata,
  "updatedAt" = now();

INSERT INTO geo_areas (id, "societyId", "levelKey", "parentId", name, code, "sortOrder", "geomJson", "centroidJson", metadata, "createdAt", "updatedAt")
VALUES (
  'area_sector_a',
  'soc_demo_jaffar_e_tayyar',
  'sector',
  'area_phase_1',
  'Sector A',
  'A',
  1,
  '{"type":"Polygon","coordinates":[[[67.184885,24.885460000000002],[67.19288499999999,24.885460000000002],[67.19288499999999,24.894460000000002],[67.184885,24.894460000000002],[67.184885,24.885460000000002]]]}'::jsonb,
  '{"type":"Point","coordinates":[67.188885,24.88996]}'::jsonb,
  '{"residentEstimate":1680,"householdEstimate":420}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "parentId" = EXCLUDED."parentId",
  "geomJson" = EXCLUDED."geomJson",
  "centroidJson" = EXCLUDED."centroidJson",
  metadata = EXCLUDED.metadata,
  "updatedAt" = now();

INSERT INTO geo_areas (id, "societyId", "levelKey", "parentId", name, code, "sortOrder", "geomJson", "centroidJson", metadata, "createdAt", "updatedAt")
VALUES (
  'area_sector_d',
  'soc_demo_jaffar_e_tayyar',
  'sector',
  'area_phase_2',
  'Sector D',
  'D',
  1,
  '{"type":"Polygon","coordinates":[[[67.200885,24.885460000000002],[67.212885,24.885460000000002],[67.212885,24.894460000000002],[67.200885,24.894460000000002],[67.200885,24.885460000000002]]]}'::jsonb,
  '{"type":"Point","coordinates":[67.206885,24.88996]}'::jsonb,
  '{"residentEstimate":1740,"householdEstimate":450}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "parentId" = EXCLUDED."parentId",
  "geomJson" = EXCLUDED."geomJson",
  "centroidJson" = EXCLUDED."centroidJson",
  metadata = EXCLUDED.metadata,
  "updatedAt" = now();

INSERT INTO geo_areas (id, "societyId", "levelKey", "parentId", name, code, "sortOrder", "geomJson", "centroidJson", metadata, "createdAt", "updatedAt")
VALUES (
  'area_sector_b',
  'soc_demo_jaffar_e_tayyar',
  'sector',
  'area_phase_1',
  'Sector B',
  'B',
  2,
  '{"type":"Polygon","coordinates":[[[67.19288499999999,24.885460000000002],[67.200885,24.885460000000002],[67.200885,24.894460000000002],[67.19288499999999,24.894460000000002],[67.19288499999999,24.885460000000002]]]}'::jsonb,
  '{"type":"Point","coordinates":[67.196885,24.88996]}'::jsonb,
  '{"residentEstimate":1920,"householdEstimate":480}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "parentId" = EXCLUDED."parentId",
  "geomJson" = EXCLUDED."geomJson",
  "centroidJson" = EXCLUDED."centroidJson",
  metadata = EXCLUDED.metadata,
  "updatedAt" = now();

INSERT INTO geo_areas (id, "societyId", "levelKey", "parentId", name, code, "sortOrder", "geomJson", "centroidJson", metadata, "createdAt", "updatedAt")
VALUES (
  'area_sector_e',
  'soc_demo_jaffar_e_tayyar',
  'sector',
  'area_phase_2',
  'Sector E',
  'E',
  2,
  '{"type":"Polygon","coordinates":[[[67.200885,24.87646],[67.212885,24.87646],[67.212885,24.885460000000002],[67.200885,24.885460000000002],[67.200885,24.87646]]]}'::jsonb,
  '{"type":"Point","coordinates":[67.206885,24.88096]}'::jsonb,
  '{"residentEstimate":1420,"householdEstimate":390}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "parentId" = EXCLUDED."parentId",
  "geomJson" = EXCLUDED."geomJson",
  "centroidJson" = EXCLUDED."centroidJson",
  metadata = EXCLUDED.metadata,
  "updatedAt" = now();

INSERT INTO geo_areas (id, "societyId", "levelKey", "parentId", name, code, "sortOrder", "geomJson", "centroidJson", metadata, "createdAt", "updatedAt")
VALUES (
  'area_sector_c',
  'soc_demo_jaffar_e_tayyar',
  'sector',
  'area_phase_1',
  'Sector C',
  'C',
  3,
  '{"type":"Polygon","coordinates":[[[67.184885,24.87646],[67.200885,24.87646],[67.200885,24.885460000000002],[67.184885,24.885460000000002],[67.184885,24.87646]]]}'::jsonb,
  '{"type":"Point","coordinates":[67.192885,24.88096]}'::jsonb,
  '{"residentEstimate":1220,"householdEstimate":310}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "parentId" = EXCLUDED."parentId",
  "geomJson" = EXCLUDED."geomJson",
  "centroidJson" = EXCLUDED."centroidJson",
  metadata = EXCLUDED.metadata,
  "updatedAt" = now();

INSERT INTO geo_areas (id, "societyId", "levelKey", "parentId", name, code, "sortOrder", "geomJson", "centroidJson", metadata, "createdAt", "updatedAt")
VALUES (
  'area_block_a1',
  'soc_demo_jaffar_e_tayyar',
  'block',
  'area_sector_a',
  'Block A1',
  'A1',
  1,
  '{"type":"Polygon","coordinates":[[[67.184885,24.889960000000002],[67.188885,24.889960000000002],[67.188885,24.894460000000002],[67.184885,24.894460000000002],[67.184885,24.889960000000002]]]}'::jsonb,
  '{"type":"Point","coordinates":[67.186885,24.89221]}'::jsonb,
  '{"residentEstimate":420,"householdEstimate":105}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "parentId" = EXCLUDED."parentId",
  "geomJson" = EXCLUDED."geomJson",
  "centroidJson" = EXCLUDED."centroidJson",
  metadata = EXCLUDED.metadata,
  "updatedAt" = now();

INSERT INTO geo_areas (id, "societyId", "levelKey", "parentId", name, code, "sortOrder", "geomJson", "centroidJson", metadata, "createdAt", "updatedAt")
VALUES (
  'area_block_b1',
  'soc_demo_jaffar_e_tayyar',
  'block',
  'area_sector_b',
  'Block B1',
  'B1',
  1,
  '{"type":"Polygon","coordinates":[[[67.19288499999999,24.889960000000002],[67.196885,24.889960000000002],[67.196885,24.894460000000002],[67.19288499999999,24.894460000000002],[67.19288499999999,24.889960000000002]]]}'::jsonb,
  '{"type":"Point","coordinates":[67.194885,24.89221]}'::jsonb,
  '{"residentEstimate":510,"householdEstimate":128}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "parentId" = EXCLUDED."parentId",
  "geomJson" = EXCLUDED."geomJson",
  "centroidJson" = EXCLUDED."centroidJson",
  metadata = EXCLUDED.metadata,
  "updatedAt" = now();

INSERT INTO geo_areas (id, "societyId", "levelKey", "parentId", name, code, "sortOrder", "geomJson", "centroidJson", metadata, "createdAt", "updatedAt")
VALUES (
  'area_block_d1',
  'soc_demo_jaffar_e_tayyar',
  'block',
  'area_sector_d',
  'Block D1',
  'D1',
  1,
  '{"type":"Polygon","coordinates":[[[67.200885,24.889960000000002],[67.206885,24.889960000000002],[67.206885,24.894460000000002],[67.200885,24.894460000000002],[67.200885,24.889960000000002]]]}'::jsonb,
  '{"type":"Point","coordinates":[67.203885,24.89221]}'::jsonb,
  '{"residentEstimate":480,"householdEstimate":120}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "parentId" = EXCLUDED."parentId",
  "geomJson" = EXCLUDED."geomJson",
  "centroidJson" = EXCLUDED."centroidJson",
  metadata = EXCLUDED.metadata,
  "updatedAt" = now();

INSERT INTO geo_areas (id, "societyId", "levelKey", "parentId", name, code, "sortOrder", "geomJson", "centroidJson", metadata, "createdAt", "updatedAt")
VALUES (
  'area_block_a2',
  'soc_demo_jaffar_e_tayyar',
  'block',
  'area_sector_a',
  'Block A2',
  'A2',
  2,
  '{"type":"Polygon","coordinates":[[[67.188885,24.889960000000002],[67.19288499999999,24.889960000000002],[67.19288499999999,24.894460000000002],[67.188885,24.894460000000002],[67.188885,24.889960000000002]]]}'::jsonb,
  '{"type":"Point","coordinates":[67.190885,24.89221]}'::jsonb,
  '{"residentEstimate":390,"householdEstimate":98}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "parentId" = EXCLUDED."parentId",
  "geomJson" = EXCLUDED."geomJson",
  "centroidJson" = EXCLUDED."centroidJson",
  metadata = EXCLUDED.metadata,
  "updatedAt" = now();

INSERT INTO geo_areas (id, "societyId", "levelKey", "parentId", name, code, "sortOrder", "geomJson", "centroidJson", metadata, "createdAt", "updatedAt")
VALUES (
  'area_block_b2',
  'soc_demo_jaffar_e_tayyar',
  'block',
  'area_sector_b',
  'Block B2',
  'B2',
  2,
  '{"type":"Polygon","coordinates":[[[67.196885,24.889960000000002],[67.200885,24.889960000000002],[67.200885,24.894460000000002],[67.196885,24.894460000000002],[67.196885,24.889960000000002]]]}'::jsonb,
  '{"type":"Point","coordinates":[67.198885,24.89221]}'::jsonb,
  '{"residentEstimate":460,"householdEstimate":116}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "parentId" = EXCLUDED."parentId",
  "geomJson" = EXCLUDED."geomJson",
  "centroidJson" = EXCLUDED."centroidJson",
  metadata = EXCLUDED.metadata,
  "updatedAt" = now();

INSERT INTO geo_features (id, "societyId", "featureType", name, description, "geomJson", properties, "createdAt", "updatedAt")
VALUES (
  'feat_main_gate',
  'soc_demo_jaffar_e_tayyar',
  'gate',
  'Main Gate',
  'Primary entry with visitor management',
  '{"type":"Point","coordinates":[67.192885,24.87626]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "featureType" = EXCLUDED."featureType",
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO geo_features (id, "societyId", "featureType", name, description, "geomJson", properties, "createdAt", "updatedAt")
VALUES (
  'feat_east_gate',
  'soc_demo_jaffar_e_tayyar',
  'gate',
  'East Gate',
  'Residents & service vehicles',
  '{"type":"Point","coordinates":[67.213085,24.88546]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "featureType" = EXCLUDED."featureType",
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO geo_features (id, "societyId", "featureType", name, description, "geomJson", properties, "createdAt", "updatedAt")
VALUES (
  'feat_central_park',
  'soc_demo_jaffar_e_tayyar',
  'park',
  'Central Park',
  'Playgrounds, walking track, weekend markets',
  '{"type":"Point","coordinates":[67.194885,24.88746]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "featureType" = EXCLUDED."featureType",
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO geo_features (id, "societyId", "featureType", name, description, "geomJson", properties, "createdAt", "updatedAt")
VALUES (
  'feat_community_center',
  'soc_demo_jaffar_e_tayyar',
  'community_center',
  'Community Center',
  'Events hall, committee rooms, coworking corner',
  '{"type":"Point","coordinates":[67.197885,24.88246]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "featureType" = EXCLUDED."featureType",
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO geo_features (id, "societyId", "featureType", name, description, "geomJson", properties, "createdAt", "updatedAt")
VALUES (
  'feat_school',
  'soc_demo_jaffar_e_tayyar',
  'school',
  'Jaffar-e-Tayyar Academy',
  'Primary & secondary campus',
  '{"type":"Point","coordinates":[67.187885,24.89146]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "featureType" = EXCLUDED."featureType",
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO geo_features (id, "societyId", "featureType", name, description, "geomJson", properties, "createdAt", "updatedAt")
VALUES (
  'feat_mosque',
  'soc_demo_jaffar_e_tayyar',
  'place_of_worship',
  'Masjid Al-Noor',
  'Central congregational mosque',
  '{"type":"Point","coordinates":[67.204885,24.89046]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "featureType" = EXCLUDED."featureType",
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO geo_features (id, "societyId", "featureType", name, description, "geomJson", properties, "createdAt", "updatedAt")
VALUES (
  'feat_clinic',
  'soc_demo_jaffar_e_tayyar',
  'medical',
  'Valley Care Clinic',
  'General practice & urgent care',
  '{"type":"Point","coordinates":[67.207885,24.88146]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "featureType" = EXCLUDED."featureType",
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO geo_features (id, "societyId", "featureType", name, description, "geomJson", properties, "createdAt", "updatedAt")
VALUES (
  'feat_office',
  'soc_demo_jaffar_e_tayyar',
  'office',
  'Society Management Office',
  'Admin desk, billing, complaints',
  '{"type":"Point","coordinates":[67.195885,24.87846]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "featureType" = EXCLUDED."featureType",
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO geo_features (id, "societyId", "featureType", name, description, "geomJson", properties, "createdAt", "updatedAt")
VALUES (
  'feat_commercial',
  'soc_demo_jaffar_e_tayyar',
  'commercial',
  'Plaza Market',
  'Groceries, pharmacy, cafes',
  '{"type":"Point","coordinates":[67.202885,24.87946]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "featureType" = EXCLUDED."featureType",
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO properties (id, "societyId", "geoAreaId", label, "addressLine", "propertyType", status, "geomJson", metadata, "createdAt", "updatedAt")
VALUES (
  'prop_a1_12',
  'soc_demo_jaffar_e_tayyar',
  'area_block_a1',
  'House A1-12',
  '12, Block A1, Sector A, Phase 1',
  'house',
  'occupied',
  '{"type":"Point","coordinates":[67.186385,24.89196]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  "addressLine" = EXCLUDED."addressLine",
  "propertyType" = EXCLUDED."propertyType",
  status = EXCLUDED.status,
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO properties (id, "societyId", "geoAreaId", label, "addressLine", "propertyType", status, "geomJson", metadata, "createdAt", "updatedAt")
VALUES (
  'prop_a1_18',
  'soc_demo_jaffar_e_tayyar',
  'area_block_a1',
  'House A1-18',
  '18, Block A1, Sector A, Phase 1',
  'house',
  'occupied',
  '{"type":"Point","coordinates":[67.187385,24.89266]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  "addressLine" = EXCLUDED."addressLine",
  "propertyType" = EXCLUDED."propertyType",
  status = EXCLUDED.status,
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO properties (id, "societyId", "geoAreaId", label, "addressLine", "propertyType", status, "geomJson", metadata, "createdAt", "updatedAt")
VALUES (
  'prop_a2_05',
  'soc_demo_jaffar_e_tayyar',
  'area_block_a2',
  'House A2-05',
  '5, Block A2, Sector A, Phase 1',
  'house',
  'vacant',
  '{"type":"Point","coordinates":[67.190385,24.89146]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  "addressLine" = EXCLUDED."addressLine",
  "propertyType" = EXCLUDED."propertyType",
  status = EXCLUDED.status,
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO properties (id, "societyId", "geoAreaId", label, "addressLine", "propertyType", status, "geomJson", metadata, "createdAt", "updatedAt")
VALUES (
  'prop_b1_22',
  'soc_demo_jaffar_e_tayyar',
  'area_block_b1',
  'Villa B1-22',
  '22, Block B1, Sector B, Phase 1',
  'house',
  'occupied',
  '{"type":"Point","coordinates":[67.194385,24.89226]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  "addressLine" = EXCLUDED."addressLine",
  "propertyType" = EXCLUDED."propertyType",
  status = EXCLUDED.status,
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO properties (id, "societyId", "geoAreaId", label, "addressLine", "propertyType", status, "geomJson", metadata, "createdAt", "updatedAt")
VALUES (
  'prop_b1_31',
  'soc_demo_jaffar_e_tayyar',
  'area_block_b1',
  'Apartment B1-31',
  '31-A, Block B1, Sector B, Phase 1',
  'apartment',
  'occupied',
  '{"type":"Point","coordinates":[67.195385,24.89126]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  "addressLine" = EXCLUDED."addressLine",
  "propertyType" = EXCLUDED."propertyType",
  status = EXCLUDED.status,
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO properties (id, "societyId", "geoAreaId", label, "addressLine", "propertyType", status, "geomJson", metadata, "createdAt", "updatedAt")
VALUES (
  'prop_b2_08',
  'soc_demo_jaffar_e_tayyar',
  'area_block_b2',
  'House B2-08',
  '8, Block B2, Sector B, Phase 1',
  'house',
  'under_construction',
  '{"type":"Point","coordinates":[67.198885,24.89166]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  "addressLine" = EXCLUDED."addressLine",
  "propertyType" = EXCLUDED."propertyType",
  status = EXCLUDED.status,
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO properties (id, "societyId", "geoAreaId", label, "addressLine", "propertyType", status, "geomJson", metadata, "createdAt", "updatedAt")
VALUES (
  'prop_c_44',
  'soc_demo_jaffar_e_tayyar',
  'area_sector_c',
  'Plot C-44',
  'Plot 44, Sector C, Phase 1',
  'plot',
  'vacant',
  '{"type":"Point","coordinates":[67.190885,24.88046]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  "addressLine" = EXCLUDED."addressLine",
  "propertyType" = EXCLUDED."propertyType",
  status = EXCLUDED.status,
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO properties (id, "societyId", "geoAreaId", label, "addressLine", "propertyType", status, "geomJson", metadata, "createdAt", "updatedAt")
VALUES (
  'prop_d1_09',
  'soc_demo_jaffar_e_tayyar',
  'area_block_d1',
  'House D1-09',
  '9, Block D1, Sector D, Phase 2',
  'house',
  'occupied',
  '{"type":"Point","coordinates":[67.203385,24.89196]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  "addressLine" = EXCLUDED."addressLine",
  "propertyType" = EXCLUDED."propertyType",
  status = EXCLUDED.status,
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO properties (id, "societyId", "geoAreaId", label, "addressLine", "propertyType", status, "geomJson", metadata, "createdAt", "updatedAt")
VALUES (
  'prop_d1_16',
  'soc_demo_jaffar_e_tayyar',
  'area_block_d1',
  'Commercial D1-16',
  '16, Block D1, Sector D, Phase 2',
  'commercial',
  'occupied',
  '{"type":"Point","coordinates":[67.204885,24.89246]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  "addressLine" = EXCLUDED."addressLine",
  "propertyType" = EXCLUDED."propertyType",
  status = EXCLUDED.status,
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO properties (id, "societyId", "geoAreaId", label, "addressLine", "propertyType", status, "geomJson", metadata, "createdAt", "updatedAt")
VALUES (
  'prop_e_03',
  'soc_demo_jaffar_e_tayyar',
  'area_sector_e',
  'House E-03',
  '3, Sector E, Phase 2',
  'house',
  'occupied',
  '{"type":"Point","coordinates":[67.206885,24.87996]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  "addressLine" = EXCLUDED."addressLine",
  "propertyType" = EXCLUDED."propertyType",
  status = EXCLUDED.status,
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO properties (id, "societyId", "geoAreaId", label, "addressLine", "propertyType", status, "geomJson", metadata, "createdAt", "updatedAt")
VALUES (
  'prop_e_21',
  'soc_demo_jaffar_e_tayyar',
  'area_sector_e',
  'House E-21',
  '21, Sector E, Phase 2',
  'house',
  'occupied',
  '{"type":"Point","coordinates":[67.208885,24.88146]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  "addressLine" = EXCLUDED."addressLine",
  "propertyType" = EXCLUDED."propertyType",
  status = EXCLUDED.status,
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

INSERT INTO properties (id, "societyId", "geoAreaId", label, "addressLine", "propertyType", status, "geomJson", metadata, "createdAt", "updatedAt")
VALUES (
  'prop_e_27',
  'soc_demo_jaffar_e_tayyar',
  'area_sector_e',
  'Mixed E-27',
  '27, Sector E, Phase 2',
  'mixed',
  'occupied',
  '{"type":"Point","coordinates":[67.210385,24.87896]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  "addressLine" = EXCLUDED."addressLine",
  "propertyType" = EXCLUDED."propertyType",
  status = EXCLUDED.status,
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();

COMMIT;
