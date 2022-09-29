import { PrismaClient } from ".prisma/client";
import { CreateDistanceDto } from "_api/dto/event";
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
  const session = await getSession({ req });

  if (session && (session.user as UserSession).isAdmin) {
    const prisma = new PrismaClient();

    try {
      const races = await prisma.race.findMany();

      res.status(201).json(races);
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
  const session = await getSession({ req });

  if (session && (session.user as UserSession).isAdmin) {
    const { description, date, category, gender, distanceKm, style, isRelay } =
      req.body as CreateDistanceDto;
    const prisma = new PrismaClient();

    try {
      /* const race = await prisma.race.create({
        data: {
          date,
          description,
          distanceKm,
          style,
        },
      }); */

      // res.status(201).json({ raceId: race.id });
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

export default apiRoute;
