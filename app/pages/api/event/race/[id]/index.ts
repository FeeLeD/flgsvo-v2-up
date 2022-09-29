import { PrismaClient } from ".prisma/client";
import { UpdateRaceDto } from "_api/dto/event";
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
    const { id } = req.query;

    if (!id && typeof id !== "string") {
      res.status(500).json({ error: "Invalid post id" });
    }

    const prisma = new PrismaClient();

    try {
      const race = await prisma.race.findUnique({
        where: { id: parseInt(id as string) },
      });

      res.status(201).json(race);
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

apiRoute.put(async (req, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session && (session.user as UserSession).isAdmin) {
    const { id } = req.query;

    if (!id && typeof id !== "string") {
      res.status(500).json({ error: "Invalid post id" });
    }

    const {
      description,
      date,
      category,
      distanceKm,
      style,
      startProtocolFileId,
    } = req.body as UpdateRaceDto;
    const prisma = new PrismaClient();

    try {
      const race = await prisma.race.update({
        where: { id: parseInt(id as string) },
        data: {
          description,
          date,
          distanceKm,
          style,
          category,
          startProtocolFileId,
        },
      });

      res.status(201).json({ raceId: race.id });
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

apiRoute.delete(async (req, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session && (session.user as UserSession).isAdmin) {
    const { id } = req.query;

    if (!id && typeof id !== "string") {
      res.status(500).json({ error: "Invalid post id" });
    }

    const prisma = new PrismaClient();

    try {
      await prisma.race.delete({
        where: { id: parseInt(id as string) },
      });

      res.status(201).json({ status: "Deleted" });
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
