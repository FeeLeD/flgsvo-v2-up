import React, { FC, useEffect } from "react";
import { useApi } from "hooks";
import { Group, Text } from "@mantine/core";
import LoadingPage from "components/LoadingPage";
import EventCard from "./EventCard";
import Page from "../Page";

const ProtocolsPage: FC = () => {
  const [events, loading, loadOpenedEvents] = useApi(
    (api) => api.event.getOpened
  );

  useEffect(() => {
    loadOpenedEvents("");
  }, []);

  return (
    <Page
      title="Протоколы и результаты"
      description="Протоколы и результаты сайта Федерации лыжных гонок Свердловской области"
    >
      {loading ? (
        <LoadingPage />
      ) : (
        events && (
          <Group direction="column" sx={{ width: "100%" }}>
            {events.length > 0 ? (
              events.reverse().map((event) => (
                <EventCard key={event.id} shortEvent={event} />
              ))
            ) : (
              <Text sx={{ width: "100%", textAlign: "center", opacity: 0.4 }}>
                Событий не найдено
              </Text>
            )}
          </Group>
        )
      )}
    </Page>
  );
};

export default ProtocolsPage;
