import { PrismaClient } from ".prisma/client";
import { ChangeStartProtocolDto } from "_api/dto/event";
import { UserSession } from "lib/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(async (req, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session && (session.user as UserSession).isAdmin) {
    const { id } = req.query;

    if (!id && typeof id !== "string") {
      res.status(500).json({ error: "Invalid race id" });
    }

    const { file } = req.body as ChangeStartProtocolDto;
    const prisma = new PrismaClient();

    try {
      const race = await prisma.race.update({
        where: { id: parseInt(id as string) },
        data: {
          startProtocol: {
            create: {
              name: file.name,
              sourceLink: file.url ?? "",
            },
          },
        },
      });

      res.status(201).json({ raceId: race.id });
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
