-- CreateTable
CREATE TABLE `therapist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `branch` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `qrCodeUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `customer_contact_key`(`contact`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `therapistId` INTEGER NOT NULL,
    `customerId` INTEGER NOT NULL,
    `cleanliness` ENUM('Sangat_Memuaskan', 'Memuaskan', 'Cukup', 'Tidak_Memuaskan', 'Sangat_Tidak_Memuaskan') NOT NULL,
    `politeness` ENUM('Sangat_Memuaskan', 'Memuaskan', 'Cukup', 'Tidak_Memuaskan', 'Sangat_Tidak_Memuaskan') NOT NULL,
    `pressure` ENUM('Sangat_Memuaskan', 'Memuaskan', 'Cukup', 'Tidak_Memuaskan', 'Sangat_Tidak_Memuaskan') NOT NULL,
    `punctuality` ENUM('Sangat_Memuaskan', 'Memuaskan', 'Cukup', 'Tidak_Memuaskan', 'Sangat_Tidak_Memuaskan') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_therapistId_fkey` FOREIGN KEY (`therapistId`) REFERENCES `therapist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
