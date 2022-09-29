import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from ".prisma/client";
import nextConnect from "next-connect";
import { FilterDto } from "_api/dto/athletes";
import { getSession } from "next-auth/client";
import { UserSession } from "lib/types";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(async (req, res: NextApiResponse) => {
  const { confirmed } = req.body as FilterDto;
  const session = await getSession({ req });

  if (session && (session.user as UserSession).isAdmin) {
    const prisma = new PrismaClient();

    try {
      const athletes = await prisma.athlete.findMany({
        where: typeof confirmed === "boolean" ? { confirmed } : {},
      });

      res.status(201).json(athletes);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    } finally {
      prisma.$disconnect();
    }
  }
});

export default apiRoute;
