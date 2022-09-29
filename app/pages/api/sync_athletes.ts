import { Athlete, PrismaClient, SportLevel } from ".prisma/client";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { UserSession } from "lib/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";
import { SyncAthletesDto } from "_api/dto/athletes";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const SPORT_LEVEL = {
  ЗМС: "ZMS",
  МСМК: "MSMK",
  МС: "MS",
  КМС: "KMS",
  "I разряд": "FIRST",
  "II разряд": "SECOND",
  "III разряд": "THIRD",
  "I юн.разряд": "FIRST_JUNIOR",
  "II юн. разряд": "SECOND_JUNIOR",
  "III юн.разряд": "THIRD_JUNIOR",
  "без разряда": "NONE",
};

apiRoute.post(async (req, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session && (session.user as UserSession).isAdmin) {
    const { fromNumber } = req.body as SyncAthletesDto;
    const prisma = new PrismaClient();

    try {
      const doc = new GoogleSpreadsheet(process.env.SYNC_ATHLETES_SHEET_ID);
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

      let manCounter = 0;
      let womanCounter = 0;
      let notConfirmed = 0;
      const unConfirmed = await prisma.athlete.aggregate({
        _max: { code: true },
        where: { confirmed: false },
      });
      const men = await prisma.athlete.aggregate({
        _max: { code: true },
        where: { gender: "MAN" },
      });
      const women = await prisma.athlete.aggregate({
        _max: { code: true },
        where: { gender: "WOMAN" },
      });
      const startNumber = fromNumber ? fromNumber - 3 : 0;

      const athletes: Omit<Athlete, "id">[] = rows
        .filter((row, i) => i > startNumber && row["Фамилия"] !== "")
        .map((row) => {
          const isMan = row["Пол"].toLowerCase() === "мужской";
          const isWoman = row["Пол"].toLowerCase() === "женский";
          const isConfirmed = row["Оплата"] === "TRUE" ? true : false;
          const hasCode = Boolean(row["SVO-код"]);

          if (!hasCode && isConfirmed) {
            if (isConfirmed && isMan) manCounter++;
            if (isConfirmed && isWoman) womanCounter++;
          }
          if (!isConfirmed) notConfirmed++;

          let birthDate = new Date(1900, 0, 1);
          const birthDateString: string =
            row[
              "Введите дату своего рождения (день. месяц. год) например, 01.12.2002"
            ];
          if (birthDateString) {
            const dateParts = birthDateString.split(".");
            if (dateParts.length > 2) {
              const [date, month, year] = dateParts;
              birthDate = new Date(
                `${month}.${date}.${(year?.match(/\d+/) as string[])[0]}`
              );
            }
          }

          return {
            code:
              hasCode && isConfirmed
                ? parseInt(row["SVO-код"])
                : isConfirmed && isWoman
                ? (women._max.code ?? 0) + womanCounter
                : isConfirmed && isMan
                ? (men._max.code ?? 0) + manCounter
                : !isConfirmed
                ? (unConfirmed._max.code ?? 0) + notConfirmed
                : 0,
            fisCode: row["Введите свой FIS -код (при наличии)"] ?? "",
            rusCode: row["Введите свой RUS -код (при наличии)"] ?? "",
            lastName: row["Фамилия"] ?? "",
            firstName: row["Имя"] ?? "",
            middleName: row["Отчество"] ?? "",
            birthDate,
            payDate: null,
            birthYear: row["Год рождения"]
              ? parseInt(row["Год рождения"])
              : null,
            sportLevel: (row["Спортивный разряд"]
              ? SPORT_LEVEL[
                  row["Спортивный разряд"] as keyof typeof SPORT_LEVEL
                ]
              : "NONE") as SportLevel,
            team: row["Спорт школа/коллектив/клуб"] ?? "",
            city: row["Муниципальный округ / город"] ?? "",
            phone: row["Номер телефона спортсмена (89 и т.д.)"] ?? "",
            gender: isMan ? "MAN" : "WOMAN",
            confirmed: isConfirmed,
            active: true,
          };
        });

      // console.log(athletes);
      await prisma.athlete.createMany({ data: athletes });

      res.status(201).json({ status: "Updated" });
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
