import { PrismaClient } from ".prisma/client";
import { CreatePostDto } from "_api/dto/post";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.get(async (req, res: NextApiResponse) => {
  const prisma = new PrismaClient();

  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(201).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  } finally {
    prisma.$disconnect();
  }
});

apiRoute.post(async (req, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session) {
    const { title, content, files } = req.body as CreatePostDto;
    const prisma = new PrismaClient();

    try {
      const post = await prisma.post.create({
        data: {
          title: title,
          content: content,
          author: { connect: { email: session?.user?.email as string } },
          files: {
            createMany: {
              data: files.map((file) => ({
                name: file.name,
                sourceLink: file.url ?? "",
              })),
            },
          },
        },
      });

      res.status(201).json({ postId: post.id });
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
