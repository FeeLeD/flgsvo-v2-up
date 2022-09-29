import { PrismaClient } from ".prisma/client";
import { UpdatePostDto } from "_api/dto/post";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.get(async (req, res: NextApiResponse) => {
  const { id } = req.query;
  const prisma = new PrismaClient();

  if (!id && typeof id !== "string") {
    res.status(500).json({ error: "Invalid post id" });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        files: true,
      },
    });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  } finally {
    prisma.$disconnect();
  }
});

apiRoute.delete(async (req, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session) {
    const { id } = req.query;
    const prisma = new PrismaClient();

    if (!id && typeof id !== "string") {
      res.status(500).json({ error: "Invalid event id" });
    }

    try {
      await prisma.post.delete({
        where: { id: parseInt(id as string) },
      });

      res.status(200).json({ status: "Deleted" });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    } finally {
      prisma.$disconnect();
    }
  } else {
    res.status(401);
  }
  res.end();
});

apiRoute.put(async (req, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session) {
    const { id } = req.query;
    const { title, content, files } = req.body as UpdatePostDto;
    const prisma = new PrismaClient();

    if (!id && typeof id !== "string") {
      res.status(500).json({ error: "Invalid post id format" });
    }

    try {
      const currentFiles = await prisma.file.findMany({
        where: { postId: parseInt(id as string) },
      });

      const { id: postId } = await prisma.post.update({
        where: { id: parseInt(id as string) },
        data: {
          title,
          content,
          files: {
            connectOrCreate: files.map((file) => ({
              where: {
                id: file.id ?? -1,
              },
              create: {
                name: file.name,
                sourceLink: file.url ?? "",
              },
            })),
            disconnect: currentFiles
              .filter((file) => !files.find((f) => f.url === file.sourceLink))
              .map((file) => ({ id: file.id })),
          },
        },
      });

      res.status(200).json({ postId });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    } finally {
      prisma.$disconnect();
    }
  } else {
    res.status(401);
  }
  res.end();
});

export default apiRoute;
