/*
  Warnings:

  - You are about to drop the `RacesAthletes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RacesAthletes" DROP CONSTRAINT "RacesAthletes_athleteId_fkey";

-- DropForeignKey
ALTER TABLE "RacesAthletes" DROP CONSTRAINT "RacesAthletes_raceId_fkey";

-- DropTable
DROP TABLE "RacesAthletes";

-- CreateTable
CREATE TABLE "races_athletes" (
    "id" SERIAL NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,

    CONSTRAINT "races_athletes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "races_athletes" ADD CONSTRAINT "races_athletes_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "races_athletes" ADD CONSTRAINT "races_athletes_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "races"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
