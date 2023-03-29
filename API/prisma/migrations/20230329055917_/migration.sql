/*
  Warnings:

  - You are about to drop the column `endTime` on the `device_task` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `device_task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `device_task` DROP COLUMN `endTime`,
    DROP COLUMN `startTime`;
