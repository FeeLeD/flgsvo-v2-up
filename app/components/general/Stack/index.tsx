import React, { FC } from "react";
import { Box, CSSObject } from "@mantine/core";

export type StackProps = {
  spacing?: string;
  direction?: "column" | "row";
  sx?: CSSObject;
};

const Stack: FC<StackProps> = ({
  spacing = "8px",
  direction = "column",
  sx,
  children,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: direction,
        "& > *:first-of-type": {
          marginTop: "0",
        },
        "& > *:last-child": {
          marginRight: "0",
        },
        "& > *": {
          marginTop: direction === "column" ? spacing : "0",
          marginRight: direction === "row" ? spacing : "0",
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default Stack;
export { default as HStack } from "./HStack";
