/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('ACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('USER', 'PREMIUM_USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "post_type" AS ENUM ('NORMAL', 'PREMIUM');

-- CreateEnum
CREATE TYPE "vote_types" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "user_role" NOT NULL DEFAULT 'USER',
DROP COLUMN "status",
ADD COLUMN     "status" "user_status" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "postType";

-- DropEnum
DROP TYPE "userRole";

-- DropEnum
DROP TYPE "userStatus";

-- DropEnum
DROP TYPE "voteType";
