/*
  Warnings:

  - The primary key for the `log` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `TimeStamp` on the `log` table. All the data in the column will be lost.
  - You are about to drop the column `Utc` on the `log` table. All the data in the column will be lost.
  - You are about to drop the column `dataId` on the `log` table. All the data in the column will be lost.
  - You are about to drop the column `sensorId` on the `log` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `log` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `taskId` on the `log` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `endTimeUTC` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `startTimeUtc` on the `task` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `task` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sensor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sensor_task` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dateTimeUTC` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logNote` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logType` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logValue` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestampUTC` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `log` DROP FOREIGN KEY `Log_dataId_fkey`;

-- DropForeignKey
ALTER TABLE `log` DROP FOREIGN KEY `Log_sensorId_fkey`;

-- DropForeignKey
ALTER TABLE `log` DROP FOREIGN KEY `Log_taskId_fkey`;

-- DropForeignKey
ALTER TABLE `sensor_task` DROP FOREIGN KEY `sensor_task_sensor_id_fkey`;

-- DropForeignKey
ALTER TABLE `sensor_task` DROP FOREIGN KEY `sensor_task_task_id_fkey`;

-- AlterTable
ALTER TABLE `log` DROP PRIMARY KEY,
    DROP COLUMN `TimeStamp`,
    DROP COLUMN `Utc`,
    DROP COLUMN `dataId`,
    DROP COLUMN `sensorId`,
    ADD COLUMN `dateTimeUTC` DATETIME(3) NOT NULL,
    ADD COLUMN `deviceId` VARCHAR(191) NULL,
    ADD COLUMN `logNote` VARCHAR(191) NOT NULL,
    ADD COLUMN `logType` VARCHAR(191) NOT NULL,
    ADD COLUMN `logValue` DOUBLE NOT NULL,
    ADD COLUMN `timestampUTC` INTEGER NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `taskId` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `task` DROP PRIMARY KEY,
    DROP COLUMN `endTimeUTC`,
    DROP COLUMN `startTimeUtc`,
    ADD COLUMN `completedUTC` INTEGER NULL,
    ADD COLUMN `createdUTC` INTEGER NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `data`;

-- DropTable
DROP TABLE `sensor`;

-- DropTable
DROP TABLE `sensor_task`;

-- CreateTable
CREATE TABLE `Device` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `updateUTC` DATETIME(3) NULL,
    `CH4_SN` VARCHAR(191) NULL,
    `O2_SN` VARCHAR(191) NULL,
    `CO2_SN` VARCHAR(191) NULL,
    `PUMP_SN` VARCHAR(191) NULL,

    UNIQUE INDEX `Device_id_key`(`id`),
    UNIQUE INDEX `Device_name_key`(`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Device_Task` (
    `task_id` INTEGER NOT NULL,
    `deviceId_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`task_id`, `deviceId_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Applog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `taskId` INTEGER NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `dateTimeUTC` VARCHAR(191) NOT NULL,
    `evtType` VARCHAR(191) NOT NULL,
    `details` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Device`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device_Task` ADD CONSTRAINT `Device_Task_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device_Task` ADD CONSTRAINT `Device_Task_deviceId_id_fkey` FOREIGN KEY (`deviceId_id`) REFERENCES `Device`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
