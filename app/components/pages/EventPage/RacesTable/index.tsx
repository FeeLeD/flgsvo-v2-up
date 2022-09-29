import React, { FC } from "react";
import dayjs from "dayjs";
import { Race } from ".prisma/client";
import { eventParser } from "lib/eventParser";
import { Button, Table, Text } from "@mantine/core";
import { useSession } from "next-auth/client";
import { UserSession } from "lib/types";

type Props = {
  races: Race[];
};

const RacesTable: FC<Props> = ({ races }) => {
  const [session] = useSession();

  const rows = races.map((race, i) => (
    <tr key={race.id}>
      <td>
        <Text size="xs">
          {i !== 0 && dayjs(race.date).isSame(dayjs(races[i - 1].date), "date")
            ? ""
            : dayjs(race.date).format("DD.MM.YYYY")}
        </Text>
      </td>
      <td>
        {eventParser.discipline({
          distanceKm: race.distanceKm,
          type: race.type,
        })}
      </td>
      <td>{eventParser.raceStyle(race.style)}</td>
      <td>{eventParser.category(race.category)}</td>
    </tr>
  ));

  return (
    <div style={{ position: "relative" }}>
      {(session?.user as UserSession)?.isAdmin && (
        <Button
          variant="outline"
          size="sm"
          compact
          sx={{ position: "absolute", right: 0, top: "-8px" }}
        >
          Изменить
        </Button>
      )}

      {rows.length === 0 ? (
        <Text size="sm" sx={{ opacity: 0.6 }}>
          Нет расписания соревнований
        </Text>
      ) : (
        <Table sx={{ background: "white" }}>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Дистанция</th>
              <th>Стиль</th>
              <th>Категория</th>
            </tr>
          </thead>

          <tbody>{rows}</tbody>
        </Table>
      )}
    </div>
  );
};

export default RacesTable;
