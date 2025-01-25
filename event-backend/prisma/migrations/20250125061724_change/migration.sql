/*
  Warnings:

  - You are about to drop the column `isTicket` on the `event` table. All the data in the column will be lost.
  - You are about to alter the column `prices` on the `event` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `event` DROP COLUMN `isTicket`,
    ADD COLUMN `ticketsStatus` ENUM('PLATFORM', 'NOTPLATFORM', 'FREE') NOT NULL DEFAULT 'FREE',
    MODIFY `prices` VARCHAR(191) NULL;
