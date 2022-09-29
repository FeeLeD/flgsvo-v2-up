import { useMemo } from "react";
import Head from "next/head";
import { GetStaticProps, NextPage } from "next";
import { Post, PrismaClient } from "@prisma/client";
import HomePage from "components/pages/Home";

type HomePageProps = {
  stringifyPosts: Array<
    Omit<Post, "createdAt" | "updatedAt"> & {
      createdAt: string;
      updatedAt: string;
    }
  >;
};

const Home: NextPage<HomePageProps> = ({ stringifyPosts }) => {
  const posts = useMemo(
    () =>
      stringifyPosts.map((post) => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
      })) ?? [],
    [stringifyPosts]
  );

  return (
    <>
      <Head>
        <title>Федерация лыжных гонок Свердловской области | Новости</title>
        <meta
          name="description"
          content="Сайт федерации лыжных гонок Свердловской области"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomePage posts={posts} />
    </>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const prisma = new PrismaClient();
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  prisma.$disconnect();

  return {
    props: {
      stringifyPosts: posts.map((post) => ({
        ...post,
        createdAt: post.createdAt.toDateString(),
        updatedAt: post.createdAt.toDateString(),
      })),
    },
    revalidate: 10,
  };
};

export default Home;
