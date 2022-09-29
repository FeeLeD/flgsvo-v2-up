-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_authorId_fkey";

-- AlterTable
ALTER TABLE "files" ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
