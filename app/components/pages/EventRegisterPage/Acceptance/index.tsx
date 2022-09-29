import React, { FC, useState } from "react";
import { storage } from "../storage";
import Link from "next/link";
import dayjs from "dayjs";
import { useApi } from "hooks";
import { paths } from "lib/paths";
import { eventParser } from "lib/eventParser";
import { Athlete, Race } from ".prisma/client";
import { useNotifications } from "@mantine/notifications";
import {
  Anchor,
  Box,
  Button,
  Group,
  Paper,
  // Radio,
  // RadioGroup,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  BsCalendarCheckFill,
  BsFillCalendarCheckFill,
  BsPersonSquare,
} from "react-icons/bs";

type Props = {
  races: Array<Race & { eventId: number; eventName: string }>;
  athlete: Athlete;
  onReset: () => void;
};

const Acceptance: FC<Props> = ({
  races = [],
  athlete,
  onReset = () => ({}),
}) => {
  const { showNotification } = useNotifications();
  const [registered, setRegistered] = useState(false);
  const [_, registerLoading, register] = useApi((api) => api.event.register);
  // const [bindingTypes, setBindingTypes] = useState<{
  //   [id: string]: "NNN" | "SNS" | undefined;
  // }>(races.reduce((obj, race) => ({ ...obj, [race.id]: undefined }), {}));

  const onRegister = async () => {
    try {
      const result = await register({
        athleteId: athlete.id,
        racesIds: races.map((r) => r.id),
        // payload: { bindingTypes },
      });

      if (result?.registered.length === races.length) {
        showNotification({
          color: "green",
          title: "Заявка отправлена",
          message: "Спортсмен зарегистрирован на выбранные дисциплины",
        });
        setRegistered(true);
        storage.reset();
      } else {
        result?.registered.forEach((id) => {
          const race = races.find((r) => r.id === id);

          if (race) {
            showNotification({
              color: "green",
              message: `Спортсмен зарегистрирован на ${eventParser.discipline({
                distanceKm: race.distanceKm,
                type: race.type,
              })} ${eventParser.raceStyle(race.style)} (${dayjs(
                race.date
              ).format("DD.MM.YYYY")})`,
            });
          }
        });

        result?.failed.forEach((id) => {
          const race = races.find((r) => r.id === id);

          if (race) {
            showNotification({
              color: "red",
              message: `Спортсмен уже зарегистрирован на ${eventParser.discipline(
                {
                  distanceKm: race.distanceKm,
                  type: race.type,
                }
              )} ${eventParser.raceStyle(race.style)} (${dayjs(
                race.date
              ).format("DD.MM.YYYY")})`,
            });
          }
        });
      }
    } catch (err) {
      showNotification({
        color: "red",
        message: "Произошла ошибка. Заявка не отправлена",
        autoClose: false,
      });
    }
  };

  return (
    <>
      {registered && (
        <div
          style={{
            position: "absolute",
            marginTop: "24px",
            right: 0,
            height: "50px",
            width: "210px",
            background: "white",
          }}
        />
      )}

      <Title order={3} sx={{ marginTop: "32px" }}>
        Подтверждение
      </Title>

      <Text
        sx={{
          width: "80%",
          marginTop: "4px",
          "@media (max-width: 600px)": {
            width: "100%",
          },
        }}
      >
        {races[0]?.eventName}
      </Text>

      <Link href={paths.events.protocol(races[0]?.eventId)} passHref>
        <Anchor sx={{ fontSize: "14px" }}>Заявки</Anchor>
      </Link>

      <Paper
        padding="xl"
        shadow="xs"
        sx={{
          marginTop: "24px",
          borderRadius: "8px",
          "@media (max-width: 600px)": {
            padding: "12px",
          },
        }}
      >
        {registered ? (
          <Group
            direction="column"
            spacing={24}
            sx={{ width: "100%", alignItems: "center" }}
          >
            <Group sx={{ width: "100%", justifyContent: "center" }}>
              <BsFillCalendarCheckFill size="24px" color="#339AF0" />

              <Text size="lg">
                Предварительная регистрация успешно завершена!
              </Text>
            </Group>

            <Button variant="outline" compact onClick={onReset}>
              Зарегистрировать другого спортсмена
            </Button>
          </Group>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "300px auto",
                gridGap: "32px",
                "@media (max-width: 600px)": {
                  gridTemplateColumns: "1fr",
                },
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <Group spacing={8}>
                  <BsPersonSquare color="#339AF0" />
                  <Title order={4}>Спортсмен</Title>
                </Group>

                <Group
                  direction="column"
                  spacing={4}
                  sx={{ marginTop: "20px" }}
                >
                  <Text>
                    {athlete.lastName} {athlete.firstName} {athlete.middleName}
                  </Text>
                  <Text size="sm" sx={{ opacity: 0.6 }}>
                    Год рождения:{" "}
                    {dayjs(athlete.birthDate).year() === 1900
                      ? "–"
                      : dayjs(athlete.birthDate).format("YYYY")}
                  </Text>
                  <Text size="sm" sx={{ opacity: 0.6 }}>
                    {athlete.team}
                  </Text>
                  <Text size="sm" sx={{ opacity: 0.6 }}>
                    {athlete.city}
                  </Text>
                </Group>
              </div>

              <div>
                <Group spacing={8}>
                  <BsCalendarCheckFill color="#339AF0" />
                  <Title order={4}>Дисциплины</Title>
                </Group>
                {/* <Text sx={{ fontSize: "14px", opacity: 0.8 }}>
                  Выберите тип крепления на каждую гонку
                  <span style={{ color: "red" }}>*</span>
                </Text> */}

                <Table sx={{ marginTop: "12px", background: "white" }}>
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Дистанция</th>
                      <th>Стиль</th>
                      {/* <th>Крепления</th> */}
                      <th>Категория</th>
                    </tr>
                  </thead>
                  <tbody>
                    {races.map((race) => (
                      <tr key={race.id}>
                        <td>
                          <Text size="sm">
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

                        {/* <td style={{ width: "120px" }}>
                          <RadioGroup
                            size="sm"
                            onChange={(bindingType) =>
                              setBindingTypes((oldTypes) => ({
                                ...oldTypes,
                                [race.id]: bindingType as "NNN" | "SNS",
                              }))
                            }
                          >
                            <Radio value="NNN">NNN</Radio>
                            <Radio value="SNS">SNS</Radio>
                          </RadioGroup>
                        </td> */}

                        <td>{eventParser.category(race.category)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Box>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                loading={registerLoading}
                onClick={onRegister}
                // disabled={Object.values(bindingTypes).some((type) => !type)}
                sx={{ marginTop: "48px" }}
              >
                Отправить заявку
              </Button>
            </div>
          </>
        )}
      </Paper>
    </>
  );
};

export default Acceptance;
