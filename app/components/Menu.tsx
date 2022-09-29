import React, { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MENU } from "./MENU_DATA";
import { Button, CSSObject, Group, Menu as MantineMenu } from "@mantine/core";
import { BsChevronDown } from "react-icons/bs";

type Props = {
  sx?: CSSObject | undefined;
};

const Menu: FC<Props> = ({ sx }) => {
  const { push: redirectTo } = useRouter();

  return (
    <Group
      spacing={12}
      sx={{
        "@media (max-width: 1100px)": {
          display: "none",
        },
        ...sx,
      }}
    >
      <Link href="/" passHref>
        <Button component="a">Новости</Button>
      </Link>

      {MENU.map((menu, i) => (
        <MantineMenu
          key={i}
          size="xl"
          control={<Button rightIcon={<BsChevronDown />}>{menu.title}</Button>}
          withArrow
        >
          {menu.items.map((item) => (
            <MantineMenu.Item
              key={item.title}
              icon={item.icon ? item?.icon : <></>}
              onClick={() => redirectTo(item.link)}
              disabled={!item.link}
            >
              {item.title}
            </MantineMenu.Item>
          ))}
        </MantineMenu>
      ))}
    </Group>
  );
};

export default Menu;
