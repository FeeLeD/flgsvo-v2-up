import React, { FC } from "react";
import { RaceData } from "./types";
import { Race, RaceCategory, RaceType } from "@prisma/client";
import { Table, Title, Divider, Text } from "@mantine/core";
import RaceForm from "./RaceForm";
import RaceRow from "./RaceRow";

type Props = {
  races: Array<Omit<Race, "id" | "eventId"> & { id?: number }>;
  onChange?: (races: Omit<Race, "id" | "eventId">[]) => void;
};

const Races: FC<Props> = ({ races, onChange = () => ({}) }) => {
  const onRaceAdd = (race: RaceData) => {
    onChange([
      ...races,
      {
        id: race.id,
        description: race.description,
        date: race.date as Date,
        category: race.category as RaceCategory[],
        type: race.type as RaceType,
        style: race.style ?? null,
        distanceKm: race.distanceKm ?? null,
        startProtocolFileId: null,
      },
    ]);
  };

  const onRaceChange = (raceIndex: number) => {
    return (race: Omit<Race, "id" | "eventId">) => {
      const newRaces = [...races];
      newRaces[raceIndex] = race;
      onChange(newRaces);
    };
  };

  const onRaceRemove = (removeRaceIndex: number) => {
    return () => {
      onChange(races.filter((_, raceIndex) => raceIndex !== removeRaceIndex));
    };
  };

  return (
    <div style={{ width: "100%" }}>
      <Title order={4}>Дисциплины</Title>
      <Divider />

      {races.length > 0 && (
        <Table striped sx={{ margin: "8px 0" }}>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Дистанция</th>
              <th>Тип</th>
              <th>Стиль</th>
              <th>Категория</th>
              <th></th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {races.map((race, i) => (
              <RaceRow
                key={i}
                race={race}
                onChange={onRaceChange(i)}
                onRemove={onRaceRemove(i)}
              />
            ))}
          </tbody>
        </Table>
      )}

      <RaceForm onAdd={onRaceAdd} />
    </div>
  );
};

export default Races;
