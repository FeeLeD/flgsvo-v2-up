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
  const { id } = req.query;
  const prisma = new PrismaClient();

  if (!id && typeof id !== "string") {
    res.status(500).json({ error: "Invalid post id" });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        location: true,
        organizers: true,
        races: true,
        files: true,
      },
    });

    if (!event) {
      res.status(500).json({ message: "No event found" });
      res.end();
      return;
    }

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  } finally {
    prisma.$disconnect();
  }
});

apiRoute.put(async (req, res: NextApiResponse) => {
  const { id } = req.query;
  const session = await getSession({ req });

  if (session && (session.user as UserSession).isAdmin) {
    if (!id && typeof id !== "string") {
      res.status(500).json({ error: "Invalid post id" });
    }

    const {
      type,
      startDate,
      endDate,
      title,
      description,
      locationId,
      organizersIds,
    } = req.body as UpdateEventDto;
    const prisma = new PrismaClient();

    try {
      const currentOrganizers = await prisma.organizer.findMany({
        where: { eventId: parseInt(id as string) },
      });

      const event = await prisma.event.update({
        where: { id: parseInt(id as string) },
        data: {
          type,
          startDate,
          endDate,
          title,
          description,
          location: { connect: { id: locationId } },
          organizers: {
            connect: organizersIds.map((oId) => ({ id: oId })),
            disconnect: currentOrganizers
              .filter((o) => !organizersIds.includes(o.id))
              .map((o) => ({ id: o.id })),
          },
        },
      });

      res.status(201).json({ eventId: event.id });
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
  const { id } = req.query;
  const session = await getSession({ req });

  if (session && (session.user as UserSession).isAdmin) {
    if (!id && typeof id !== "string") {
      res.status(500).json({ error: "Invalid post id" });
    }

    const prisma = new PrismaClient();

    try {
      await prisma.event.delete({
        where: {
          id: parseInt(id as string),
        },
      });

      res.status(201).json({ status: "Deleted" });
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
