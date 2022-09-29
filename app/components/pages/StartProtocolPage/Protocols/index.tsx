import React, { FC, useMemo } from "react";
import { VscFilePdf } from "react-icons/vsc";
import { RaceByEventIdDto } from "_api/dto/event";
import { useSession } from "next-auth/client";
import { UserSession } from "lib/types";
import { raceTitleFrom } from "./utils";
import { FileDto } from "_api/dto/cdn";
import { useApi } from "hooks";
import dayjs from "dayjs";
import { Group, Title, Text, Box, Divider, Anchor } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import ActionButtonUpload from "./ActionButtonUpload";

type Props = {
  races: RaceByEventIdDto[];
};

const Protocols: FC<Props> = ({ races = [] }) => {
  const [session] = useSession();
  const { showNotification } = useNotifications();
  const [_, loadingProtocol, createStartProtocol] = useApi(
    (api) => api.event.createStartProtocolOnRace
  );

  const onRaceUpdate = (raceId: number) => {
    return async (files: FileDto[]) => {
      try {
        await createStartProtocol({
          raceId,
          file: files[0],
        });

        showNotification({
          color: "green",
          title: "Протокол загружен",
          message: "Обновите страницу, чтобы увидеть изменения",
        });
      } catch (err) {
        showNotification({
          color: "red",
          message: "Файлы не были загружены. Попробуйте ещё раз",
        });
      }
    };
  };

  const racesByDate = useMemo(() => {
    return races.reduce((previousRaces, currentRace, i) => {
      if (
        i > 0 &&
        dayjs(currentRace.date).isSame(dayjs(races[i - 1].date), "date")
      ) {
        const newRaces = [...previousRaces];
        newRaces[newRaces.length - 1].push(currentRace);
        return newRaces;
      } else {
        return [...previousRaces, [currentRace]];
      }
    }, [] as Array<RaceByEventIdDto[]>);
  }, [races]);

  return (
    <Group direction="column" sx={{ marginTop: "24px" }} spacing={24}>
      {racesByDate.map((races, i) => (
        <Box key={`races_${i}`} sx={{ width: "100%" }}>
          <Box sx={{ width: "100%" }}>
            <Title order={4}>{dayjs(races[0].date).format("D MMMM")}</Title>
            <Divider />
          </Box>

          <Group direction="column" spacing={8} sx={{ marginTop: "16px" }}>
            {races.map((race) => (
              <Group
                key={race.id}
                sx={{ width: "100%", justifyContent: "space-between" }}
              >
                {race.startProtocol ? (
                  <Group spacing={4}>
                    <VscFilePdf size="24px" color="#1c7ed6" />
                    <Anchor
                      size="sm"
                      target="_blank"
                      href={race.startProtocol.sourceLink}
                    >
                      {raceTitleFrom(race)}
                    </Anchor>
                  </Group>
                ) : (
                  <Text size="sm">{raceTitleFrom(race)}</Text>
                )}

                {session && (session.user as UserSession).isAdmin && (
                  <ActionButtonUpload
                    multiple={false}
                    disabled={loadingProtocol}
                    onChange={onRaceUpdate(race.id)}
                  />
                )}
              </Group>
            ))}
          </Group>
        </Box>
      ))}
    </Group>
  );
};

export default Protocols;
