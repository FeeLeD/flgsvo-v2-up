import { PrismaClient } from ".prisma/client";
import { CreateOrgDto } from "_api/dto/event";
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
      const orgs = await prisma.organizer.findMany();

      res.status(201).json(orgs);
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
    const { name, description, phone, email, web, location } =
      req.body as CreateOrgDto;
    const prisma = new PrismaClient();

    try {
      const org = await prisma.organizer.create({
        data: {
          name,
          description,
          phone,
          email,
          web,
          location,
        },
      });

      res.status(201).json({ orgId: org.id });
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
