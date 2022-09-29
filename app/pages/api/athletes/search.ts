import { NextApiRequest, NextApiResponse } from "next";
import { SearchAthleteDto } from "_api/dto/athletes";
import { PrismaClient } from ".prisma/client";
import nextConnect from "next-connect";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(async (req, res: NextApiResponse) => {
  const { searchValue } = req.body as SearchAthleteDto;

  const prisma = new PrismaClient();

  try {
    const athletes = await prisma.athlete.findMany({
      where: {
        OR: [
          { code: !isNaN(parseInt(searchValue)) ? parseInt(searchValue) : -1 },
          { lastName: { contains: searchValue, mode: "insensitive" } },
        ],
      },
    });

    res.status(201).json(athletes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  } finally {
    prisma.$disconnect();
  }
});

export default apiRoute;
