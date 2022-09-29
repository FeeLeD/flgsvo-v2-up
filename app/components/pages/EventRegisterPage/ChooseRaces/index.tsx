import React, { FC, useEffect } from "react";
import dayjs from "dayjs";
import { useApi } from "hooks";
import { Athlete, Race } from ".prisma/client";
import { eventParser } from "lib/eventParser";
import { useNotifications } from "@mantine/notifications";
import { Title, Group, Table, Text, Checkbox } from "@mantine/core";
import LoadingPage from "components/LoadingPage";
import { BsRecordFill } from "react-icons/bs";

type Props = {
  athlete: Athlete | undefined;
  races: Array<Race & { eventId: number; eventName: string }>;
  onChange: (
    race: Race & { eventId: number; eventName: string },
    isChosen: boolean
  ) => void;
};

const ChooseRaces: FC<Props> = ({
  races = [],
  athlete,
  onChange = () => ({}),
}) => {
  const { showNotification } = useNotifications();
  const [events, eventsLoading, loadEvents] = useApi(
    (api) => api.event.getAvailable
  );

  useEffect(() => {
    if (athlete) {
      onEventsSearch();
    }
  }, [athlete]);

  const onEventsSearch = async () => {
    try {
      if (athlete) {
        await loadEvents({
          gender: athlete.gender,
        });
      }
    } catch (err) {
      showNotification({
        color: "red",
        message:
          "Произошла ошибка при загрузке соревнований. Попробуйте ещё раз",
      });
    }
  };

  const onRaceChoose = (
    race: Race & { eventId: number; eventName: string }
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(race, e.currentTarget.checked);
    };
  };

  return (
    <>
      <Title order={3} sx={{ marginTop: "32px" }}>
        Доступные соревнования
      </Title>

      {eventsLoading ? (
        <div style={{ marginTop: "24px" }}>
          <LoadingPage />
        </div>
      ) : (
        <Group
          direction="column"
          sx={{ marginTop: "24px", width: "fit-content" }}
        >
          {events?.map((event) => (
            <Group
              key={event.id}
              direction="column"
              sx={{
                width: "100%",
                padding: "16px",
                background: "white",
                boxShadow:
                  "0 1px 3px rgb(0 0 0 / 5%), 0 1px 2px rgb(0 0 0 / 10%);",
                borderRadius: "8px",
              }}
            >
              <Group spacing={8}>
                <BsRecordFill color="#339AF0" />

                <Text size="lg" weight={500}>
                  {event.title}
                </Text>
              </Group>

              <Table sx={{ background: "white" }}>
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Дистанция</th>
                    <th>Стиль</th>
                    <th>Категория</th>
                    {<th></th>}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {event.races.map((race) => (
                    <tr key={race.id}>
                      <td>
                        <Text size="xs">
                          {dayjs(race.date).format("DD.MM.YYYY")}
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

                      <td>
                        <Checkbox
                          label="Выбрать"
                          checked={Boolean(races.find((r) => r.id === race.id))}
                          onChange={onRaceChoose({
                            ...race,
                            eventId: event.id,
                            eventName: event.title,
                          })}
                          sx={{ float: "right" }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Group>
          ))}
        </Group>
      )}
    </>
  );
};

export default ChooseRaces;
