import { PrismaClient } from ".prisma/client";
import { CreateLocationDto } from "_api/dto/event";
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

  if (session) {
    const prisma = new PrismaClient();

    try {
      const locations = await prisma.location.findMany();

      res.status(201).json(locations);
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

  if (session) {
    const { name, description, address, city, country, phone, web } =
      req.body as CreateLocationDto;
    const prisma = new PrismaClient();

    try {
      const location = await prisma.location.create({
        data: {
          name,
          description,
          address,
          city,
          country,
          phone,
          web,
        },
      });

      res.status(201).json({ eventId: location.id });
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
