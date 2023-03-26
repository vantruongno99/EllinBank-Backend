-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `hashedPassword` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sensor` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `CH4_SN` VARCHAR(191) NULL,
    `O2_SN` VARCHAR(191) NULL,
    `CO2_SN` VARCHAR(191) NULL,
    `PUMP_SN` VARCHAR(191) NULL,

    UNIQUE INDEX `Sensor_name_key`(`name`),
    UNIQUE INDEX `Sensor_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Log` (
    `id` VARCHAR(191) NOT NULL,
    `TimeStamp` DATETIME(3) NOT NULL,
    `Utc` INTEGER NOT NULL,
    `sensorId` VARCHAR(191) NULL,
    `taskId` VARCHAR(191) NULL,
    `dataId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Log_dataId_key`(`dataId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Data` (
    `id` VARCHAR(191) NOT NULL,
    `UTCtime` INTEGER NOT NULL,
    `UID` BIGINT NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `logId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Data_logId_key`(`logId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `startTimeUtc` INTEGER NULL,
    `endTimeUTC` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `createUser` VARCHAR(191) NOT NULL,
    `completeUser` VARCHAR(191) NULL,

    UNIQUE INDEX `Task_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sensor_task` (
    `task_id` VARCHAR(191) NOT NULL,
    `sensor_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`task_id`, `sensor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_dataId_fkey` FOREIGN KEY (`dataId`) REFERENCES `Data`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_sensorId_fkey` FOREIGN KEY (`sensorId`) REFERENCES `Sensor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_createUser_fkey` FOREIGN KEY (`createUser`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sensor_task` ADD CONSTRAINT `sensor_task_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sensor_task` ADD CONSTRAINT `sensor_task_sensor_id_fkey` FOREIGN KEY (`sensor_id`) REFERENCES `Sensor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
