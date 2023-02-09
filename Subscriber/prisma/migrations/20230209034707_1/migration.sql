/*
  Warnings:

  - You are about to drop the column `SensorId` on the `timestamp` table. All the data in the column will be lost.
  - Added the required column `SensorCode` to the `TimeStamp` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `timestamp` DROP FOREIGN KEY `TimeStamp_SensorId_fkey`;

-- AlterTable
ALTER TABLE `timestamp` DROP COLUMN `SensorId`,
    ADD COLUMN `SensorCode` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TimeStamp` ADD CONSTRAINT `TimeStamp_SensorCode_fkey` FOREIGN KEY (`SensorCode`) REFERENCES `Sensor`(`Code`) ON DELETE RESTRICT ON UPDATE CASCADE;
