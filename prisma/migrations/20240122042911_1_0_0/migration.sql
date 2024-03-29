-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `hashedPassword` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Company_name_key`(`name`),
    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Device` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lastCheck` DATETIME(3) NULL,
    `updateUTC` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'READY',
    `assigned` BOOLEAN NOT NULL DEFAULT false,
    `CH4_SN` VARCHAR(191) NULL,
    `O2_SN` VARCHAR(191) NULL,
    `CO2_SN` VARCHAR(191) NULL,
    `PUMP_SN` VARCHAR(191) NULL,

    UNIQUE INDEX `Device_id_key`(`id`),
    UNIQUE INDEX `Device_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateTimeUTC` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `timestampUTC` BIGINT NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `taskId` INTEGER NOT NULL,
    `logType` VARCHAR(191) NOT NULL,
    `logValue` DOUBLE NOT NULL,
    `logNote` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `createdUTC` DATETIME(3) NOT NULL,
    `completedUTC` DATETIME(3) NULL,
    `comment` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL,
    `logPeriod` INTEGER NOT NULL,
    `flowRate` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ONGOING',
    `createUser` VARCHAR(191) NOT NULL,
    `completeUser` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,

    UNIQUE INDEX `Task_name_key`(`name`),
    PRIMARY KEY (`id`)
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
ALTER TABLE `User` ADD CONSTRAINT `User_company_fkey` FOREIGN KEY (`company`) REFERENCES `Company`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_company_fkey` FOREIGN KEY (`company`) REFERENCES `Company`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_createUser_fkey` FOREIGN KEY (`createUser`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device_Task` ADD CONSTRAINT `Device_Task_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device_Task` ADD CONSTRAINT `Device_Task_deviceId_id_fkey` FOREIGN KEY (`deviceId_id`) REFERENCES `Device`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
