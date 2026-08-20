/**
 * Seed Jaffar-e-Tayyar Society demo into Postgres once Supabase/PostGIS is connected.
 * Usage: pnpm --filter @communityos/database seed
 */
import { prisma, DEMO_SOCIETY } from "./index.js";

async function main() {
  const society = await prisma.society.upsert({
    where: { slug: DEMO_SOCIETY.society.slug },
    create: {
      id: DEMO_SOCIETY.society.id,
      slug: DEMO_SOCIETY.society.slug,
      name: DEMO_SOCIETY.society.name,
      timezone: DEMO_SOCIETY.society.timezone,
      settings: {
        create: {
          heatmapMinBucketSize: DEMO_SOCIETY.settings.heatmapMinBucketSize,
          branding: DEMO_SOCIETY.settings.branding,
        },
      },
    },
    update: {
      name: DEMO_SOCIETY.society.name,
      timezone: DEMO_SOCIETY.society.timezone,
    },
  });

  for (const level of DEMO_SOCIETY.levels) {
    await prisma.geoLevelDefinition.upsert({
      where: {
        societyId_key: { societyId: society.id, key: level.key },
      },
      create: {
        societyId: society.id,
        key: level.key,
        label: level.label,
        sortOrder: level.sortOrder,
      },
      update: {
        label: level.label,
        sortOrder: level.sortOrder,
      },
    });
  }

  for (const area of DEMO_SOCIETY.areas) {
    await prisma.geoArea.upsert({
      where: { id: area.id },
      create: {
        id: area.id,
        societyId: society.id,
        levelKey: area.levelKey,
        parentId: area.parentId,
        name: area.name,
        code: area.code,
        sortOrder: area.sortOrder,
        geomJson: area.geomJson,
        centroidJson: area.centroidJson,
        metadata: {
          residentEstimate: area.residentEstimate,
          householdEstimate: area.householdEstimate,
        },
      },
      update: {
        name: area.name,
        code: area.code,
        parentId: area.parentId,
        geomJson: area.geomJson,
        centroidJson: area.centroidJson,
        metadata: {
          residentEstimate: area.residentEstimate,
          householdEstimate: area.householdEstimate,
        },
      },
    });
  }

  for (const feature of DEMO_SOCIETY.features) {
    await prisma.geoFeature.upsert({
      where: { id: feature.id },
      create: {
        id: feature.id,
        societyId: society.id,
        featureType: feature.featureType as never,
        name: feature.name,
        description: feature.description,
        geomJson: feature.geomJson,
      },
      update: {
        name: feature.name,
        description: feature.description,
        geomJson: feature.geomJson,
        featureType: feature.featureType as never,
      },
    });
  }

  for (const property of DEMO_SOCIETY.properties) {
    await prisma.property.upsert({
      where: { id: property.id },
      create: {
        id: property.id,
        societyId: society.id,
        geoAreaId: property.geoAreaId,
        label: property.label,
        addressLine: property.addressLine,
        propertyType: property.propertyType as never,
        status: property.status as never,
        geomJson: property.geomJson,
      },
      update: {
        label: property.label,
        addressLine: property.addressLine,
        geoAreaId: property.geoAreaId,
        propertyType: property.propertyType as never,
        status: property.status as never,
        geomJson: property.geomJson,
      },
    });
  }

  console.log(`Seeded ${society.name} (${society.slug})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
