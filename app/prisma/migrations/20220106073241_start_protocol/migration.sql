-- AlterTable
ALTER TABLE "races" ADD COLUMN     "fileId" INTEGER;

-- AddForeignKey
ALTER TABLE "races" ADD CONSTRAINT "races_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
