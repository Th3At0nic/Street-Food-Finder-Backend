-- AlterTable
ALTER TABLE "subscription_plans" ADD COLUMN     "description" TEXT,
ADD COLUMN     "features" JSONB,
ADD COLUMN     "is_recommended" BOOLEAN NOT NULL DEFAULT false;
