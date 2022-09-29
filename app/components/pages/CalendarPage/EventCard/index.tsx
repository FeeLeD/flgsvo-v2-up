import React, { FC } from "react";
import { useRouter } from "next/router";
import { paths } from "lib/paths";
import { ShortEventDto } from "_api/dto/event";
import { getStringRangeFromDates } from "./utils";
import { Badge, Box, Paper, Text, Title } from "@mantine/core";

type Props = {
  event: ShortEventDto;
};

const EventCard: FC<Props> = ({ event }) => {
  const router = useRouter();
  const redirectToEventPage = () => router.push(paths.events.event(event.id));

  return (
    <Paper
      padding="xl"
      shadow="xs"
      onClick={redirectToEventPage}
      sx={{
        width: "100%",
        borderRadius: "16px",
        "&:hover": { cursor: "pointer", opacity: 0.8 },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "180px auto",
          gridGap: "24px",
          "@media (max-width: 600px)": {
            gridTemplateColumns: "1fr",
          },
        }}
      >
        <Box>
          <Text size="sm">
            {getStringRangeFromDates({
              startDate: event.startDate,
              endDate: event.endDate,
              format: "DD.MM.YYYY",
            })}
          </Text>
          <Text size="xs" sx={{ opacity: 0.6 }}>
            {getStringRangeFromDates({
              startDate: event.startDate,
              endDate: event.endDate,
              format: "dddd",
            })}
          </Text>
          {event.registrationOpened && (
            <Badge
              variant="outline"
              color="green"
              size="xs"
              sx={{ marginTop: "12px" }}
            >
              Регистрация открыта
            </Badge>
          )}
        </Box>

        <Title order={5} sx={{ marginTop: "-2px" }}>
          {event.title}
        </Title>
      </Box>
    </Paper>
  );
};

export default EventCard;
