/*
  Warnings:

  - You are about to drop the column `createdById` on the `Pad` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Collaborator" DROP CONSTRAINT "Collaborator_padId_fkey";

-- DropForeignKey
ALTER TABLE "Collaborator" DROP CONSTRAINT "Collaborator_userId_fkey";

-- DropForeignKey
ALTER TABLE "Pad" DROP CONSTRAINT "Pad_createdById_fkey";

-- AlterTable
ALTER TABLE "Pad" DROP COLUMN "createdById";

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_padId_fkey" FOREIGN KEY ("padId") REFERENCES "Pad"("id") ON DELETE CASCADE ON UPDATE CASCADE;
