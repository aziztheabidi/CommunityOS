-- Milestone 4 schema: businesses ecosystem
-- Run AFTER m2-m3 bootstrap + residents seed, BEFORE seed-businesses.sql
-- Safe-ish: uses IF NOT EXISTS where possible.

DO $$
BEGIN
  IF to_regclass('public.residents') IS NULL THEN
    RAISE EXCEPTION
      'Table "residents" does not exist. Run supabase-sql-editor-m2-m3-bootstrap.sql (and seed-residents-professionals.sql) first.';
  END IF;
END $$;

DO $$ BEGIN
  CREATE TYPE "BusinessVerification" AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "BusinessVisibility" AS ENUM ('members', 'public', 'private');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "business_categories" (
    "id" TEXT NOT NULL,
    "societyId" TEXT,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "business_categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "businesses" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "categoryId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "geoAreaId" TEXT,
    "addressLine" TEXT,
    "geomJson" JSONB,
    "isResidentOwned" BOOLEAN NOT NULL DEFAULT true,
    "isHiring" BOOLEAN NOT NULL DEFAULT false,
    "offersResidentDiscount" BOOLEAN NOT NULL DEFAULT false,
    "verification" "BusinessVerification" NOT NULL DEFAULT 'unverified',
    "visibility" "BusinessVisibility" NOT NULL DEFAULT 'members',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "business_owners" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "title" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "business_owners_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "business_staff" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "roleTitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "business_staff_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "business_services" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "business_services_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "business_categories_societyId_key_key" ON "business_categories"("societyId", "key");
CREATE UNIQUE INDEX IF NOT EXISTS "businesses_societyId_slug_key" ON "businesses"("societyId", "slug");
CREATE UNIQUE INDEX IF NOT EXISTS "business_owners_businessId_residentId_key" ON "business_owners"("businessId", "residentId");
CREATE UNIQUE INDEX IF NOT EXISTS "business_staff_businessId_residentId_key" ON "business_staff"("businessId", "residentId");

CREATE INDEX IF NOT EXISTS "business_categories_sortOrder_idx" ON "business_categories"("sortOrder");
CREATE INDEX IF NOT EXISTS "businesses_societyId_categoryId_idx" ON "businesses"("societyId", "categoryId");
CREATE INDEX IF NOT EXISTS "businesses_societyId_isHiring_idx" ON "businesses"("societyId", "isHiring");
CREATE INDEX IF NOT EXISTS "business_owners_residentId_idx" ON "business_owners"("residentId");
CREATE INDEX IF NOT EXISTS "business_staff_residentId_idx" ON "business_staff"("residentId");
CREATE INDEX IF NOT EXISTS "business_services_businessId_idx" ON "business_services"("businessId");

DO $$ BEGIN
  ALTER TABLE "business_categories" ADD CONSTRAINT "business_categories_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "businesses" ADD CONSTRAINT "businesses_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "businesses" ADD CONSTRAINT "businesses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "business_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "business_owners" ADD CONSTRAINT "business_owners_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "business_owners" ADD CONSTRAINT "business_owners_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "business_staff" ADD CONSTRAINT "business_staff_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "business_staff" ADD CONSTRAINT "business_staff_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "business_services" ADD CONSTRAINT "business_services_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
