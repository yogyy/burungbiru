-- DropIndex
DROP INDEX `Bookmark_postId_idx` ON `bookmark`;

-- DropIndex
DROP INDEX `Like_postId_idx` ON `like`;

-- DropIndex
DROP INDEX `Post_authorId_idx` ON `post`;

-- CreateTable
CREATE TABLE `Repost` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,

    INDEX `Repost_postId_userId_idx`(`postId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reply` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `content` VARCHAR(255) NOT NULL,
    `image` VARCHAR(191) NULL,
    `imageId` VARCHAR(191) NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,

    INDEX `Reply_postId_authorId_idx`(`postId`, `authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Bookmark_postId_userId_idx` ON `Bookmark`(`postId`, `userId`);

-- CreateIndex
CREATE INDEX `Like_postId_userId_idx` ON `Like`(`postId`, `userId`);

-- CreateIndex
CREATE INDEX `Post_id_authorId_idx` ON `Post`(`id`, `authorId`);
