/*
  Warnings:

  - The values [UNPAID] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PAID', 'PENDING');
ALTER TABLE "user_subscriptions" ALTER COLUMN "payment_status" DROP DEFAULT;
ALTER TABLE "user_subscriptions" ALTER COLUMN "payment_status" TYPE "PaymentStatus_new" USING ("payment_status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "user_subscriptions" ALTER COLUMN "payment_status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "user_subscriptions" ALTER COLUMN "payment_status" SET DEFAULT 'PENDING';
