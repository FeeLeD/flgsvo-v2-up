import { PrismaClient } from ".prisma/client";
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
    const prisma = new PrismaClient();

    try {
      const athletes = await prisma.athlete.findMany();

      for (const athlete of athletes) {
        await prisma.athlete.update({
          where: { id: athlete.id },
          data: {
            birthYear:
              new Date(athlete.birthDate).getFullYear() === 1900
                ? null
                : new Date(athlete.birthDate).getFullYear(),
          },
        });
      }

      res.status(201).json({ status: "Updated" });
    } catch (err) {
      console.log(err);
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
