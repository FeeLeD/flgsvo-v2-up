import { Post } from ".prisma/client";
import { CreatePostDto, PostDto, UpdatePostDto } from "./dto/post";
import { request } from "./request";

export const post = {
  getPosts: async () => {
    const posts = await request.get<Post[]>(`/api/post`);

    return posts;
  },
  getPost: async (id: string | number) => {
    const post = await request.get<PostDto>(`/api/post/${id}`);

    return post;
  },
  createPost: async (createPostDto: CreatePostDto) => {
    const post = await request.post<{ postId: number }>(
      `/api/post`,
      createPostDto
    );

    return post.postId;
  },
  updatePost: async ({ id, ...dto }: UpdatePostDto & { id: string }) => {
    const post = await request.put<{ postId: number }>(`/api/post/${id}`, dto);

    return post.postId;
  },
  deletePost: async (id: string | number) => {
    await request.delete(`/api/post/${id}`);
  },
};
