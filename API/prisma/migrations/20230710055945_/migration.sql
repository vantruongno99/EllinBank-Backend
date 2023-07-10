/*
  Warnings:

  - You are about to drop the column `company` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `company`,
    ADD COLUMN `companyName` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_companyName_fkey` FOREIGN KEY (`companyName`) REFERENCES `Company`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;
