import { File, Post } from ".prisma/client";
import { FileDto } from "./cdn";

export type PostDto = Post & {
  files: File[];
};

export type CreatePostDto = Pick<Post, "title" | "content"> & {
  files: FileDto[];
};
export type UpdatePostDto = Pick<Post, "title" | "content"> & {
  files: Array<FileDto & { id?: number }>;
};
