import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from ".prisma/client";
import { hash } from "bcryptjs";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { firstName, lastName, otherName, email, password } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !email.includes("@") ||
      !password
    ) {
      res.status(422).json({ message: "Invalid Data" });
      return;
    }

    const prisma = new PrismaClient();

    try {
      const userWithTheSameEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (userWithTheSameEmail) {
        res.status(422).json({ message: "User already exists" });
        prisma.$disconnect();
        return;
      }

      await prisma.user.create({
        data: {
          firstName,
          lastName,
          otherName,
          email,
          password: await hash(password, 12),
        },
      });

      res.status(201).json({ message: "User created" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    } finally {
      prisma.$disconnect();
    }
  } else {
    res.status(500).json({ message: "Route not valid" });
  }
}

export default handler;
