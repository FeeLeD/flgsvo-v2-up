import React, { FC } from "react";
import Stack, { StackProps } from ".";

const HStack: FC<StackProps> = (props) => {
  return <Stack direction="row" {...props} />;
};

export default HStack;
