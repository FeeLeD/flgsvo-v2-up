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
        "1HZzaZERijofZBwTU7qzvqmv8z3-2CywtL1pRH9WkV-I"
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
        .filter((row) => row["Оплата"] === "есть" && parseInt(row["Id"]) > 1130 )
        .map((row) => ({ id: row["Id"] }));

      for (const athlete of athletes) {
        console.log(athlete.id);
        await prisma.athlete.update({
          where: { id: parseInt(athlete.id) },
          data: { confirmed: true },
        });
      }

      // const updated = [];
      // const error = [];

      // for (const athlete of athletes) {
      //   const foundAthletes = await prisma.athlete.findMany({
      //     where: {
      //       firstName: { contains: athlete.firstName },
      //       middleName: { contains: athlete.middleName },
      //       lastName: { contains: athlete.lastName },
      //       birthYear: athlete.birthYear,
      //     },
      //   });

      //   if (foundAthletes.length === 1) {
      //     await prisma.athlete.update({
      //       where: { id: foundAthletes[0].id },
      //       data: { confirmed: athlete.hasPayment },
      //     });

      //     updated.push(athlete);
      //   } else {
      //     error.push(athlete);
      //   }
      // }

      // console.log("UPDATED: ", updated);
      // console.log("ERROR: ", error);
      // console.log("updated: ", updated.length);
      // console.log("errors: ", error.length);

      // res.status(201).json({ status: "Done" });
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
