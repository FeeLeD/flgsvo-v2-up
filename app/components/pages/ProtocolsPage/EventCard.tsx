import React, { FC } from "react";
import { ShortEventDto } from "_api/dto/event";
import { Box, Title, Text, Paper } from "@mantine/core";
import { getStringRangeFromDates } from "./utils";
import { useRouter } from "next/router";
import { paths } from "lib/paths";
import dayjs from "dayjs";

type Props = {
  shortEvent: ShortEventDto;
};

const EventCard: FC<Props> = ({ shortEvent }) => {
  const router = useRouter();
  const redirectToEventPage = () => {
    if (dayjs(shortEvent.endDate).isBefore(dayjs(), "date")) {
      router.push(paths.events.protocol_results(shortEvent.id));
    } else {
      router.push(paths.events.protocol(shortEvent.id));
    }
  };

  return (
    <Paper
      padding="md"
      shadow="xs"
      onClick={redirectToEventPage}
      sx={{
        width: "100%",
        borderRadius: "8px",
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
              startDate: shortEvent.startDate,
              endDate: shortEvent.endDate,
              format: "DD.MM.YYYY",
            })}
          </Text>
          <Text size="xs" sx={{ opacity: 0.6 }}>
            {getStringRangeFromDates({
              startDate: shortEvent.startDate,
              endDate: shortEvent.endDate,
              format: "dddd",
            })}
          </Text>
        </Box>

        <Title order={5} sx={{ marginTop: "-2px" }}>
          {shortEvent.title}
        </Title>
      </Box>
    </Paper>
  );
};

export default EventCard;
