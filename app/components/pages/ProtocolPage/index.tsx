import React, { FC, useEffect } from "react";
import { useApi } from "hooks";
import { Location } from ".prisma/client";
import { UserSession } from "lib/types";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { Box, Group } from "@mantine/core";
import LoadingPage from "components/LoadingPage";
import ProtocolLayout from "../Protocol/ProtocolLayout";
import ExportToGoogle from "./ExportToGoogle";
import Applications from "./Applications";

type Props = {
  event: {
    id: number;
    title: string;
    startDate: Date;
    endDate: Date | null;
    location: Location;
  };
};

const ProtocolPage: FC<Props> = ({ event }) => {
  const [session] = useSession();
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
    <ProtocolLayout page="Заявки" event={event}>
      <Group direction="column" sx={{ width: "100%" }}>
        {session && (session.user as UserSession).isAdmin && (
          <ExportToGoogle eventId={event.id} />
        )}

        {loading ? (
          <Box sx={{ marginTop: "24px" }}>
            <LoadingPage />
          </Box>
        ) : (
          races && (
            <Box sx={{ width: "100%", marginTop: "8px" }}>
              <Applications races={races} />
            </Box>
          )
        )}
      </Group>
    </ProtocolLayout>
  );
};

export default ProtocolPage;
