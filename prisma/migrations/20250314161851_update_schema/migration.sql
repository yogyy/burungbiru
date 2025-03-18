/*
  Warnings:

  - You are about to drop the column `authorParentId` on the `burbir_post` table. All the data in the column will be lost.
  - You are about to drop the column `view` on the `burbir_post` table. All the data in the column will be lost.
  - You are about to alter the column `username` on the `burbir_user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - A unique constraint covering the columns `[userId,postId]` on the table `burbir_bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[followerId,followingId]` on the table `burbir_follow` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId]` on the table `burbir_like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId]` on the table `burbir_reply` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId]` on the table `burbir_repost` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "burbir_reply" DROP CONSTRAINT "burbir_reply_parentId_fkey";

-- DropIndex
DROP INDEX "burbir_post_authorId_id_idx";

-- DropIndex
DROP INDEX "burbir_reply_userId_idx";

-- AlterTable
ALTER TABLE "burbir_follow" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "burbir_post" DROP COLUMN "authorParentId",
DROP COLUMN "view",
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "burbir_user" ALTER COLUMN "username" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "email" DROP DEFAULT,
ALTER COLUMN "emailVerified" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "burbir_bookmark_userId_postId_key" ON "burbir_bookmark"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "burbir_follow_followerId_followingId_key" ON "burbir_follow"("followerId", "followingId");

-- CreateIndex/
CREATE UNIQUE INDEX "burbir_like_userId_postId_key" ON "burbir_like"("userId", "postId");

-- CreateIndex
CREATE INDEX "burbir_post_authorId_idx" ON "burbir_post"("authorId");

-- CreateIndex
CREATE INDEX "burbir_post_type_idx" ON "burbir_post"("type");

-- CreateIndex
CREATE INDEX "burbir_reply_parentId_idx" ON "burbir_reply"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "burbir_reply_userId_postId_key" ON "burbir_reply"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "burbir_repost_userId_postId_key" ON "burbir_repost"("userId", "postId");

-- AddForeignKey
ALTER TABLE "burbir_post" ADD CONSTRAINT "burbir_post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "burbir_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "burbir_post" ADD CONSTRAINT "burbir_post_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "burbir_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "burbir_repost" ADD CONSTRAINT "burbir_repost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "burbir_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "burbir_reply" ADD CONSTRAINT "burbir_reply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "burbir_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "burbir_reply" ADD CONSTRAINT "burbir_reply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "burbir_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "burbir_like" ADD CONSTRAINT "burbir_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "burbir_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "burbir_bookmark" ADD CONSTRAINT "burbir_bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "burbir_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
