import React, { FC } from "react";
import Link from "next/link";
import { Post } from ".prisma/client";
import { useSession } from "next-auth/client";
import { paths } from "lib/paths";
import { UserSession } from "lib/types";
import { Title, Button, Center, Text, Group, Box } from "@mantine/core";
import { BsPlusLg } from "react-icons/bs";
import { GiSkis } from "react-icons/gi";
import Posts from "./Posts";

type Props = {
  posts: Post[];
};

const HomePage: FC<Props> = ({ posts }) => {
  const [session] = useSession();

  return (
    <>
      <Group
        sx={{
          position: "relative",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title
          id="news-title"
          sx={{
            "@media (max-width: 600px)": {
              width: "100%",
              textAlign: "center",
            },
          }}
        >
          Новости
        </Title>

        {session?.user && (session.user as UserSession).isAdmin && (
          <Link href={paths.post.new} passHref>
            <Button
              component="a"
              variant="outline"
              size="xs"
              leftIcon={<BsPlusLg />}
              sx={{
                "@media (max-width: 600px)": {
                  width: "100%",
                },
              }}
            >
              Добавить новость
            </Button>
          </Link>
        )}
      </Group>

      <Box sx={{ margin: "24px 0" }}>
        <Posts posts={posts} />
      </Box>

      {posts.length === 0 && (
        <Center sx={{ marginTop: "48px" }}>
          <Group direction="column" spacing={12} sx={{ alignItems: "center" }}>
            <GiSkis size="80px" style={{ opacity: 0.2 }} />
            <Text sx={{ opacity: 0.6 }}>Новостная лента пуста</Text>
          </Group>
        </Center>
      )}
    </>
  );
};

export default HomePage;
