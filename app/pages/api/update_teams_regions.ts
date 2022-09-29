import { PrismaClient } from ".prisma/client";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { UserSession } from "lib/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(async (req, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session && (session.user as UserSession).isAdmin) {
    const prisma = new PrismaClient();

    try {
      const doc = new GoogleSpreadsheet(
        "1LqvCxAAZNZIuixA2lW11dDhHXdZl7Le8kn8f5ucpzTs"
      );
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

      const athletes = rows
        .filter((row) => row["Фамилия"] !== "" && row["Id"] > 1342)
        .map((row) => {
          const id = parseInt(row["Id"]);
          const team: string = row["Команда"];
          const city: string = row["Регион"];

          return {
            id,
            team,
            city,
          };
        });

      for (const athlete of athletes) {
        console.log(athlete.id);
        await prisma.athlete.update({
          where: { id: athlete.id },
          data: {
            team: athlete.team,
            city: athlete.city,
          },
        });
      }

      res.status(201).json({ status: "Done" });
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
