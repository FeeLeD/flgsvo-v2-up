import React, { FC, useState } from "react";
import { RaceByEventIdDto } from "_api/dto/event";
import { useSession } from "next-auth/client";
import { eventParser } from "lib/eventParser";
import { UserSession } from "lib/types";
import { paths } from "lib/paths";
import { Group, Text, Table, Select, Anchor } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import UploadResults from "./UploadResults";

type Props = {
  races: RaceByEventIdDto[];
};

const Protocols: FC<Props> = ({ races = [] }) => {
  const [session] = useSession();
  const { showNotification } = useNotifications();
  const [chosenRace, setChosenRaces] = useState<RaceByEventIdDto>();

  const onProtocolChange = (id: string) => {
    const race = races.find((race) => race.id === parseInt(id));
    if (race) setChosenRaces(race);
  };

  return (
    <Group direction="column" sx={{ width: "100%" }} spacing={24}>
      {session && (session.user as UserSession).isAdmin && (
        <UploadResults raceId={chosenRace?.id} />
      )}

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
        <Table
          striped={chosenRace.results.length > 0}
          sx={{ marginTop: "12px", background: "white" }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>Место</th>
              <th style={{ textAlign: "center" }}>Номер</th>
              <th>Спортсмен</th>
              <th>Год</th>
              <th>Команда</th>
              <th>Регион</th>
              <th>Результат</th>
              {/* <th>Отставание</th> */}
            </tr>
          </thead>

          <tbody>
            {chosenRace.results.length > 0 ? (
              chosenRace.results.map((result, i) => (
                <tr key={result.athlete.id}>
                  <td style={{ fontWeight: "bold", textAlign: "center" }}>
                    {result.place}
                  </td>
                  <td style={{ textAlign: "center", fontSize: "12px" }}>
                    {result.number}
                  </td>
                  <td>
                    <Anchor
                      target="_blank"
                      href={paths.athletes.athlete(result.athleteId)}
                    >
                      {result.athlete.lastName} {result.athlete.firstName}
                    </Anchor>
                  </td>
                  <td style={{ fontSize: "12px" }}>
                    {result.athlete.birthYear}
                  </td>
                  <td style={{ fontSize: "12px" }}>{result.athlete.team}</td>
                  <td style={{ fontSize: "12px" }}>{result.athlete.city}</td>
                  <td>{result.finalTime}</td>
                  {/* <td>{result.gap}</td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>
                  <Text
                    size="sm"
                    sx={{
                      textAlign: "center",
                      marginTop: "8px",
                      opacity: 0.6,
                    }}
                  >
                    Результаты отсутсвуют
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

export default Protocols;
