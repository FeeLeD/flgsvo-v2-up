import React, { FC, useReducer } from "react";
import dayjs from "dayjs";
import { RaceData } from "./types";
import { eventParser } from "lib/eventParser";
import { Race, RaceType } from ".prisma/client";
import { ActionIcon } from "@mantine/core";
import RaceForm from "./RaceForm";
import { BsFillPencilFill, BsTrash } from "react-icons/bs";

type Props = {
  race: Omit<Race, "id" | "eventId"> & { id?: number };
  onChange: (race: Omit<Race, "id" | "eventId"> & { id?: number }) => void;
  onRemove: () => void;
};

const RaceRow: FC<Props> = ({
  race,
  onChange = () => ({}),
  onRemove = () => ({}),
}) => {
  const [editMode, toggleEditMode] = useReducer(
    (editMode: boolean) => !editMode,
    false
  );

  const onRaceChange = (race: RaceData) => {
    onChange({
      id: race?.id,
      description: race.description,
      date: race.date as Date,
      category: race.category,
      type: race.type as RaceType,
      style: race.style ?? null,
      distanceKm: race.distanceKm ?? null,
      startProtocolFileId: null,
    });
    toggleEditMode();
  };

  return (
    <tr>
      {editMode ? (
        <td colSpan={7}>
          <RaceForm
            race={race}
            onAdd={onRaceChange}
            onCancel={toggleEditMode}
          />
        </td>
      ) : (
        <>
          <td>{dayjs(race.date).format("DD.MM.YYYY")}</td>
          <td>{eventParser.distance(race.distanceKm)}</td>
          <td>{eventParser.shortType(race.type)}</td>
          <td>{eventParser.raceStyle(race.style)}</td>
          <td>{eventParser.category(race.category)}</td>
          <td style={{ width: "48px", paddingRight: 0 }}>
            <ActionIcon
              variant="outline"
              onClick={toggleEditMode}
              sx={(theme) => ({
                color: theme.colors.blue[4],
                borderColor: theme.colors.blue[4],
              })}
            >
              <BsFillPencilFill />
            </ActionIcon>
          </td>
          <td style={{ width: "48px", paddingRight: 0, paddingLeft: 0 }}>
            <ActionIcon
              variant="outline"
              onClick={onRemove}
              sx={(theme) => ({
                color: theme.colors.red[4],
                borderColor: theme.colors.red[4],
              })}
            >
              <BsTrash />
            </ActionIcon>
          </td>
        </>
      )}
    </tr>
  );
};

export default RaceRow;
