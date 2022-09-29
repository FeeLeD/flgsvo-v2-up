import { NextApiHandler } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import { PrismaClient } from ".prisma/client";
import { compare } from "bcryptjs";
import { UserSession } from "lib/types";
import prisma from "lib/prisma";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options: NextAuthOptions = {
  session: {
    jwt: true,
  },
  callbacks: {
    jwt: async (token, user) => {
      //  "user" parameter is the object received from "authorize"
      //  "token" is being send below to "session" callback...
      //  ...so we set "user" param of "token" to object from "authorize"...
      //  ...and return it...
      user && (token.user = user);
      return Promise.resolve(token); // ...here
    },
    session: async (
      session: { user: UserSession },
      user: { user: UserSession }
    ) => {
      //  "session" is current session object
      //  below we set "user" param of "session" to value received from "jwt" callback
      session.user = user.user;
      return Promise.resolve(session);
    },
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials: { email: string; password: string }) {
        const prisma = new PrismaClient();

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            throw new Error("No user found with the email");
          }

          const isPasswordCorrect = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Password doesnt match");
          }

          const userObj: UserSession = {
            email: user.email,
            fullName: `${user.firstName} ${user.lastName}`,
            isAdmin: user.role === "ADMIN",
          };

          return userObj;
        } catch (err) {
          throw new Error("Server Error");
        } finally {
          prisma.$disconnect();
        }
      },
    }),
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
  secret: process.env.SECRET,
};
