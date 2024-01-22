/*
  Warnings:

  - You are about to alter the column `flowRate` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Task` MODIFY `flowRate` DOUBLE NOT NULL;
