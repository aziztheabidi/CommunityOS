-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('house', 'apartment', 'plot', 'commercial', 'mixed', 'vacant');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('occupied', 'vacant', 'under_construction', 'unknown');

-- CreateEnum
CREATE TYPE "GeoFeatureType" AS ENUM ('amenity', 'park', 'school', 'place_of_worship', 'medical', 'commercial', 'office', 'gate', 'community_center', 'security', 'other');

-- CreateTable
CREATE TABLE "geo_level_definitions" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geo_level_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo_areas" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "levelKey" TEXT NOT NULL,
    "parentId" TEXT,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "geomJson" JSONB,
    "centroidJson" JSONB,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geo_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streets" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "geoAreaId" TEXT,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "geomJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "streets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plots" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "geoAreaId" TEXT,
    "streetId" TEXT,
    "plotNumber" TEXT NOT NULL,
    "geomJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "geoAreaId" TEXT,
    "plotId" TEXT,
    "streetId" TEXT,
    "label" TEXT NOT NULL,
    "addressLine" TEXT,
    "propertyType" "PropertyType" NOT NULL DEFAULT 'house',
    "status" "PropertyStatus" NOT NULL DEFAULT 'unknown',
    "geomJson" JSONB,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo_features" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "featureType" "GeoFeatureType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "geomJson" JSONB,
    "properties" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geo_features_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "geo_level_definitions_societyId_sortOrder_idx" ON "geo_level_definitions"("societyId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "geo_level_definitions_societyId_key_key" ON "geo_level_definitions"("societyId", "key");

-- CreateIndex
CREATE INDEX "geo_areas_societyId_levelKey_idx" ON "geo_areas"("societyId", "levelKey");

-- CreateIndex
CREATE INDEX "geo_areas_societyId_parentId_idx" ON "geo_areas"("societyId", "parentId");

-- CreateIndex
CREATE INDEX "geo_areas_societyId_code_idx" ON "geo_areas"("societyId", "code");

-- CreateIndex
CREATE INDEX "streets_societyId_idx" ON "streets"("societyId");

-- CreateIndex
CREATE INDEX "streets_geoAreaId_idx" ON "streets"("geoAreaId");

-- CreateIndex
CREATE INDEX "plots_societyId_geoAreaId_idx" ON "plots"("societyId", "geoAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "plots_societyId_plotNumber_key" ON "plots"("societyId", "plotNumber");

-- CreateIndex
CREATE INDEX "properties_societyId_propertyType_idx" ON "properties"("societyId", "propertyType");

-- CreateIndex
CREATE INDEX "properties_societyId_status_idx" ON "properties"("societyId", "status");

-- CreateIndex
CREATE INDEX "properties_societyId_geoAreaId_idx" ON "properties"("societyId", "geoAreaId");

-- CreateIndex
CREATE INDEX "geo_features_societyId_featureType_idx" ON "geo_features"("societyId", "featureType");

-- AddForeignKey
ALTER TABLE "geo_level_definitions" ADD CONSTRAINT "geo_level_definitions_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo_areas" ADD CONSTRAINT "geo_areas_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo_areas" ADD CONSTRAINT "geo_areas_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "geo_areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streets" ADD CONSTRAINT "streets_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streets" ADD CONSTRAINT "streets_geoAreaId_fkey" FOREIGN KEY ("geoAreaId") REFERENCES "geo_areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plots" ADD CONSTRAINT "plots_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plots" ADD CONSTRAINT "plots_geoAreaId_fkey" FOREIGN KEY ("geoAreaId") REFERENCES "geo_areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plots" ADD CONSTRAINT "plots_streetId_fkey" FOREIGN KEY ("streetId") REFERENCES "streets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_geoAreaId_fkey" FOREIGN KEY ("geoAreaId") REFERENCES "geo_areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_plotId_fkey" FOREIGN KEY ("plotId") REFERENCES "plots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_streetId_fkey" FOREIGN KEY ("streetId") REFERENCES "streets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo_features" ADD CONSTRAINT "geo_features_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
