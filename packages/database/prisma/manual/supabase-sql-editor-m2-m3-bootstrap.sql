-- Milestone 2 + 3 schema: households, residents, professions, skills
-- Run AFTER bootstrap.sql + seed-jaffar-e-tayyar.sql (societies/properties must exist).
-- Then run seed-residents-professionals.sql.

DO $$
BEGIN
  IF to_regclass('public.societies') IS NULL THEN
    RAISE EXCEPTION
      'Table "societies" does not exist. Run supabase-sql-editor-bootstrap.sql first.';
  END IF;
END $$;

CREATE TYPE "OccupancyKind" AS ENUM ('owner_occupied', 'rented', 'vacant', 'other');
CREATE TYPE "ResidentStatus" AS ENUM ('active', 'inactive', 'pending', 'moved_out');
CREATE TYPE "VisibilityLevel" AS ENUM ('private', 'household', 'connections', 'members', 'society_admin', 'public');
CREATE TYPE "EmploymentStatus" AS ENUM ('employed', 'self_employed', 'freelancing', 'student', 'retired', 'looking_for_work', 'not_specified');

CREATE TABLE "households" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "propertyId" TEXT,
    "label" TEXT,
    "primaryResidentId" TEXT,
    "householdSize" INTEGER NOT NULL DEFAULT 1,
    "moveInDate" TIMESTAMP(3),
    "moveOutDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "households_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "property_occupancies" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "householdId" TEXT,
    "kind" "OccupancyKind" NOT NULL DEFAULT 'owner_occupied',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "property_occupancies_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "residents" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "platformUserId" TEXT,
    "fullName" TEXT NOT NULL,
    "preferredName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "status" "ResidentStatus" NOT NULL DEFAULT 'active',
    "geoAreaId" TEXT,
    "headline" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "employmentStatus" "EmploymentStatus" NOT NULL DEFAULT 'not_specified',
    "yearsExperience" INTEGER,
    "openToNetworking" BOOLEAN NOT NULL DEFAULT true,
    "openToMentoring" BOOLEAN NOT NULL DEFAULT false,
    "lookingForWork" BOOLEAN NOT NULL DEFAULT false,
    "openToConsulting" BOOLEAN NOT NULL DEFAULT false,
    "openToFreelance" BOOLEAN NOT NULL DEFAULT false,
    "hiring" BOOLEAN NOT NULL DEFAULT false,
    "volunteerAvail" BOOLEAN NOT NULL DEFAULT false,
    "profileCompleteness" INTEGER NOT NULL DEFAULT 0,
    "lastVerifiedAt" TIMESTAMP(3),
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "residents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "household_members" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "household_members_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "resident_privacy_settings" (
    "id" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "phoneVisibility" "VisibilityLevel" NOT NULL DEFAULT 'connections',
    "emailVisibility" "VisibilityLevel" NOT NULL DEFAULT 'connections',
    "addressVisibility" "VisibilityLevel" NOT NULL DEFAULT 'society_admin',
    "professionVisibility" "VisibilityLevel" NOT NULL DEFAULT 'members',
    "skillsVisibility" "VisibilityLevel" NOT NULL DEFAULT 'members',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "resident_privacy_settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "dependents" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "ageBand" TEXT NOT NULL,
    "educationStage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "dependents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "professional_categories" (
    "id" TEXT NOT NULL,
    "societyId" TEXT,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "professional_categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "professions" (
    "id" TEXT NOT NULL,
    "societyId" TEXT,
    "categoryId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "professions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "resident_professions" (
    "id" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "professionId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "resident_professions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "societyId" TEXT,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "resident_skills" (
    "id" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "resident_skills_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "employment_records" (
    "id" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "employer" TEXT,
    "jobTitle" TEXT NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "startYear" INTEGER,
    "endYear" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "employment_records_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "household_members_householdId_residentId_key" ON "household_members"("householdId", "residentId");
CREATE UNIQUE INDEX "resident_privacy_settings_residentId_key" ON "resident_privacy_settings"("residentId");
CREATE UNIQUE INDEX "professional_categories_societyId_key_key" ON "professional_categories"("societyId", "key");
CREATE UNIQUE INDEX "professions_societyId_key_key" ON "professions"("societyId", "key");
CREATE UNIQUE INDEX "resident_professions_residentId_professionId_key" ON "resident_professions"("residentId", "professionId");
CREATE UNIQUE INDEX "skills_societyId_key_key" ON "skills"("societyId", "key");
CREATE UNIQUE INDEX "resident_skills_residentId_skillId_key" ON "resident_skills"("residentId", "skillId");

CREATE INDEX "households_societyId_idx" ON "households"("societyId");
CREATE INDEX "households_propertyId_idx" ON "households"("propertyId");
CREATE INDEX "property_occupancies_societyId_propertyId_idx" ON "property_occupancies"("societyId", "propertyId");
CREATE INDEX "residents_societyId_status_idx" ON "residents"("societyId", "status");
CREATE INDEX "residents_societyId_fullName_idx" ON "residents"("societyId", "fullName");
CREATE INDEX "dependents_societyId_householdId_idx" ON "dependents"("societyId", "householdId");
CREATE INDEX "professions_categoryId_idx" ON "professions"("categoryId");
CREATE INDEX "resident_professions_professionId_idx" ON "resident_professions"("professionId");
CREATE INDEX "resident_skills_skillId_idx" ON "resident_skills"("skillId");
CREATE INDEX "employment_records_residentId_isCurrent_idx" ON "employment_records"("residentId", "isCurrent");

ALTER TABLE "households" ADD CONSTRAINT "households_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "property_occupancies" ADD CONSTRAINT "property_occupancies_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "property_occupancies" ADD CONSTRAINT "property_occupancies_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "residents" ADD CONSTRAINT "residents_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "household_members" ADD CONSTRAINT "household_members_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "household_members" ADD CONSTRAINT "household_members_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "resident_privacy_settings" ADD CONSTRAINT "resident_privacy_settings_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "dependents" ADD CONSTRAINT "dependents_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "professional_categories" ADD CONSTRAINT "professional_categories_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "professions" ADD CONSTRAINT "professions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "professional_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "professions" ADD CONSTRAINT "professions_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "resident_professions" ADD CONSTRAINT "resident_professions_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "resident_professions" ADD CONSTRAINT "resident_professions_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "professions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "skills" ADD CONSTRAINT "skills_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "resident_skills" ADD CONSTRAINT "resident_skills_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "resident_skills" ADD CONSTRAINT "resident_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "employment_records" ADD CONSTRAINT "employment_records_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
