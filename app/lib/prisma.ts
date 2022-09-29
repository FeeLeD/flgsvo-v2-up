import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as typeof global & { prisma: any }).prisma) {
    (global as typeof global & { prisma: any }).prisma = new PrismaClient();
  }

  prisma = (global as typeof global & { prisma: any }).prisma;
}

export default prisma;
