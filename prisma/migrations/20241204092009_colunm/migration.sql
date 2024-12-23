/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`user_id`);

-- CreateTable
CREATE TABLE `Campaign` (
    `campaign_id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_name` VARCHAR(191) NOT NULL,
    `campaign_start_date` DATETIME(3) NOT NULL,
    `campaign_end_date` DATETIME(3) NOT NULL,
    `daily_limit` INTEGER NOT NULL,
    `reward_type` ENUM('Reward', 'Privilege') NOT NULL,
    `tier_requirement` ENUM('Silver', 'Gold', 'Platinum') NULL,

    PRIMARY KEY (`campaign_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ticket` (
    `ticket_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_code` VARCHAR(191) NOT NULL,
    `campaign_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,
    `status` ENUM('AVAILABLE', 'USED', 'EXPIRED') NOT NULL DEFAULT 'AVAILABLE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Ticket_ticket_code_key`(`ticket_code`),
    PRIMARY KEY (`ticket_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CampaignUser` (
    `campaign_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `used_count` INTEGER NOT NULL,

    PRIMARY KEY (`campaign_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `Campaign`(`campaign_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CampaignUser` ADD CONSTRAINT `CampaignUser_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CampaignUser` ADD CONSTRAINT `CampaignUser_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `Campaign`(`campaign_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
