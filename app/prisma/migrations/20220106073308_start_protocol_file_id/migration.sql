/*
  Warnings:

  - You are about to drop the column `fileId` on the `races` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "races" DROP CONSTRAINT "races_fileId_fkey";

-- AlterTable
ALTER TABLE "races" DROP COLUMN "fileId",
ADD COLUMN     "startProtocolFileId" INTEGER;

-- AddForeignKey
ALTER TABLE "races" ADD CONSTRAINT "races_startProtocolFileId_fkey" FOREIGN KEY ("startProtocolFileId") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
