import React, { FC } from "react";
import { Global } from "@mantine/core";

const GlobalStyles: FC = () => {
  return (
    <Global
      styles={(theme) => ({
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },

        body: {
          backgroundColor: "#F4F5F7",
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
          lineHeight: theme.lineHeight,
        },
      })}
    />
  );
};

export default GlobalStyles;
