import React, { FC } from "react";
import Link from "next/link";
import { useSession } from "next-auth/client";
import {
  Box,
  Center,
  Container,
  Group,
  Title,
  Text,
  Anchor,
} from "@mantine/core";
import Menu from "./Menu";
import Logo from "./Logo";
import { BsSnow } from "react-icons/bs";
import { FaVk, FaFacebookSquare } from "react-icons/fa";
import SiteHeader from "./SiteHeader";

const Layout: FC = ({ children }) => {
  const [session] = useSession();

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header>
        <SiteHeader />

        <Center sx={{ margin: "48px 0" }}>
          <div>
            <Logo />

            <Menu sx={{ marginTop: "36px" }} />
          </div>
        </Center>
      </header>

      <main>
        <Container
          sx={{
            "@media (min-width: 1101px)": {
              width: "1056px",
            },
            "@media (max-width: 1100px)": {
              width: "95%",
            },
            maxWidth: "1056px",
            padding: 0,
            minHeight: "calc(100vh - 48px - 60px)",
          }}
        >
          {children}
        </Container>
      </main>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          marginTop: "120px",
        }}
      >
        <footer style={{ width: "100%", background: "#373A40" }}>
          <Box
            sx={{
              padding: "32px 0",
            }}
          >
            <Group
              sx={{
                margin: "auto",
                height: "100%",
                width: "1056px",
                maxWidth: "1056px",
                justifyContent: "space-between",
                "@media (max-width: 1100px)": {
                  width: "90%",
                },
              }}
            >
              <Group spacing={32}>
                <Box
                  sx={{
                    "@media (max-width: 800px)": {
                      display: "none",
                    },
                  }}
                >
                  <BsSnow size="84px" color="rgba(255,255,255,0.7)" />
                </Box>

                <div>
                  <Title
                    order={4}
                    sx={{
                      color: "#FFF",
                      "@media (max-width: 600px)": {
                        fontSize: "16px",
                      },
                    }}
                  >
                    Федерация лыжных гонок Свердловской области
                  </Title>

                  <Text
                    sx={{
                      color: "white",
                      opacity: 0.6,
                      marginTop: "16px",
                      "@media (max-width: 600px)": {
                        fontSize: "14px",
                      },
                    }}
                  >
                    620017, Российская Федерация, Свердловская область
                  </Text>
                  <Text
                    sx={{
                      color: "white",
                      opacity: 0.6,
                      "@media (max-width: 600px)": {
                        fontSize: "14px",
                      },
                    }}
                  >
                    Екатеринбург, ул. Старых Большевиков, 2а, офис 203
                  </Text>
                  <Text
                    sx={{
                      color: "white",
                      opacity: 0.6,
                      "@media (max-width: 600px)": {
                        fontSize: "14px",
                      },
                    }}
                  >
                    Телефон: +7 (343) 312-29-63 (доб. 104)
                  </Text>

                  {!session && (
                    <div style={{ marginTop: "16px" }}>
                      <Link href={"/signin"} passHref>
                        <Anchor sx={{ opacity: 0.6 }}>Войти</Anchor>
                      </Link>
                    </div>
                  )}
                </div>
              </Group>

              <Group>
                <Anchor href="https://vk.com/flgso" target="_blank">
                  <FaVk size="32px" color="#FFF" />
                </Anchor>

                {/* <Anchor href="https://web.facebook.com/flgso/" target="_blank">
                  <FaFacebookSquare size="32px" color="rgba(25, 118, 210)" />
                </Anchor> */}
              </Group>
            </Group>
          </Box>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
