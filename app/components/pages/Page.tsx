import React, { FC } from "react";
import Head from "next/head";
import { useSession } from "next-auth/client";
import { UserSession } from "lib/types";
import { Box, Title, Text, TitleOrder, Group } from "@mantine/core";

type Props = {
  title?: string;
  subTitle?: JSX.Element | string;
  description?: string;
  adminPanel?: JSX.Element;
  titleProps?: {
    order?: TitleOrder;
  };
};

const Page: FC<Props> = ({
  title,
  subTitle,
  adminPanel = <></>,
  description = "Сайт федерации лыжных гонок Свердловской области",
  titleProps,
  children,
}) => {
  const [session] = useSession();

  return (
    <>
      <Head>
        <title>
          {title ? `${title} | ` : ""}
          Федерация лыжных гонок Свердловской области
        </title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Group
        sx={{
          position: "relative",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            "@media (max-width: 600px)": {
              width: "100%",
              textAlign: "center",
            },
          }}
        >
          <Title {...titleProps}>{title}</Title>
          {subTitle && typeof subTitle === "string" ? (
            <Text sx={{ opacity: 0.6 }}>{subTitle}</Text>
          ) : (
            <>{subTitle}</>
          )}
        </Box>

        {session?.user && (session.user as UserSession).isAdmin && adminPanel}
      </Group>

      <Box sx={{ marginTop: "24px", position: "relative" }}>{children}</Box>
    </>
  );
};

export default Page;
