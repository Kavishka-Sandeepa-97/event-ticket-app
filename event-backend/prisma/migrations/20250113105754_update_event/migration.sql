-- AlterTable
ALTER TABLE `event` ADD COLUMN `currentTickets` INTEGER NULL,
    ADD COLUMN `initialTickets` INTEGER NULL,
    MODIFY `prices` DOUBLE NULL;
