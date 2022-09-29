/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `athletes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `athletes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "athletes" DROP COLUMN "code",
ADD COLUMN     "code" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "athletes_code_key" ON "athletes"("code");
