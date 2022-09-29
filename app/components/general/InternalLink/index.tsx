import React, { FC } from "react";
import { Button } from "@mantine/core";
import Link from "next/link";

type Props = {
  href: string;
};

const InternalLink: FC<Props> = ({ href, children }) => {
  return (
    <Link href={href} passHref>
      <Button component="a">{children}</Button>
    </Link>
  );
};

export default InternalLink;
