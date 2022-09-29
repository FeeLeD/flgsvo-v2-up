import React, { FC, useState } from "react";
import { paths } from "lib/paths";
import { useRouter } from "next/router";
import { useApi } from "hooks";
import {
  defaultEventData,
  EventData,
} from "components/general/EventEditor/types";
import { Button, Title } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import EventEditor from "components/general/EventEditor";
import PrivateLayout from "components/PrivateLayout";

const NewEventPage: FC = () => {
  const { push: redirectTo } = useRouter();
  const { showNotification } = useNotifications();
  const [_, isLoading, createEvent] = useApi((api) => api.event.createEvent);
  const [eventData, setEventData] = useState<EventData>(defaultEventData);

  const onAdd = async () => {
    try {
      console.log("PUBLISHED");
      await createEvent({
        ...eventData,
        startDate: eventData.startDate as Date,
        locationId: eventData.locationId as number,
      });

      redirectTo(paths.events.index);
    } catch (err) {
      showNotification({
        color: "red",
        message: "Событие не опубликовано. Попробуйте ещё раз",
      });
    }
  };

  return (
    <PrivateLayout onlyAdmin>
      <Title>Новое событие</Title>

      <div style={{ margin: "24px 0" }}>
        <EventEditor eventData={eventData} onDataUpdate={setEventData} />
      </div>

      <Button
        size="lg"
        disabled={
          !eventData.type ||
          !eventData.startDate ||
          !eventData.title ||
          !eventData.locationId
        }
        loading={isLoading}
        onClick={onAdd}
        sx={{ margin: "32px 0 100px", float: "right" }}
      >
        Создать событие
      </Button>
    </PrivateLayout>
  );
};

export default NewEventPage;
