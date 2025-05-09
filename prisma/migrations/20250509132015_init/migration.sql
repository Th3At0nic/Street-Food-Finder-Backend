-- CreateEnum
CREATE TYPE "ComentActivationStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "isApproved" "ComentActivationStatus" NOT NULL DEFAULT 'PENDING';
