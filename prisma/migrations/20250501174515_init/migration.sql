-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_approved_by_fkey";

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "approved_by" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
