import { PrismaClient } from ".prisma/client";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { RaceByEventIdDto } from "_api/dto/event";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const WOMEN_CATEGORIES = [
  "WOMEN",
  "WOMEN_JUNIORS",
  "WOMEN_YOUTH_ELDER",
  "WOMEN_YOUTH_MIDDLE",
  "WOMEN_YOUTH_JUNIOR",
  "WOMEN_CHILDREN",
];

const MEN_CATEGORIES = [
  "MEN",
  "MEN_JUNIORS",
  "MEN_YOUTH_ELDER",
  "MEN_YOUTH_MIDDLE",
  "MEN_YOUTH_JUNIOR",
  "MEN_CHILDREN",
];

const CATEGORIES_VALUE = {
  MEN: 5,
  MEN_JUNIORS: 4,
  MEN_YOUTH_ELDER: 3,
  MEN_YOUTH_MIDDLE: 2,
  MEN_YOUTH_JUNIOR: 1,
  MEN_CHILDREN: 0,
  WOMEN: 5,
  WOMEN_JUNIORS: 4,
  WOMEN_YOUTH_ELDER: 3,
  WOMEN_YOUTH_MIDDLE: 2,
  WOMEN_YOUTH_JUNIOR: 1,
  WOMEN_CHILDREN: 0,
};

apiRoute.get(async (req, res: NextApiResponse) => {
  const { eventId } = req.query;
  const prisma = new PrismaClient();

  if (!eventId && typeof eventId !== "string") {
    res.status(500).json({ error: "Invalid event id" });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId as string) },
      select: {
        races: {
          orderBy: { date: "asc" },
          select: {
            id: true,
            description: true,
            date: true,
            category: true,
            type: true,
            style: true,
            distanceKm: true,
            startProtocol: true,
            applications: { include: { athlete: true } },
            athletes: { include: { athlete: true } },
            results: { include: { athlete: true } },
          },
        },
      },
    });

    if (!event) {
      res.status(500).json({ message: "No event found" });
      res.end();
      return;
    }

    const racesByDate = event.races.reduce((races, currentRace, i) => {
      if (
        i > 0 &&
        dayjs(currentRace.date).isSame(dayjs(event.races[i - 1].date), "date")
      ) {
        const newRaces = [...races];
        newRaces[newRaces.length - 1].push(currentRace);
        return newRaces;
      } else {
        return [...races, [currentRace]];
      }
    }, [] as Array<RaceByEventIdDto[]>);

    const sortedRacesByDate = racesByDate.map((races) => {
      return races.sort((raceA, raceB) => {
        if (
          raceA.category.some((c) => MEN_CATEGORIES.includes(c)) &&
          raceB.category.some((c) => WOMEN_CATEGORIES.includes(c))
        )
          return -1;
        else if (
          raceA.category.some((c) => WOMEN_CATEGORIES.includes(c)) &&
          raceB.category.some((c) => MEN_CATEGORIES.includes(c))
        )
          return 1;
        else {
          return 0;
        }
      });
    });

    const fullSortedRacesByDate = sortedRacesByDate.map((races) => {
      return races.sort((raceA, raceB) => {
        if (
          CATEGORIES_VALUE[raceA.category[0]] >
          CATEGORIES_VALUE[raceB.category[0]]
        ) {
          return 1;
        } else if (
          CATEGORIES_VALUE[raceA.category[0]] <
          CATEGORIES_VALUE[raceB.category[0]]
        ) {
          return -1;
        } else {
          return 0;
        }
      });
    });

    const races = fullSortedRacesByDate.reduce((joinedRaces, currentRaces) => {
      return [...joinedRaces, ...currentRaces];
    }, [] as RaceByEventIdDto[]);

    res.status(201).json(races);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  } finally {
    prisma.$disconnect();
  }
});

export default apiRoute;
