import { PrismaClient } from ".prisma/client";
// import { error_athletes } from "lib/errorAthletes_TEMPORARY";
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
//   const session = await getSession({ req });

//   const many = [];
//   const alone = [];
//   if (session && (session.user as UserSession).isAdmin) {
//     const prisma = new PrismaClient();

//     try {
//       for (const athlete of error_athletes) {
//         const foundAthletes = await prisma.athlete.findMany({
//           where: {
//             firstName: { contains: athlete.firstName },
//             middleName: { contains: athlete.middleName },
//             lastName: { contains: athlete.lastName },
//             birthYear: athlete.birthYear,
//           },
//         });

//         if (foundAthletes.length > 1) {
//           many.push({ ...athlete, copies: foundAthletes.length });
//         } else {
//           alone.push(athlete);
//         }
//       }

//       console.log("ALONE: ", alone);
//       console.log("MANY: ", many);
//       console.log("alone: ", alone.length);
//       console.log("many: ", many.length);

//       res.status(201).json({ status: "Done" });
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ message: "Server error" });
//     } finally {
//       prisma.$disconnect();
//     }
//   } else {
//     res.status(401);
//   }
  res.end();
});

export default apiRoute;
