import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DEMO_SOCIETY } from "./demo/green-valley.js";

const here = dirname(fileURLToPath(import.meta.url));
const outPath = join(here, "..", "prisma", "manual", "supabase-sql-editor-seed-jaffar-e-tayyar.sql");

function sqlJson(value: unknown): string {
  return JSON.stringify(value).replace(/'/g, "''");
}

function sqlText(value: string): string {
  return value.replace(/'/g, "''");
}

const society = DEMO_SOCIETY.society;
const lines: string[] = [
  "-- Seed: Jaffar-e-Tayyar Society",
  "-- Paste into Supabase SQL Editor on the CommunityOS project only.",
  "-- Safe to re-run (upserts / ON CONFLICT).",
  "BEGIN;",
  "",
  `INSERT INTO societies (id, slug, name, timezone, "isActive", "createdAt", "updatedAt")
VALUES ('${society.id}', '${society.slug}', '${sqlText(society.name)}', '${society.timezone}', true, now(), now())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  timezone = EXCLUDED.timezone,
  "updatedAt" = now();`,
  "",
  `INSERT INTO society_settings (id, "societyId", "heatmapMinBucketSize", "featureFlags", branding, "createdAt", "updatedAt")
VALUES (
  'settings_${society.id}',
  '${society.id}',
  ${DEMO_SOCIETY.settings.heatmapMinBucketSize},
  '{}'::jsonb,
  '${sqlJson(DEMO_SOCIETY.settings.branding)}'::jsonb,
  now(),
  now()
)
ON CONFLICT ("societyId") DO UPDATE SET
  branding = EXCLUDED.branding,
  "heatmapMinBucketSize" = EXCLUDED."heatmapMinBucketSize",
  "updatedAt" = now();`,
  "",
];

for (const level of DEMO_SOCIETY.levels) {
  lines.push(`INSERT INTO geo_level_definitions (id, "societyId", key, label, "sortOrder", "createdAt", "updatedAt")
VALUES ('level_${society.id}_${level.key}', '${society.id}', '${level.key}', '${sqlText(level.label)}', ${level.sortOrder}, now(), now())
ON CONFLICT ("societyId", key) DO UPDATE SET
  label = EXCLUDED.label,
  "sortOrder" = EXCLUDED."sortOrder",
  "updatedAt" = now();`);
  lines.push("");
}

const orderedAreas = [...DEMO_SOCIETY.areas].sort((a, b) => {
  const rank = (key: string) => (key === "phase" ? 0 : key === "sector" ? 1 : 2);
  return rank(a.levelKey) - rank(b.levelKey) || a.sortOrder - b.sortOrder;
});

for (const area of orderedAreas) {
  const parent = area.parentId ? `'${area.parentId}'` : "NULL";
  const meta = sqlJson({
    residentEstimate: area.residentEstimate,
    householdEstimate: area.householdEstimate,
  });
  lines.push(`INSERT INTO geo_areas (id, "societyId", "levelKey", "parentId", name, code, "sortOrder", "geomJson", "centroidJson", metadata, "createdAt", "updatedAt")
VALUES (
  '${area.id}',
  '${society.id}',
  '${area.levelKey}',
  ${parent},
  '${sqlText(area.name)}',
  '${sqlText(area.code)}',
  ${area.sortOrder},
  '${sqlJson(area.geomJson)}'::jsonb,
  '${sqlJson(area.centroidJson)}'::jsonb,
  '${meta}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "parentId" = EXCLUDED."parentId",
  "geomJson" = EXCLUDED."geomJson",
  "centroidJson" = EXCLUDED."centroidJson",
  metadata = EXCLUDED.metadata,
  "updatedAt" = now();`);
  lines.push("");
}

for (const feature of DEMO_SOCIETY.features) {
  lines.push(`INSERT INTO geo_features (id, "societyId", "featureType", name, description, "geomJson", properties, "createdAt", "updatedAt")
VALUES (
  '${feature.id}',
  '${society.id}',
  '${feature.featureType}',
  '${sqlText(feature.name)}',
  '${sqlText(feature.description)}',
  '${sqlJson(feature.geomJson)}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "featureType" = EXCLUDED."featureType",
  "geomJson" = EXCLUDED."geomJson",
  "updatedAt" = now();`);
  lines.push("");
}

for (const property of DEMO_SOCIETY.properties) {
  lines.push(`INSERT INTO properties (id, "societyId", "geoAreaId", label, "addressLine", "propertyType", status, "geomJson", metadata, "createdAt", "updatedAt")
VALUES (
  '${property.id}',
  '${society.id}',
  '${property.geoAreaId}',
  '${sqlText(property.label)}',
  '${sqlText(property.addressLine)}',
  '${property.propertyType}',
  '${property.status}',
  '${sqlJson(property.geomJson)}'::jsonb,
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
  "updatedAt" = now();`);
  lines.push("");
}

lines.push("COMMIT;");

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${outPath}`);
