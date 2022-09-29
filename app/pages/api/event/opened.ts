import { PrismaClient } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
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

export default apiRoute;
