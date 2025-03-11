/*
  Warnings:

  - You are about to drop the column `bannerUrl` on the `burbir_user` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `burbir_user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `burbir_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `burbir_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailVerified` to the `burbir_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "burbir_bookmark_postId_idx";

-- DropIndex
DROP INDEX "burbir_follow_followerId_idx";

-- DropIndex
DROP INDEX "burbir_follow_followingId_idx";

-- DropIndex
DROP INDEX "burbir_like_postId_idx";

-- DropIndex
DROP INDEX "burbir_reply_parentId_idx";

-- DropIndex
DROP INDEX "burbir_repost_postId_idx";

-- AlterTable
ALTER TABLE "burbir_user" RENAME COLUMN "bannerUrl" TO "banner";

ALTER TABLE "burbir_user" RENAME COLUMN "imageUrl" TO "image";

ALTER TABLE "burbir_user" ALTER COLUMN "image" DROP NOT NULL;

ALTER TABLE "burbir_user" ADD COLUMN "email" TEXT NOT NULL DEFAULT '';

ALTER TABLE "burbir_user" ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "burbir_user" ADD COLUMN "usernameSet" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "burbir_user" ALTER COLUMN "createdAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "burbir_session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "burbir_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "burbir_account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "burbir_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "burbir_verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "burbir_verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "burbir_session_token_key" ON "burbir_session"("token");

-- CreateIndex TODO
CREATE UNIQUE INDEX "burbir_user_email_key" ON "burbir_user"("email");

-- AddForeignKey
ALTER TABLE "burbir_session" ADD CONSTRAINT "burbir_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "burbir_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "burbir_account" ADD CONSTRAINT "burbir_account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "burbir_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "burbir_follow" ADD CONSTRAINT "burbir_follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "burbir_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "burbir_follow" ADD CONSTRAINT "burbir_follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "burbir_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "burbir_repost" ADD CONSTRAINT "burbir_repost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "burbir_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "burbir_reply" ADD CONSTRAINT "burbir_reply_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "burbir_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "burbir_like" ADD CONSTRAINT "burbir_like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "burbir_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "burbir_bookmark" ADD CONSTRAINT "burbir_bookmark_postId_fkey" FOREIGN KEY ("postId") REFERENCES "burbir_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
