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
CREATE TABLE `TimeStamp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `TimeStamp` DATETIME(3) NOT NULL,
    `Utc` INTEGER NOT NULL,
    `SensorData` JSON NOT NULL,
    `SensorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sensor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Code` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Sensor_Name_key`(`Name`),
    UNIQUE INDEX `Sensor_Code_key`(`Code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TimeStamp` ADD CONSTRAINT `TimeStamp_SensorId_fkey` FOREIGN KEY (`SensorId`) REFERENCES `Sensor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
