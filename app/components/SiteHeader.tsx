import React, { FC, useState } from "react";
import Link from "next/link";
import { paths } from "lib/paths";
import { signOut, useSession } from "next-auth/client";
import {
  Anchor,
  Group,
  Header,
  Text,
  Button,
  Burger,
  Drawer,
  Box,
  Title,
} from "@mantine/core";
import { UserSession } from "lib/types";
import { MENU } from "./MENU_DATA";

const SiteHeader: FC = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const openMenu = () => setMenuOpened(true);
  const closeMenu = () => setMenuOpened(false);
  const toggleMenu = () => setMenuOpened(!menuOpened);
  const [session] = useSession();

  return (
    <Header
      height={60}
      sx={{
        "@media (max-width: 1100px)": {
          display: "flex",
          padding: "0 24px",
        },
        display: session ? "flex" : "none",
        padding: "0 48px",
      }}
    >
      <Group
        spacing="md"
        sx={{
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Group>
          <Box
            sx={{
              "@media (max-width: 1100px)": {
                display: "flex",
              },
              display: "none",
            }}
          >
            <Burger
              size="lg"
              color="#1971C2"
              opened={menuOpened}
              onClick={toggleMenu}
            />

            <Drawer
              opened={menuOpened}
              onClose={closeMenu}
              title={
                session && (session.user as UserSession).isAdmin
                  ? `${(session.user as UserSession).fullName}`
                  : ""
              }
              padding="xl"
              size="xl"
            >
              <Box sx={{ height: "95%", overflow: "auto" }}>
                {(session && (session.user as UserSession).isAdmin
                  ? [
                      {
                        title: "Администрация",
                        items: [
                          {
                            title: "Панель управления",
                            link: paths.admin.control.index,
                            icon: <></>,
                          },
                          {
                            title: "Спортсмены",
                            link: paths.admin.athletes.index,
                            icon: <></>,
                          },
                        ],
                      },
                      ...MENU,
                    ]
                  : MENU
                ).map((item, i) => (
                  <Box key={i}>
                    <Title order={3}>{item.title}</Title>

                    <Group
                      direction="column"
                      spacing={8}
                      sx={{ marginTop: "8px", marginBottom: "16px" }}
                    >
                      {item.title === "Федерация" && (
                        <Link href="/" passHref>
                          <Anchor onClick={closeMenu}>Новости</Anchor>
                        </Link>
                      )}

                      {item.items.map((menu, j) =>
                        menu?.link ? (
                          <Link key={`item_${j}`} href={menu.link} passHref>
                            <Anchor onClick={closeMenu}>{menu.title}</Anchor>
                          </Link>
                        ) : (
                          <Text key={`item_${j}`} sx={{ opacity: 0.6 }}>
                            {menu.title}
                          </Text>
                        )
                      )}
                    </Group>
                  </Box>
                ))}
              </Box>
            </Drawer>
          </Box>

          {session && (
            <Group
              sx={{
                "@media (max-width: 820px)": {
                  display: "none",
                },
                display: "flex",
              }}
            >
              <Link href={paths.admin.control.index} passHref>
                <Anchor component="a">Панель управления</Anchor>
              </Link>

              <div
                style={{
                  height: "36px",
                  width: "1px",
                  background: "rgba(0,0,0,.4)",
                }}
              />

              <Link href={paths.admin.athletes.index} passHref>
                <Anchor component="a">Спортсмены</Anchor>
              </Link>
            </Group>
          )}
        </Group>

        {session && (
          <Group>
            <Text
              sx={{
                "@media (max-width: 560px)": {
                  display: "none",
                },
              }}
            >
              {(session.user as UserSession).fullName}
            </Text>
            <Button variant="light" onClick={() => signOut()}>
              Выйти
            </Button>
          </Group>
        )}
      </Group>
    </Header>
  );
};

export default SiteHeader;
