import React, { FC, useEffect, useState } from "react";
import { paths } from "lib/paths";
import { useApi } from "hooks";
import { useRouter } from "next/router";
import {
  defaultEventData,
  EventData,
} from "components/general/EventEditor/types";
import { Button, Title } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import EventEditor from "components/general/EventEditor";
import PrivateLayout from "components/PrivateLayout";
import LoadingPage from "components/LoadingPage";

const EditEventPage: FC = () => {
  const { showNotification } = useNotifications();
  const { query, push: redirectTo } = useRouter();
  const [event, eventLoading, loadEvent] = useApi(
    (api) => api.event.getEventById
  );
  const [_, updateLoading, updateEvent] = useApi(
    (api) => api.event.updateEvent
  );
  const [eventData, setEventData] = useState<EventData>(defaultEventData);

  useEffect(() => {
    if (query.id && typeof query.id === "string") loadEvent(query.id);
  }, [query.id]);

  useEffect(() => {
    if (event)
      setEventData({
        ...event,
        startDate: event.startDate ? new Date(event.startDate) : undefined,
        endDate: event.endDate ? new Date(event.endDate) : undefined,
        organizersIds: event.organizers.map((o) => o.id),
        description: event.description ?? "",
      });
  }, [event]);

  const onEdit = async () => {
    try {
      await updateEvent({
        eventId: query.id as string,
        ...eventData,
        startDate: eventData.startDate as Date,
        locationId: eventData.locationId as number,
      });

      redirectTo(paths.events.event(query.id as string));
    } catch (err) {
      showNotification({
        color: "red",
        message: "Событие не обновлено. Попробуйте ещё раз",
      });
    }
  };

  return (
    <PrivateLayout onlyAdmin>
      <Title>Редактирование события</Title>

      <div style={{ margin: "24px 0" }}>
        {eventLoading ? (
          <LoadingPage />
        ) : (
          <div>
            <EventEditor
              eventData={eventData}
              onDataUpdate={setEventData}
              editMode
            />

            <Button
              size="lg"
              disabled={
                !eventData.type ||
                !eventData.startDate ||
                !eventData.title ||
                !eventData.locationId
              }
              loading={updateLoading}
              onClick={onEdit}
              sx={{ margin: "40px 0 100px", float: "right" }}
            >
              Изменить событие
            </Button>
          </div>
        )}
      </div>
    </PrivateLayout>
  );
};

export default EditEventPage;
