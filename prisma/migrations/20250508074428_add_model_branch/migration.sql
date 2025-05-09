/*
  Warnings:

  - You are about to drop the column `branch` on the `therapist` table. All the data in the column will be lost.
  - Added the required column `branchId` to the `therapist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `therapist` DROP COLUMN `branch`,
    ADD COLUMN `branchId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `branchId` INTEGER NULL,
    MODIFY `role` ENUM('SUPERADMIN', 'ADMIN', 'USER') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `Branch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Branch_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `therapist` ADD CONSTRAINT `therapist_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
