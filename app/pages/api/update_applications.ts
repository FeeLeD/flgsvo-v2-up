import { PrismaClient } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(async (req, res: NextApiResponse) => {
  const prisma = new PrismaClient();

  try {
    const raceAthletes = await prisma.racesAthletes.findMany();
    await prisma.applications.createMany({
      data: raceAthletes,
    });

    res.status(201).json({ status: "Updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  } finally {
    prisma.$disconnect();
  }
});

export default apiRoute;
