import React, { FC } from "react";
import dynamic from "next/dynamic";
import { EventData, EventDataFile } from "./types";
import { Race, EventType } from ".prisma/client";
import { Checkbox, Group, Select, TextInput } from "@mantine/core";
import OrganizersSelect from "./OrganizersSelect";
import LocationSelect from "./LocationSelect";
import FilesUpload from "./FilesUpload";
import DateRange from "./DateRange";
import Races from "./Races";

const TextEditor = dynamic(() => import("@mantine/rte"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  eventData: EventData;
  onDataUpdate: (data: EventData) => void;
  editMode?: boolean;
};

const EventEditor: FC<Props> = ({
  eventData,
  onDataUpdate = () => ({}),
  editMode = false,
}) => {
  const updateData = (newData: Partial<EventData>) => {
    onDataUpdate({ ...eventData, ...newData });
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateData({ title: e.currentTarget.value });
  const onDescriptionChange = (description: string) =>
    updateData({ description });
  const onLocationChange = (locationId: number) => updateData({ locationId });
  const onOrgsChange = (organizersIds: number[]) =>
    updateData({ organizersIds });
  const onRacesChange = (races: Array<Omit<Race, "id" | "eventId">>) =>
    updateData({ races });
  const onFilesChange = (files: Array<EventDataFile>) => updateData({ files });
  const onRegistrationStateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateData({ registrationOpened: e.currentTarget.checked });

  return (
    <Group direction="column">
      <Select
        label="Тип события"
        data={[
          { value: "SKIING", label: "Лыжные гонки" },
          { value: "RUNNING", label: "Бег" },
          { value: "ROLLER", label: "Лыжероллеры" },
        ]}
        value={eventData.type}
        onChange={(type: EventType) => updateData({ type })}
        required
        sx={{ width: "184px" }}
      />

      <DateRange
        startDate={eventData.startDate}
        endDate={eventData.endDate}
        onChange={({ startDate, endDate }) =>
          updateData({ startDate, endDate })
        }
      />

      <TextInput
        label="Название события"
        value={eventData.title}
        onChange={onTitleChange}
        required
        sx={{ width: "100%" }}
      />

      <TextEditor
        value={eventData.description}
        onChange={onDescriptionChange}
        sx={{ width: "100%" }}
      />

      <LocationSelect
        locationId={eventData.locationId}
        onChange={onLocationChange}
      />

      <OrganizersSelect
        organizations={eventData.organizersIds}
        onChange={onOrgsChange}
      />

      {!editMode && (
        <>
          <Races races={eventData.races} onChange={onRacesChange} />

          <FilesUpload files={eventData.files} onChange={onFilesChange} />

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Checkbox
              label="Открыть регистрацию на соревнования"
              checked={eventData.registrationOpened}
              onChange={onRegistrationStateChange}
              sx={{ marginTop: "12px" }}
            />
          </div>
        </>
      )}
    </Group>
  );
};

export default EventEditor;
