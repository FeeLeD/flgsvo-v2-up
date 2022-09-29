import { Athlete, PrismaClient, Race } from ".prisma/client";
import { ExportProtocolDto } from "_api/dto/event";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { Prisma } from "@prisma/client";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const GENDER = {
  MAN: "муж",
  WOMAN: "жен",
};

const RACE_TYPES = {
  INDIVIDUAL: "ИНД",
  MASS: "МСТ",
  RELAY: "ЭСТАФЕТА",
  SKIATHLON: "СКИАТЛОН",
  SPRINT: "СПРИНТ",
};

const RACE_CATEGORIES = {
  MEN: "муж",
  MEN_JUNIORS: "юниоры",
  MEN_YOUTH_ELDER: "ст. юноши",
  MEN_YOUTH_MIDDLE: "ср. юноши",
  MEN_YOUTH_JUNIOR: "мл. юноши",
  MEN_CHILDREN: "мальчики",
  WOMEN: "жен",
  WOMEN_JUNIORS: "юниорки",
  WOMEN_YOUTH_ELDER: "ст. девушки",
  WOMEN_YOUTH_MIDDLE: "ср. девушки",
  WOMEN_YOUTH_JUNIOR: "мл. девушки",
  WOMEN_CHILDREN: "девочки",
};

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
  "N",
  "Группа",
  "Имя",
  "Имя (лат.)",
  "Год рождения",
  "Квал.",
  "Регион",
  "Пар. зачет",
  "Команда",
  "FIS код",
  "Лич. код",
  "Дистанция",
  "Прим. к заявке",
];

apiRoute.post(async (req, res: NextApiResponse) => {
  const { sheetId, eventId } = req.body as ExportProtocolDto;

  const prisma = new PrismaClient();

  try {
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ?? "",
      private_key:
        process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? "",
    });

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        races: {
          select: {
            id: true,
            description: true,
            date: true,
            category: true,
            type: true,
            style: true,
            distanceKm: true,
            athletes: { include: { athlete: true } },
          },
        },
      },
    });

    if (!event) {
      res.status(500).json({ message: "No such event" });
      return;
    }

    const data = await prisma.racesAthletes.findMany({
      where: { raceId: { in: event.races.map((e) => e.id) } },
      select: {
        race: true,
        athlete: true,
        payload: true,
      },
      orderBy: {
        athlete: {
          gender: "asc",
        },
      },
    });

    const athletes = data.reduce(
      (arr, current) => {
        const index = arr.findIndex((d) => d.athlete.id === current.athlete.id);
        if (index > -1) {
          const updatedAthletes = [...arr];
          updatedAthletes[index].races.push(current.race);
          updatedAthletes[index].bindingTypes[current.race.id] = (
            current.payload as { bindingType: "SNS" | "NNN" }
          ).bindingType;
          return updatedAthletes;
        } else {
          return [
            ...arr,
            {
              races: [current.race],
              athlete: current.athlete,
              bindingTypes: {
                [current.race.id]: (
                  current.payload as { bindingType: "SNS" | "NNN" }
                ).bindingType,
              },
            },
          ];
        }
      },
      [] as Array<{
        races: Race[];
        athlete: Athlete;
        bindingTypes: {
          [id: string]: "NNN" | "SNS" | undefined;
        };
      }>
    );

    const newSheet = await doc.addSheet({
      title:
        "Чемпионат и Первенство Свердловской Области по лыжным гонкам в летних дисциплинах",
      headerValues: HEADER_VALUES,
    });

    await newSheet.loadCells();
    HEADER_VALUES.forEach((_, i) => {
      const cell = newSheet.getCell(0, i);
      cell.textFormat = { bold: true };
    });
    await newSheet.saveUpdatedCells();

    console.log(athletes);

    await newSheet.addRows(
      athletes.map((data) => ({
        Группа: GENDER[data.athlete.gender],
        Имя: `${data.athlete.lastName} ${data.athlete.firstName}`,
        [`Год рождения`]: data.athlete.birthYear ?? 0,
        [`Квал.`]: SPORT_LEVEL[data.athlete.sportLevel],
        Регион: data.athlete.city,
        Команда: data.athlete.team,
        [`FIS код`]: data.athlete.fisCode ?? "",
        [`Лич. код`]: data.athlete.code > 70000 ? data.athlete.code : "",
        Дистанция:
          data.races
            .map((r) => {
              if (new Date(r.date).getDate() === 20) return 1;
              if (new Date(r.date).getDate() === 21) return 2;
              return -1;
            })
            .sort((a, b) => a - b)
            .join(", ") + " день",
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
