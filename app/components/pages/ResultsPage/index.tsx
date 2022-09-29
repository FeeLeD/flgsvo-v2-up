import React, { FC, useEffect } from "react";
import { BsFillFileEarmarkFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { File, Location } from ".prisma/client";
import { useApi } from "hooks";
import { Anchor, Box, Divider, Group } from "@mantine/core";
import ProtocolLayout from "../Protocol/ProtocolLayout";
import LoadingPage from "components/LoadingPage";
import Protocols from "./Protocols";

type Props = {
  event: {
    startDate: Date;
    endDate: Date | null;
    id: number;
    title: string;
    location: Location;
    files: File[];
  };
};

const ResultsPage: FC<Props> = ({ event }) => {
  const { query } = useRouter();
  const [_, __, loadResults] = useApi((api) => api.event.loadResults);
  const [races, loading, loadRacesByEventId] = useApi(
    (api) => api.event.getRacesByEventId
  );

  useEffect(() => {
    if (query.eventId && typeof query.eventId === "string") {
      loadRacesByEventId(query.eventId);
    }
  }, [query.eventId]);

  return (
    <ProtocolLayout page="Результаты" event={event}>
      {loading ? (
        <Box sx={{ marginTop: "24px" }}>
          <LoadingPage />
        </Box>
      ) : (
        races && (
          <Box sx={{ width: "100%", marginTop: "8px" }}>
            {event.files
              .filter((file) => file.type === "RESULT")
              .map((file) => (
                <Group
                  key={file.id}
                  spacing={8}
                  sx={{ alignItems: "center", marginTop: "16px" }}
                >
                  <Box
                    sx={{
                      height: "24px",
                      "@media (max-width: 800px)": {
                        display: "none",
                      },
                    }}
                  >
                    <BsFillFileEarmarkFill size="24px" color="#228BE6" />
                  </Box>

                  <Anchor size="sm" href={file.sourceLink} target="_blank">
                    {file.name}
                  </Anchor>
                </Group>
              ))}

            {event.files.length > 0 && (
              <Box sx={{ marginTop: "12px", marginBottom: "16px" }}>
                <Divider />
              </Box>
            )}

            <Protocols races={races} />
          </Box>
        )
      )}
    </ProtocolLayout>
  );
};

export default ResultsPage;
