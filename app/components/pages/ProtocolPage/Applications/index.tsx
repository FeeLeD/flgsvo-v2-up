import React, { FC, useState } from "react";
import { RaceByEventIdDto } from "_api/dto/event";
import { eventParser } from "lib/eventParser";
import { Group, Select, Table, Text } from "@mantine/core";

type Props = {
  races: RaceByEventIdDto[];
};

const Applications: FC<Props> = ({ races }) => {
  const [chosenRace, setChosenRaces] = useState<RaceByEventIdDto>();

  const onProtocolChange = (id: string) => {
    const race = races.find((race) => race.id === parseInt(id));
    if (race) setChosenRaces(race);
  };

  return (
    <Group direction="column" sx={{ width: "100%" }}>
      <Select
        label="Выберите дистанцию"
        data={
          races.map((race) => ({
            label: `${eventParser.discipline({
              distanceKm: race.distanceKm,
              type: race.type,
            })} ${eventParser.raceStyle(race.style)} (${eventParser.category(
              race.category
            )})`,
            value: race.id.toString(),
          })) ?? []
        }
        onChange={onProtocolChange}
        sx={{
          width: "400px",
          "@media (max-width: 600px)": {
            width: "100%",
          },
        }}
      />

      {chosenRace && (
        <Table sx={{ marginTop: "12px", background: "white" }}>
          <thead>
            <tr>
              <th>№</th>
              <th>Имя</th>
              <th>Год</th>
              <th>Команда</th>
              <th>Регион</th>
            </tr>
          </thead>

          <tbody>
            {/* TEMP */}
            {chosenRace.athletes.length > 0 ? (
              chosenRace.athletes.map((application, i) => (
                <tr key={application.athlete.id}>
                  <td>{i + 1}</td>
                  <td>
                    {application.athlete.lastName}{" "}
                    {application.athlete.firstName}
                  </td>
                  <td>{application.athlete.birthYear}</td>
                  <td>{application.athlete.team}</td>
                  <td>{application.athlete.city}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <Text
                    size="sm"
                    sx={{
                      textAlign: "center",
                      marginTop: "8px",
                      opacity: 0.6,
                    }}
                  >
                    Заявки отсутсвуют
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Group>
  );
};

export default Applications;
