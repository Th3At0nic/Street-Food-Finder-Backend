-- DropForeignKey
ALTER TABLE "user_subscriptions" DROP CONSTRAINT "user_subscriptions_pmId_fkey";

-- AlterTable
ALTER TABLE "user_subscriptions" ALTER COLUMN "pmId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_pmId_fkey" FOREIGN KEY ("pmId") REFERENCES "payments"("pm_id") ON DELETE SET NULL ON UPDATE CASCADE;
