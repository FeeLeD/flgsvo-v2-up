import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { PrismaClient } from ".prisma/client";
import { UserSession } from "lib/types";
import nextConnect from "next-connect";
import { CreateAthleteDto } from "_api/dto/athletes";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.get(async (req, res: NextApiResponse) => {
  const session = await getSession({ req });
  const prisma = new PrismaClient();

  if (session && (session.user as UserSession).isAdmin) {
    try {
      const athletes = await prisma.athlete.findMany();

      res.status(201).json(athletes);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    } finally {
      prisma.$disconnect();
    }
  } else {
    res.status(401);
  }
  res.end();
});

apiRoute.post(async (req, res: NextApiResponse) => {
  const prisma = new PrismaClient();
  const newAthleteData = req.body as CreateAthleteDto;

  try {
    const unConfirmed = await prisma.athlete.aggregate({
      _max: { code: true },
      where: { confirmed: false },
    });

    if (!unConfirmed._max.code) {
      res.status(500).json({ message: "Code error" });
      return;
    }

    console.log(unConfirmed._max.code);

    const athlete = await prisma.athlete.create({
      data: {
        ...newAthleteData,
        code: unConfirmed._max.code + 1,
        active: true,
        confirmed: false,
      },
    });

    res.status(201).json(athlete.id);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  } finally {
    prisma.$disconnect();
  }
});

export default apiRoute;
