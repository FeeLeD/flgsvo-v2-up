import React, { FC } from "react";
import { Center, Loader } from "@mantine/core";

const LoadingPage: FC = () => {
  return (
    <Center>
      <Loader size="xl" variant="dots" />
    </Center>
  );
};

export default LoadingPage;
