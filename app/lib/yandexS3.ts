import AWS from "aws-sdk";

export class YandexCloud {
  aws: AWS.S3;

  constructor() {
    this.aws = new AWS.S3({
      endpoint: "https://storage.yandexcloud.net",
      accessKeyId: "Oy6Gs7tNLz2377LB20fO",
      secretAccessKey: "bRcu9S3Qth6JiusKjHhUkmtvZnDk5w7AJhSAz9DO",
      region: "ru-central1",
      httpOptions: {
        timeout: 10000,
        connectTimeout: 10000,
      },
    });
  }

  async upload({
    buffer,
    path,
    fileName,
    fileType,
  }: {
    buffer: Buffer;
    path: string;
    fileName: string;
    fileType: string;
  }) {
    try {
      const params = {
        Bucket: "flgso-files",
        Key: `${path}/${fileName}`,
        Body: buffer,
        ContentType: fileType,
      };

      const result: AWS.S3.ManagedUpload.SendData = await new Promise(
        (resolve, reject) => {
          this.aws.upload(
            params,
            (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
              if (err) return reject(err);
              return resolve(data);
            }
          );
        }
      );

      return result;
    } catch (e) {
      console.error(e);
    }
  }
}
