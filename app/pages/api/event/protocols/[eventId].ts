import { PrismaClient } from ".prisma/client";
import { UpdateEventDto, EventDto } from "_api/dto/event";
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
  const { eventId } = req.query;
  const prisma = new PrismaClient();

  if (!eventId && typeof eventId !== "string") {
    res.status(500).json({ error: "Invalid event id" });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId as string) },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        location: true,
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
            athletes: { include: { athlete: true } },
            startProtocol: true,
          },
        },
      },
    });

    if (!event) {
      res.status(500).json({ message: "No event found" });
      res.end();
      return;
    }

    res.status(201).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", err });
  } finally {
    prisma.$disconnect();
  }
});

export default apiRoute;
