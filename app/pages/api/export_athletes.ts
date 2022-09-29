import { PrismaClient } from ".prisma/client";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import dayjs from "dayjs";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const SPORT_LEVEL = {
  ZMS: "змс",
  MSMK: "мсмк",
  MS: "мс",
  KMS: "кмс",
  FIRST: "1р",
  SECOND: "2р",
  THIRD: "3р",
  FIRST_JUNIOR: "1юр",
  SECOND_JUNIOR: "2юр",
  THIRD_JUNIOR: "3юр",
  NONE: "",
};

const HEADER_VALUES = [
  "Id",
  "fis код",
  "rus код",
  "svo код",
  "Фамилия",
  "Имя",
  "Отчество",
  "Дата рождения",
  "Год рождения",
  "Разряд",
  "Команда",
  "Регион",
  "Дата оплаты",
  "Оплата",
];

apiRoute.post(async (req, res: NextApiResponse) => {
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

    const athletes = await prisma.athlete.findMany({
      where: {
        confirmed: false,
      },
      select: {
        id: true,
        fisCode: true,
        rusCode: true,
        code: true,
        lastName: true,
        firstName: true,
        middleName: true,
        birthDate: true,
        payDate: true,
        birthYear: true,
        sportLevel: true,
        team: true,
        city: true,
        confirmed: true,
      },
    });

    const parsedAthletes = athletes.map((athlete) => ({
      ...athlete,
      code: athlete.code < 70000 ? "" : athlete.code,
      birthDate: dayjs(athlete.birthDate).format("DD.MM.YYYY"),
      payDate: athlete.payDate
        ? dayjs(athlete.payDate).format("DD.MM.YYYY")
        : "",
      sportLevel: SPORT_LEVEL[athlete.sportLevel],
      confirmed: athlete.confirmed ? "есть" : "-",
    }));

    const newSheet = await doc.addSheet({
      title: "Спортсмены",
      headerValues: HEADER_VALUES,
    });

    await newSheet.loadCells();
    HEADER_VALUES.forEach((_, i) => {
      const cell = newSheet.getCell(0, i);
      cell.textFormat = { bold: true };
    });
    await newSheet.saveUpdatedCells();

    await newSheet.addRows(
      parsedAthletes.map((athlete) => ({
        Id: athlete.id,
        "fis код": athlete.fisCode ?? "",
        "rus код": athlete.rusCode ?? "",
        "svo код": athlete.code,
        Фамилия: athlete.lastName,
        Имя: athlete.firstName,
        Отчество: athlete.middleName,
        "Дата рождения": athlete.birthDate,
        "Год рождения": athlete.birthYear ?? "",
        Разряд: athlete.sportLevel,
        Команда: athlete.team,
        Регион: athlete.city,
        "Дата оплаты": athlete.payDate,
        Оплата: athlete.confirmed,
      }))
    );

    res.status(200).json({ message: "Exported" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    prisma.$disconnect();
  }
});

export default apiRoute;
