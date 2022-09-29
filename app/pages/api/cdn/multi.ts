import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { MulterFile } from "types/multer.file";
import { YandexCloud } from "lib/yandexS3";
import nextConnect from "next-connect";
import multer from "multer";
import { UserSession } from "lib/types";
import { PrismaClient } from ".prisma/client";

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fieldSize: 100000000 } });

const apiRoute = nextConnect<
  NextApiRequest & { files: MulterFile[] },
  NextApiResponse
>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const uploadMiddleware = upload.array("files", 10);
apiRoute.use(uploadMiddleware);

apiRoute.post(async (req, res: NextApiResponse) => {
  const session = await getSession({ req });
  const prisma = new PrismaClient();

  if (session && (session.user as UserSession).isAdmin) {
    const files = req.files;
    const YaCloud = new YandexCloud();
    try {
      const results = await Promise.allSettled(
        files.map((file) =>
          YaCloud.upload({
            buffer: file.buffer,
            path: "files",
            fileName: file.originalname,
            fileType: file.mimetype,
          })
        )
      );

      const urls = results.map((res, i) => ({
        name: files[i].originalname,
        url: res.status === "fulfilled" ? res.value?.Location : undefined,
        error: res.status === "rejected" ? res.reason : undefined,
      }));

      res.status(200).json(urls);
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

export const config = {
  api: {
    bodyParser: false,
  },
};
