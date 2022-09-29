import React, { FC } from "react";
import { AthleteDto } from "_api/dto/athletes";
import { athleteParser, SPORT_LEVEL } from "../utils";
import { Group, Avatar, Badge, Text } from "@mantine/core";

type Props = {
  athlete: AthleteDto;
};

const Profile: FC<Props> = ({ athlete }) => {
  return (
    <Group spacing={32} align="flex-start">
      <Avatar
        size={200}
        radius="lg"
        sx={{
          "@media (max-width: 600px)": {
            margin: "auto",
          },
        }}
      />

      <Group direction="column" spacing={24}>
        <Group>
          {SPORT_LEVEL[athlete.sportLevel] !== "" && (
            <Badge variant="outline">{SPORT_LEVEL[athlete.sportLevel]}</Badge>
          )}
          {!athlete.confirmed && (
            <Badge variant="dot" color="yellow">
              Оплата не подтверждена
            </Badge>
          )}
        </Group>

        <Group spacing={32} align="flex-start">
          <Group direction="column" spacing={8}>
            <Group>
              <Text size="sm" sx={{ opacity: 0.6 }}>
                Пол
              </Text>
              <Text>{athlete.gender === "MAN" ? "Мужской" : "Женский"}</Text>
            </Group>

            <Group>
              <Text size="sm" sx={{ opacity: 0.6 }}>
                Дата рождения
              </Text>
              <Text>{athleteParser.birthDate(athlete.birthDate)}</Text>
            </Group>

            <Group>
              <Text size="sm" sx={{ opacity: 0.6 }}>
                Команда
              </Text>
              <Text lineClamp={1} sx={{ maxWidth: "400px" }}>
                {athlete.team}
              </Text>
            </Group>

            <Group>
              <Text size="sm" sx={{ opacity: 0.6 }}>
                Регион
              </Text>
              <Text>{athlete.city}</Text>
            </Group>
          </Group>

          <Group direction="column" spacing={8}>
            <Group>
              <Text size="sm" sx={{ opacity: 0.6 }}>
                FIS код
              </Text>
              <Text>{athlete.fisCode || "–"}</Text>
            </Group>

            <Group>
              <Text size="sm" sx={{ opacity: 0.6 }}>
                RUS код
              </Text>
              <Text>{athlete.rusCode || "–"}</Text>
            </Group>

            <Group>
              <Text size="sm" sx={{ opacity: 0.6 }}>
                SVO код
              </Text>
              <Text>{athleteParser.code(athlete.code)}</Text>
            </Group>
          </Group>
        </Group>
      </Group>
    </Group>
  );
};

export default Profile;
