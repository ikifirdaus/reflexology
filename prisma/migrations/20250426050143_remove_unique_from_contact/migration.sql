-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `feedback_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `feedback_therapistId_fkey`;

-- DropIndex
DROP INDEX `customer_contact_key` ON `customer`;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_therapistId_fkey` FOREIGN KEY (`therapistId`) REFERENCES `therapist`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
