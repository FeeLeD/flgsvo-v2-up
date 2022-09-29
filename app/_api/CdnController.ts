import { FileDto } from "./dto/cdn";
import { request } from "./request";

export const cdn = {
  uploadFile: async (formData: FormData) => {
    const file = await request.post<{ url: string }>(`/api/cdn/`, formData);

    return file.url;
  },
  uploadFiles: async (formData: FormData) => {
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };

    const files = await request.post<FileDto[]>(
      `/api/cdn/multi`,
      formData,
      config
    );
    files[0];

    return files;
  },
};
