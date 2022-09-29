import React, { FC } from "react";
import NextLink from "next/link";
import dayjs from "dayjs";
import { paths } from "lib/paths";
import { Race, Results } from ".prisma/client";
import { eventParser } from "lib/eventParser";
import { Anchor, Table, Text } from "@mantine/core";

type Props = {
  results: (Results & {
    race: Race & {
      event: {
        title: string;
      } | null;
    };
  })[];
};

const Races: FC<Props> = ({ results = [] }) => {
  return (
    <Table sx={{ marginTop: "12px", background: "white" }}>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Событие</th>
          <th>Категория</th>
          <th>Дисциплина</th>
          <th style={{ textAlign: "center" }}>Место</th>
        </tr>
      </thead>

      <tbody>
        {results.length > 0 ? (
          results.map((result) => (
            <tr key={result.id}>
              <td>{dayjs(result.race.date).format("DD.MM.YYYY")}</td>
              <td style={{ maxWidth: "300px" }}>
                <NextLink
                  href={paths.events.protocol_results(
                    result.race.eventId ?? ""
                  )}
                  passHref
                >
                  <Anchor size="xs">{result.race.event?.title}</Anchor>
                </NextLink>
              </td>
              <td style={{ maxWidth: "200px", fontSize: "12px" }}>
                {eventParser.category(result.race.category)}
              </td>
              <td style={{ maxWidth: "200px" }}>
                {eventParser.discipline({
                  distanceKm: result.race.distanceKm,
                  type: result.race.type,
                })}{" "}
                ({eventParser.raceStyle(result.race.style)})
              </td>
              <td style={{ textAlign: "center", fontWeight: "bold" }}>
                {result.place}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={8}>
              <Text
                size="sm"
                sx={{
                  textAlign: "center",
                  marginTop: "12px",
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
  );
};

export default Races;
