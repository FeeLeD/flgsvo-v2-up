import { PrismaClient, RaceCategory } from ".prisma/client";
import { GetAvailableDto, ShortEventDto } from "_api/dto/event";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(async (req, res: NextApiResponse) => {
  const { gender } = req.body as GetAvailableDto;
  const prisma = new PrismaClient();

  const MAN_CATEGORIES: RaceCategory[] = [
    "MEN",
    "MEN_JUNIORS",
    "MEN_YOUTH_ELDER",
    "MEN_YOUTH_MIDDLE",
    "MEN_YOUTH_JUNIOR",
    "MEN_CHILDREN",
  ];

  const WOMAN_CATEGORIES: RaceCategory[] = [
    "WOMEN",
    "WOMEN_JUNIORS",
    "WOMEN_YOUTH_ELDER",
    "WOMEN_YOUTH_MIDDLE",
    "WOMEN_YOUTH_JUNIOR",
    "WOMEN_CHILDREN",
  ];

  try {
    const events = await prisma.event.findMany({
      where: { registrationOpened: true },
      orderBy: {
        startDate: "asc",
      },
      select: {
        id: true,
        title: true,
        races: {
          where: {
            category: {
              hasSome: gender === "MAN" ? MAN_CATEGORIES : WOMAN_CATEGORIES,
            },
          },
        },
      },
    });

    res.status(201).json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  } finally {
    prisma.$disconnect();
  }
});

export default apiRoute;
