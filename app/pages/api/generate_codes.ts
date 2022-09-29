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
      const manMaxCode = await prisma.athlete.aggregate({
        _max: { code: true },
        where: { gender: "MAN" },
      });
      const womanMaxCode = await prisma.athlete.aggregate({
        _max: { code: true },
        where: { gender: "WOMAN" },
      });

      const athletesWithoutCode = await prisma.athlete.findMany({
        where: { code: { lt: 70000 }, confirmed: true },
      });

      let manCode = manMaxCode._max.code;
      let womanCode = womanMaxCode._max.code;

      if (!manCode || !womanCode) return;

      for (const athlete of athletesWithoutCode) {
        let code = 0;
        if (athlete.gender === "MAN") {
          code = manCode + 1;
          manCode++;
        } else if (athlete.gender === "WOMAN") {
          code = womanCode + 1;
          womanCode++;
        }
        console.log(athlete.id);

        await prisma.athlete.update({
          where: { id: athlete.id },
          data: { code },
        });
      }

      res.status(201).json({ status: "Done" });
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
