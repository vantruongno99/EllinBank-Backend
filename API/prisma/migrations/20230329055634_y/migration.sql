-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `hashedPassword` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
CREATE TABLE `Log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateTimeUTC` DATETIME(3) NOT NULL,
    `timestampUTC` INTEGER NOT NULL,
    `deviceId` VARCHAR(191) NULL,
    `taskId` INTEGER NULL,
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
    `createdUTC` INTEGER NULL,
    `completedUTC` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `logPeriod` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Planned',
    `createUser` VARCHAR(191) NOT NULL,
    `completeUser` VARCHAR(191) NULL,

    UNIQUE INDEX `Task_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Device_Task` (
    `task_id` INTEGER NOT NULL,
    `deviceId_id` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,

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
ALTER TABLE `Task` ADD CONSTRAINT `Task_createUser_fkey` FOREIGN KEY (`createUser`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device_Task` ADD CONSTRAINT `Device_Task_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device_Task` ADD CONSTRAINT `Device_Task_deviceId_id_fkey` FOREIGN KEY (`deviceId_id`) REFERENCES `Device`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
