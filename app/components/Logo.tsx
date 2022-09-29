import React, { FC } from "react";
import Image from "next/image";
import { Box, Group, Text, Title } from "@mantine/core";

const Logo: FC = () => {
  return (
    <Group
      spacing={24}
      sx={{
        "@media (max-width: 1101px)": {
          padding: "0 8px",
        },
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          "@media (max-width: 880px)": {
            width: "80px",
            display: "flex",
            justifyContent: "center",
          },
          "@media (max-width: 700px)": {
            width: "100%",
          },
        }}
      >
        <Image width={100} height={100} src="/flgso.png" alt="flgso" />
      </Box>

      <Box
        sx={{
          "@media (max-width: 700px)": {
            width: "100%",
          },
        }}
      >
        <Title
          order={2}
          sx={{
            "@media (max-width: 880px)": {
              fontSize: "22px",
            },
            "@media (max-width: 700px)": {
              width: "100%",
              textAlign: "center",
            },
          }}
        >
          Федерация лыжных гонок Свердловской области
        </Title>
        <Text
          sx={{
            "@media (max-width: 880px)": {
              fontSize: "16px",
            },
            "@media (max-width: 700px)": {
              width: "100%",
              textAlign: "center",
              marginTop: "8px",
            },
            opacity: 0.6,
          }}
        >
          Региональная общественная организация
        </Text>
      </Box>
    </Group>
  );
};

export default Logo;
