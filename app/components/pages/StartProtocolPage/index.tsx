import React, { FC, useEffect } from "react";
import { useApi } from "hooks";
import { useRouter } from "next/router";
import { Location } from ".prisma/client";
import { Box } from "@mantine/core";
import LoadingPage from "components/LoadingPage";
import ProtocolLayout from "../Protocol/ProtocolLayout";
import Protocols from "./Protocols";

type Props = {
  event: {
    startDate: Date;
    endDate: Date | null;
    id: number;
    title: string;
    location: Location;
  };
};

const StartProtocolPage: FC<Props> = ({ event }) => {
  const { query } = useRouter();
  const [races, loading, loadRacesByEventId] = useApi(
    (api) => api.event.getRacesByEventId
  );

  useEffect(() => {
    if (query.eventId && typeof query.eventId === "string") {
      loadRacesByEventId(query.eventId);
    }
  }, [query.eventId]);

  return (
    <ProtocolLayout page="Стартовые протоколы" event={event}>
      {loading ? (
        <Box sx={{ marginTop: "24px" }}>
          <LoadingPage />
        </Box>
      ) : (
        races && (
          <Box sx={{ width: "100%", marginTop: "8px" }}>
            <Protocols races={races} />
          </Box>
        )
      )}
    </ProtocolLayout>
  );
};

export default StartProtocolPage;
