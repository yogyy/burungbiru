-- DropIndex
DROP INDEX `Bookmark_postId_userId_idx` ON `bookmark`;

-- DropIndex
DROP INDEX `Like_postId_userId_idx` ON `like`;

-- DropIndex
DROP INDEX `Post_id_authorId_idx` ON `post`;

-- AlterTable
ALTER TABLE `bookmark` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `like` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `post` ADD COLUMN `type` ENUM('POST', 'REPOST', 'COMMENT') NOT NULL DEFAULT 'POST',
    ADD COLUMN `view` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `repost` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` CHAR(50) NOT NULL,
    `username` CHAR(15) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `bannerUrl` VARCHAR(191) NULL,
    `bio` CHAR(160) NULL,
    `location` CHAR(30) NULL,
    `website` CHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_username_key`(`username`),
    INDEX `User_id_username_idx`(`id`, `username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Follow` (
    `id` VARCHAR(191) NOT NULL,
    `followerId` VARCHAR(191) NOT NULL,
    `followingId` VARCHAR(191) NOT NULL,

    INDEX `Follow_followerId_idx`(`followerId`),
    INDEX `Follow_followingId_idx`(`followingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Bookmark_postId_idx` ON `Bookmark`(`postId`);

-- CreateIndex
CREATE INDEX `Bookmark_userId_idx` ON `Bookmark`(`userId`);

-- CreateIndex
CREATE INDEX `Like_userId_idx` ON `Like`(`userId`);

-- CreateIndex
CREATE INDEX `Like_postId_idx` ON `Like`(`postId`);

-- CreateIndex
CREATE INDEX `Post_authorId_id_idx` ON `Post`(`authorId`, `id`);
