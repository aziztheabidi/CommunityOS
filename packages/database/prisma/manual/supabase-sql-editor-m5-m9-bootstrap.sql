-- Milestone 5–9 schema: connections, feed, events, opportunities
--
-- REQUIRED ORDER (do not skip):
--   1) supabase-sql-editor-bootstrap.sql
--   2) supabase-sql-editor-seed-jaffar-e-tayyar.sql
--   3) supabase-sql-editor-m2-m3-bootstrap.sql   ← creates "residents"
--   4) supabase-sql-editor-seed-residents-professionals.sql
--   5) supabase-sql-editor-m4-bootstrap.sql      (recommended before community seed)
--   6) supabase-sql-editor-seed-businesses.sql
--   7) THIS FILE
--   8) supabase-sql-editor-seed-community-life.sql

DO $$
BEGIN
  IF to_regclass('public.residents') IS NULL THEN
    RAISE EXCEPTION
      'Table "residents" does not exist. Run supabase-sql-editor-m2-m3-bootstrap.sql first (then seed-residents-professionals.sql), then re-run this file.';
  END IF;
END $$;

DO $$ BEGIN CREATE TYPE "ConnectionStatus" AS ENUM ('pending', 'accepted', 'declined', 'blocked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "PostKind" AS ENUM ('update', 'announcement', 'question', 'opportunity_share');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "EventRsvpStatus" AS ENUM ('going', 'interested', 'waitlist', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "OpportunityKind" AS ENUM ('job', 'internship', 'freelance', 'volunteer', 'mentorship', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "OpportunityStatus" AS ENUM ('open', 'closed', 'filled', 'draft');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "connections" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "fromResidentId" TEXT NOT NULL,
    "toResidentId" TEXT NOT NULL,
    "status" "ConnectionStatus" NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "connections_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "posts" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "kind" "PostKind" NOT NULL DEFAULT 'update',
    "body" TEXT NOT NULL,
    "geoAreaId" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "reactions" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '👍',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "comments" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "events" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "hostId" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "locationName" TEXT,
    "geoAreaId" TEXT,
    "geomJson" JSONB,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "capacity" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "event_rsvps" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "status" "EventRsvpStatus" NOT NULL DEFAULT 'going',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "event_rsvps_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "opportunities" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "posterId" TEXT,
    "kind" "OpportunityKind" NOT NULL DEFAULT 'other',
    "status" "OpportunityStatus" NOT NULL DEFAULT 'open',
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "geoAreaId" TEXT,
    "isRemoteOk" BOOLEAN NOT NULL DEFAULT false,
    "compensation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closesAt" TIMESTAMP(3),
    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "opportunity_applications" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "opportunity_applications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "connections_societyId_fromResidentId_toResidentId_key" ON "connections"("societyId", "fromResidentId", "toResidentId");
CREATE UNIQUE INDEX IF NOT EXISTS "reactions_postId_residentId_emoji_key" ON "reactions"("postId", "residentId", "emoji");
CREATE UNIQUE INDEX IF NOT EXISTS "event_rsvps_eventId_residentId_key" ON "event_rsvps"("eventId", "residentId");
CREATE UNIQUE INDEX IF NOT EXISTS "opportunity_applications_opportunityId_residentId_key" ON "opportunity_applications"("opportunityId", "residentId");

CREATE INDEX IF NOT EXISTS "connections_societyId_status_idx" ON "connections"("societyId", "status");
CREATE INDEX IF NOT EXISTS "connections_toResidentId_status_idx" ON "connections"("toResidentId", "status");
CREATE INDEX IF NOT EXISTS "posts_societyId_createdAt_idx" ON "posts"("societyId", "createdAt");
CREATE INDEX IF NOT EXISTS "posts_authorId_idx" ON "posts"("authorId");
CREATE INDEX IF NOT EXISTS "reactions_residentId_idx" ON "reactions"("residentId");
CREATE INDEX IF NOT EXISTS "comments_postId_createdAt_idx" ON "comments"("postId", "createdAt");
CREATE INDEX IF NOT EXISTS "events_societyId_startsAt_idx" ON "events"("societyId", "startsAt");
CREATE INDEX IF NOT EXISTS "opportunities_societyId_status_kind_idx" ON "opportunities"("societyId", "status", "kind");

DO $$ BEGIN ALTER TABLE "connections" ADD CONSTRAINT "connections_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "connections" ADD CONSTRAINT "connections_fromResidentId_fkey" FOREIGN KEY ("fromResidentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "connections" ADD CONSTRAINT "connections_toResidentId_fkey" FOREIGN KEY ("toResidentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "posts" ADD CONSTRAINT "posts_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "reactions" ADD CONSTRAINT "reactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "reactions" ADD CONSTRAINT "reactions_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "events" ADD CONSTRAINT "events_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "events" ADD CONSTRAINT "events_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "residents"("id") ON DELETE SET NULL ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_posterId_fkey" FOREIGN KEY ("posterId") REFERENCES "residents"("id") ON DELETE SET NULL ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "opportunity_applications" ADD CONSTRAINT "opportunity_applications_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "opportunity_applications" ADD CONSTRAINT "opportunity_applications_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
