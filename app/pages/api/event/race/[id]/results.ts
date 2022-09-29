import { PrismaClient } from ".prisma/client";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { LoadResultsDto } from "_api/dto/event";
import { UserSession } from "lib/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.get(async (req, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id && typeof id !== "string") {
    res.status(500).json({ error: "Invalid race id" });
  }

  const prisma = new PrismaClient();

  try {
    const results = await prisma.results.findMany({
      where: { raceId: parseInt(id as string) },
      include: { athlete: true },
    });

    res.status(201).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    prisma.$disconnect();
  }
});

apiRoute.post(async (req, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session && (session.user as UserSession).isAdmin) {
    const { id } = req.query;

    if (!id && typeof id !== "string") {
      res.status(500).json({ error: "Invalid race id" });
    }

    const { sheetId } = req.body as LoadResultsDto;
    const prisma = new PrismaClient();

    try {
      const doc = new GoogleSpreadsheet(sheetId);
      await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ?? "",
        private_key:
          process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? "",
      });
      await doc.loadInfo();

      const sheet = doc.sheetsByIndex[0];
      const rows = await sheet.getRows();

      if (!rows) {
        res.status(500).json({ message: "Spreadsheet error" });
        return;
      }

      const results: Array<{
        place: number;
        number: number;
        raceId: number;
        finalTime: string;
        gap: string;
        athleteId: number;
      }> = [];
      const problemAthletes: string[] = [];
      for (const row of rows) {
        const athletes = await prisma.athlete.findMany({
          where: {
            firstName: {
              contains: row["Имя"].split(" ")[1],
              mode: "insensitive",
            },
            lastName: {
              contains: row["Имя"].split(" ")[0],
              mode: "insensitive",
            },
            birthYear: parseInt(row["Год р."]),
          },
        });
        if (athletes.length === 1)
          results.push({
            place: parseInt(row["Место"]),
            number: parseInt(row["Номер"]),
            raceId: parseInt(id as string),
            finalTime: row["Результат"],
            gap: row["Отставание"],
            athleteId: athletes[0].id,
          });
        else
          problemAthletes.push(
            `${row["Имя"].split(" ")[1]} ${
              row["Имя"].split(" ")[0]
            } (${parseInt(row["Год р."])})`
          );
      }

      if (problemAthletes.length === 0) {
        await prisma.results.createMany({
          data: results,
        });
        res.status(201).json({ status: "Loaded" });
      } else {
        res.status(500).json({ status: "Data error", problemAthletes });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    } finally {
      prisma.$disconnect();
    }
  } else {
    res.status(401);
  }
  res.end();
});

export default apiRoute;
