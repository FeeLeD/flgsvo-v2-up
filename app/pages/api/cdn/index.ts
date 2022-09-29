import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { MulterFile } from "types/multer.file";
import { YandexCloud } from "lib/yandexS3";
import nextConnect from "next-connect";
import multer from "multer";
import uniqid from "uniqid";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const apiRoute = nextConnect<
  NextApiRequest & { file: MulterFile },
  NextApiResponse
>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const uploadMiddleware = upload.single("file");
apiRoute.use(uploadMiddleware);

apiRoute.post(async (req, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session) {
    const file = req.file;
    const YaCloud = new YandexCloud();
    try {
      const result = await YaCloud.upload({
        buffer: file.buffer,
        path: "images",
        fileName: `${uniqid()}_${file.originalname}`,
        fileType: file.mimetype,
      });

      res.status(200).json({ url: result?.Location });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
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
