/*
  Warnings:

  - A unique constraint covering the columns `[post_id,voter_id]` on the table `votes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "votes_post_id_voter_id_key" ON "votes"("post_id", "voter_id");
