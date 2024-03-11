/*
  Warnings:

  - You are about to drop the `Bookmark` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Follow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Repost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Bookmark";

-- DropTable
DROP TABLE "Follow";

-- DropTable
DROP TABLE "Like";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Reply";

-- DropTable
DROP TABLE "Repost";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "burbir_user" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "username" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "bannerUrl" TEXT,
    "bio" VARCHAR(160),
    "location" VARCHAR(30),
    "website" VARCHAR(100),
    "birthDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "UserType" NOT NULL DEFAULT 'user',

    CONSTRAINT "burbir_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "burbir_follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "burbir_follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "burbir_post" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" VARCHAR(255) NOT NULL,
    "image" TEXT,
    "imageId" TEXT,
    "authorId" TEXT NOT NULL,
    "parentId" TEXT,
    "authorParentId" TEXT,
    "type" "PostType" NOT NULL DEFAULT 'POST',
    "view" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "burbir_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "burbir_repost" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "burbir_repost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "burbir_reply" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "burbir_reply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "burbir_like" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "burbir_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "burbir_bookmark" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "burbir_bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "burbir_user_id_key" ON "burbir_user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "burbir_user_username_key" ON "burbir_user"("username");

-- CreateIndex
CREATE INDEX "burbir_user_id_username_idx" ON "burbir_user"("id", "username");

-- CreateIndex
CREATE INDEX "burbir_follow_followerId_idx" ON "burbir_follow"("followerId");

-- CreateIndex
CREATE INDEX "burbir_follow_followingId_idx" ON "burbir_follow"("followingId");

-- CreateIndex
CREATE INDEX "burbir_post_authorId_id_idx" ON "burbir_post"("authorId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "burbir_post_createdAt_id_key" ON "burbir_post"("createdAt", "id");

-- CreateIndex
CREATE INDEX "burbir_repost_postId_idx" ON "burbir_repost"("postId");

-- CreateIndex
CREATE INDEX "burbir_reply_userId_idx" ON "burbir_reply"("userId");

-- CreateIndex
CREATE INDEX "burbir_reply_parentId_idx" ON "burbir_reply"("parentId");

-- CreateIndex
CREATE INDEX "burbir_like_userId_idx" ON "burbir_like"("userId");

-- CreateIndex
CREATE INDEX "burbir_like_postId_idx" ON "burbir_like"("postId");

-- CreateIndex
CREATE INDEX "burbir_bookmark_postId_idx" ON "burbir_bookmark"("postId");

-- CreateIndex
CREATE INDEX "burbir_bookmark_userId_idx" ON "burbir_bookmark"("userId");
