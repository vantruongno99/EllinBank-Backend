/*
  Warnings:

  - You are about to drop the column `companyName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_companyName_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `companyName`,
    ADD COLUMN `company` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Company`;
