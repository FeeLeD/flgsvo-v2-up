import React, { FC, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Post } from "@prisma/client";
import { Pagination, Group } from "@mantine/core";
import RegistrationPost from "./RegistrationPost";
import PostComponent from "./Post";

type Props = {
  posts: Post[];
};

const PAGE_LENGTH = 5;

const Posts: FC<Props> = ({ posts }) => {
  const { query, push } = useRouter();

  const filteredPosts = useMemo(() => {
    let page = 0;
    if (query.page && typeof query.page === "string") {
      page = parseInt(query.page);
    }

    const skip = page * PAGE_LENGTH;

    return posts.reduce((arr, post, index) => {
      if (index >= skip && index < skip + PAGE_LENGTH) {
        return [...arr, post];
      }

      return arr;
    }, [] as Post[]);
  }, [query]);

  const acitvePage = useMemo(() => {
    return query.page && typeof query.page === "string"
      ? parseInt(query.page)
      : 0;
  }, [query]);

  const onPageChange = (page: number) => {
    push({ query: { page: page - 1 } });
  };

  return (
    <div>
      <RegistrationPost />
      <Group direction="column" sx={{ marginTop: "24px" }}>
        {filteredPosts.map((post) => (
          <PostComponent key={post.id} post={post} />
        ))}
      </Group>
      <Pagination
        total={Math.ceil(posts.length / PAGE_LENGTH)}
        page={acitvePage + 1}
        onChange={onPageChange}
        sx={{
          marginTop: "32px",
          "@media (max-width: 600px)": {
            width: "100%",
          },
        }}
      />
    </div>
  );
};

export default Posts;
