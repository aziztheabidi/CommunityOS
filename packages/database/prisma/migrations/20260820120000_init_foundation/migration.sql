-- Enable PostGIS for Society Intelligence Map (Milestone 1+)
CREATE EXTENSION IF NOT EXISTS postgis;

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('active', 'invited', 'suspended', 'left');

-- CreateTable
CREATE TABLE "platform_users" (
    "id" TEXT NOT NULL,
    "authSubject" TEXT NOT NULL,
    "email" TEXT,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "societies" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "societies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "society_settings" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "heatmapMinBucketSize" INTEGER NOT NULL DEFAULT 5,
    "featureFlags" JSONB NOT NULL DEFAULT '{}',
    "branding" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "society_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "society_memberships" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleKey" TEXT NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'invited',
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "geoAreaIds" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "society_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "platform_users_authSubject_key" ON "platform_users"("authSubject");

-- CreateIndex
CREATE UNIQUE INDEX "platform_users_email_key" ON "platform_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "societies_slug_key" ON "societies"("slug");

-- CreateIndex
CREATE INDEX "societies_isActive_idx" ON "societies"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "society_settings_societyId_key" ON "society_settings"("societyId");

-- CreateIndex
CREATE INDEX "society_memberships_societyId_status_idx" ON "society_memberships"("societyId", "status");

-- CreateIndex
CREATE INDEX "society_memberships_userId_idx" ON "society_memberships"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "society_memberships_societyId_userId_key" ON "society_memberships"("societyId", "userId");

-- AddForeignKey
ALTER TABLE "society_settings" ADD CONSTRAINT "society_settings_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_memberships" ADD CONSTRAINT "society_memberships_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_memberships" ADD CONSTRAINT "society_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "platform_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
