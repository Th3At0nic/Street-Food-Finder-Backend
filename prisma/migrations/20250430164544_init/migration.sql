-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('USER', 'PREMIUM_USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "postType" AS ENUM ('NORMAL', 'PREMIUM');

-- CreateEnum
CREATE TYPE "voteType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "userRole" NOT NULL DEFAULT 'USER',
    "password" TEXT NOT NULL,
    "needs_password_change" BOOLEAN NOT NULL DEFAULT false,
    "status" "userStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
