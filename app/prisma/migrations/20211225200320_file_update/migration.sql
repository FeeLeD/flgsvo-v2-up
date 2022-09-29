/*
  Warnings:

  - Made the column `authorId` on table `files` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_authorId_fkey";

-- AlterTable
ALTER TABLE "files" ALTER COLUMN "authorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
