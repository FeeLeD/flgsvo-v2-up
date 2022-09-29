import React, { FC } from "react";
import { Location } from ".prisma/client";
import { eventParser } from "lib/eventParser";
import { paths } from "lib/paths";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { BsFillCalendar3WeekFill, BsFillGeoAltFill } from "react-icons/bs";
import { Anchor, Group, Paper, Text, Title } from "@mantine/core";
import Page from "../Page";

type Props = {
  page: "Заявки" | "Стартовые протоколы" | "Результаты";
  event: {
    id: number;
    title: string;
    startDate: Date;
    endDate: Date | null;
    location: Location;
  };
};

const ProtocolLayout: FC<Props> = ({ children, page, event }) => {
  const { query } = useRouter();

  return (
    <Page
      title={event.title}
      titleProps={{ order: 2 }}
      subTitle={
        <Group
          direction="column"
          sx={{
            marginTop: "10px",
            "@media (max-width: 600px)": {
              alignContent: "center",
              justifyContent: "center",
            },
          }}
        >
          <Group spacing={24}>
            <Group
              spacing={4}
              sx={{
                opacity: 0.6,
                "@media (max-width: 600px)": {
                  width: "100%",
                  justifyContent: "center",
                },
              }}
            >
              <BsFillGeoAltFill style={{ opacity: 0.6 }} />
              <Text>{event.location.name}</Text>
            </Group>

            <Group
              spacing={8}
              sx={{
                opacity: 0.6,
                "@media (max-width: 600px)": {
                  width: "100%",
                  justifyContent: "center",
                },
              }}
            >
              <BsFillCalendar3WeekFill style={{ opacity: 0.6 }} />
              <Text
                sx={{
                  "@media (max-width: 600px)": {
                    fontSize: "14px",
                  },
                }}
              >
                {eventParser.dateString({
                  startDate: event.startDate,
                  endDate: event.endDate,
                })}
              </Text>
            </Group>
          </Group>

          <Group
            sx={{
              "@media (max-width: 600px)": {
                width: "100%",
                justifyContent: "center",
              },
            }}
          >
            <NextLink
              href={paths.events.protocol(query.eventId as string)}
              passHref
            >
              <Anchor sx={{ fontWeight: page === "Заявки" ? "bold" : "" }}>
                Заявки
              </Anchor>
            </NextLink>

            <div
              style={{
                height: "24px",
                width: "1px",
                background: "rgba(0,0,0,.4)",
              }}
            />

            <NextLink
              href={paths.events.protocol_start(query.eventId as string)}
              passHref
            >
              <Anchor
                sx={{
                  fontWeight: page === "Стартовые протоколы" ? "bold" : "",
                }}
              >
                Стартовые протоколы
              </Anchor>
            </NextLink>

            <div
              style={{
                height: "24px",
                width: "1px",
                background: "rgba(0,0,0,.4)",
              }}
            />

            <NextLink
              href={paths.events.protocol_results(query.eventId as string)}
              passHref
            >
              <Anchor sx={{ fontWeight: page === "Результаты" ? "bold" : "" }}>
                Результаты
              </Anchor>
            </NextLink>
          </Group>
        </Group>
      }
      description={`${page} соревнований: ${event.title}, ${event.location.name}}. Сайт Федерации лыжных гонок Свердловской области`}
    >
      <Paper padding="xl" shadow="xs" sx={{ borderRadius: "16px" }}>
        <Title order={2} sx={{ marginBottom: "12px" }}>
          {page}
        </Title>

        {children}
      </Paper>
    </Page>
  );
};

export default ProtocolLayout;
