import React, { FC, useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);
import Link from "next/link";
import { paths } from "lib/paths";
import { useApi } from "hooks";
import { Anchor, Box, Button, Center, Group, Text, Title } from "@mantine/core";
import { BsPlusLg } from "react-icons/bs";
import { GiSkis } from "react-icons/gi";
import EventCard from "./EventCard";
import Page from "../Page";
import LoadingPage from "components/LoadingPage";
import { ShortEventDto } from "_api/dto/event";

const CalendarPage: FC = () => {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const toggleEventFilter = () => setShowAllEvents(!showAllEvents);
  const [events, loading, loadEvents] = useApi((api) => api.event.getEvents);

  useEffect(() => {
    loadEvents("");
  }, []);

  const months = useMemo(() => {
    if (events) {
      const filteredEvents = events.filter((e) =>
        showAllEvents ? true : dayjs(e.endDate).isSameOrAfter(dayjs(), "date")
      );

      return filteredEvents.reduce((prev, current) => {
        const lastEvent = prev[prev.length - 1];
        if (!lastEvent) {
          return [
            ...prev,
            { date: dayjs(current.startDate), events: [current] },
          ];
        }

        if (dayjs(current.startDate).isSame(lastEvent.date, "month")) {
          const updatedArray = [...prev];
          updatedArray[updatedArray.length - 1].events.push(current);
          return updatedArray;
        } else {
          return [
            ...prev,
            { date: dayjs(current.startDate), events: [current] },
          ];
        }
      }, [] as Array<{ date: Dayjs; events: ShortEventDto[] }>);
    }

    return [];
  }, [events, showAllEvents]);

  return (
    <Page
      title="Календарь"
      subTitle={
        <Group direction="column" spacing={2} sx={{ marginTop: "8px" }}>
          <Anchor
            target="_blank"
            href="https://storage.yandexcloud.net/flgso-files/2022-%D0%B3%D0%BE%D0%B4-%D0%BA%D0%B0%D0%BB%D0%B5%D0%BD%D0%B4%D0%B0%D1%80%D1%8C-%D1%81%D0%BE%D1%80%D0%B5%D0%B2%D0%BD%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8%CC%86.pdf"
          >
            Календарный план соревнований на сезон 2021/2022
          </Anchor>

          <Anchor
            size="sm"
            onClick={toggleEventFilter}
            sx={(theme) => ({
              color: theme.colors.gray[6],
              "@media (max-width: 450px)": {
                margin: "auto",
              },
            })}
          >
            {showAllEvents
              ? "Скрыть прошедшие события"
              : "Показать прошедшие события"}
          </Anchor>
        </Group>
      }
      description="Календарь соревнований сайта Федерации лыжных гонок Свердловской области"
      adminPanel={
        <Link href={paths.events.new} passHref>
          <Button
            component="a"
            variant="outline"
            size="xs"
            leftIcon={<BsPlusLg />}
            sx={{
              "@media (max-width: 600px)": {
                width: "100%",
              },
            }}
          >
            Добавить событие
          </Button>
        </Link>
      }
    >
      <Group direction="column" sx={{ width: "100%", marginBottom: "100px" }}>
        {months.map((month, i) => (
          <React.Fragment key={i}>
            <Title order={4}>{month.date.format("MMMM").toUpperCase()}</Title>

            {month.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </React.Fragment>
        ))}
      </Group>

      {loading ? (
        <LoadingPage />
      ) : (
        months.length === 0 && (
          <Center sx={{ marginTop: "48px" }}>
            <Group
              direction="column"
              spacing={12}
              sx={{ alignItems: "center" }}
            >
              <GiSkis size="80px" style={{ opacity: 0.2 }} />
              <Text sx={{ opacity: 0.6 }}>Отсутствуют новые события</Text>
            </Group>
          </Center>
        )
      )}
    </Page>
  );
};

export default CalendarPage;
