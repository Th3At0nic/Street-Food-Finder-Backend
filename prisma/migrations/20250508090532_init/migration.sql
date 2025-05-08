/*
  Warnings:

  - Added the required column `pmId` to the `user_subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID');

-- AlterTable
ALTER TABLE "user_subscriptions" ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "pmId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_pmId_fkey" FOREIGN KEY ("pmId") REFERENCES "payments"("pm_id") ON DELETE RESTRICT ON UPDATE CASCADE;
