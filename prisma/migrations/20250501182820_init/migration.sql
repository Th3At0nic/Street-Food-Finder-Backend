-- CreateTable
CREATE TABLE "post_ratings" (
    "pr_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "rated_by" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_ratings_pkey" PRIMARY KEY ("pr_id")
);

-- AddForeignKey
ALTER TABLE "post_ratings" ADD CONSTRAINT "post_ratings_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("p_id") ON DELETE RESTRICT ON UPDATE CASCADE;
