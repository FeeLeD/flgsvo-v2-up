import React, { FC } from "react";
import NextLink from "next/link";
import { Paper, Text, Group, Button } from "@mantine/core";
import { paths } from "lib/paths";

const RegistrationPost: FC = () => {
  return (
    <Paper
      shadow="sm"
      padding="lg"
      sx={{
        borderRadius: "16px",
        border: "1px solid #1864AB",
      }}
    >
      <Group sx={{ justifyContent: "space-between" }}>
        <Text
          sx={{
            maxWidth: "85%",
            "@media (max-width: 1100px)": {
              maxWidth: "100%",
            },
          }}
        >
          Регистрация в базе лыжников-гонщиков Свердловской области теперь{" "}
          <b>доступна</b> на сайте
        </Text>

        <NextLink href={paths.athletes.register} passHref>
          <Button component="a" size="sm" sx={{ background: "#1864AB" }}>
            К регистрации
          </Button>
        </NextLink>
      </Group>
    </Paper>
  );
};

export default RegistrationPost;
