/*
  Warnings:

  - You are about to drop the `Votes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Votes";

-- CreateTable
CREATE TABLE "votes" (
    "v_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "voter_id" TEXT NOT NULL,
    "v_type" "vote_types" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("v_id")
);

-- CreateTable
CREATE TABLE "comments" (
    "c_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "commenter_id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("c_id")
);

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("p_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_voter_id_fkey" FOREIGN KEY ("voter_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("p_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_commenter_id_fkey" FOREIGN KEY ("commenter_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
