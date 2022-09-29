import { PrismaClient } from ".prisma/client";
import { CreateEventDto } from "_api/dto/event";
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
  const prisma = new PrismaClient();

  try {
    const events = await prisma.event.findMany({
      orderBy: {
        startDate: "asc",
      },
      include: {
        races: true,
      },
    });

    res.status(201).json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  } finally {
    prisma.$disconnect();
  }
});

apiRoute.post(async (req, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session && (session.user as UserSession).isAdmin) {
    const {
      type,
      startDate,
      endDate,
      title,
      description,
      locationId,
      organizersIds,
      races,
      files,
      registrationOpened,
    } = req.body as CreateEventDto;
    const prisma = new PrismaClient();

    try {
      const event = await prisma.event.create({
        data: {
          type,
          startDate,
          endDate,
          title,
          description,
          location: { connect: { id: locationId } },
          organizers: { connect: organizersIds.map((oId) => ({ id: oId })) },
          races: {
            createMany: {
              data: races.map((race) => ({
                description: race.description,
                date: race.date,
                type: race.type,
                style: race.style,
                distanceKm: race.distanceKm,
                category: race.category,
              })),
            },
          },
          files: {
            createMany: {
              data: files.map((file) => ({
                name: file.name,
                sourceLink: file.sourceLink,
                type: file.type,
              })),
            },
          },
          registrationOpened: registrationOpened,
          author: { connect: { email: session?.user?.email as string } },
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

export default apiRoute;
