import { PrismaClient } from ".prisma/client";
import { RegisterDto } from "_api/dto/event";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(async (req, res: NextApiResponse) => {
  const { racesIds, athleteId, payload } = req.body as RegisterDto;

  const prisma = new PrismaClient();

  try {
    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
    });
    if (!athlete) {
      res.status(500).json({ message: "Athlete not found" });
      return;
    }
    if (!athlete.confirmed) {
      res.status(500).json({ message: "Athlete not confirmed" });
      return;
    }

    const registered = [];
    const failed = [];

    for (const raceId of racesIds) {
      const alreadyRegistered = await prisma.racesAthletes.findFirst({
        where: { raceId, athleteId },
      });

      if (!alreadyRegistered) {
        await prisma.racesAthletes.create({
          data: {
            athleteId,
            raceId,
            payload: { bindingType: payload?.bindingTypes?.[raceId] },
          },
        });
        registered.push(raceId);
      } else {
        failed.push(raceId);
      }
    }

    res.status(201).json({ registered, failed });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  } finally {
    prisma.$disconnect();
  }
});

export default apiRoute;
