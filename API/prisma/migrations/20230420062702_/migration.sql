/*
  Warnings:

  - Made the column `deviceId` on table `Log` required. This step will fail if there are existing NULL values in that column.
  - Made the column `taskId` on table `Log` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Log` DROP FOREIGN KEY `Log_deviceId_fkey`;

-- DropForeignKey
ALTER TABLE `Log` DROP FOREIGN KEY `Log_taskId_fkey`;

-- AlterTable
ALTER TABLE `Log` MODIFY `deviceId` VARCHAR(191) NOT NULL,
    MODIFY `taskId` INTEGER NOT NULL;
