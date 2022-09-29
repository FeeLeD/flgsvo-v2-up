import { NextApiRequest, NextApiResponse } from "next";
import { UpdateAthleteDto } from "_api/dto/athletes";
import { PrismaClient } from ".prisma/client";
import nextConnect from "next-connect";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.get(async (req, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id && typeof id !== "string") {
    res.status(500).json({ error: "Invalid athlete id" });
  }

  const prisma = new PrismaClient();

  try {
    const athlete = await prisma.athlete.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        results: {
          orderBy: {
            race: {
              date: "asc",
            },
          },
          include: {
            race: {
              include: {
                event: {
                  select: { title: true },
                },
              },
            },
          },
        },
      },
    });

    res.status(201).json(athlete);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  } finally {
    prisma.$disconnect();
  }
});

apiRoute.put(async (req, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id && typeof id !== "string") {
    res.status(500).json({ error: "Invalid athlete id" });
  }
  const athlete = req.body as UpdateAthleteDto;
  const prisma = new PrismaClient();

  try {
    const sameCodeAthlete = await prisma.athlete.findUnique({
      where: { code: athlete.code },
    });

    if (sameCodeAthlete && sameCodeAthlete.id !== parseInt(id as string)) {
      res
        .status(400)
        .json({ code: "SAME_CODE_EXISTS", athlete: sameCodeAthlete });
      return;
    }

    const updatedAthlete = await prisma.athlete.update({
      where: { id: parseInt(id as string) },
      data: { ...athlete },
    });

    res.status(201).json(updatedAthlete.id);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    prisma.$disconnect();
  }
});

export default apiRoute;
