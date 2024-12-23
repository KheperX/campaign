/*
  Warnings:

  - You are about to drop the column `reward_type` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Campaign` DROP COLUMN `reward_type`,
    ADD COLUMN `campaign_type` ENUM('Reward', 'Privilege') NULL DEFAULT 'Reward';
