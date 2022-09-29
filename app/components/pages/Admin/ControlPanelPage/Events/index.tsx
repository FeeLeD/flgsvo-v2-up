import React, { FC, useEffect } from "react";
import { useApi } from "hooks";
import { paths } from "lib/paths";
import { Divider, Title, Table, Text, Button } from "@mantine/core";
import { getStringRangeFromDates } from "components/general/utils";
import LoadingPage from "components/LoadingPage";

const Events: FC = () => {
  const [events, loading, loadOpenedEvents] = useApi(
    (api) => api.event.getOpened
  );

  useEffect(() => {
    loadOpenedEvents("");
  }, []);

  return (
    <div>
      <Title order={4}>Ближайшие старты</Title>
      <Divider />

      {loading && (
        <div style={{ marginTop: "24px" }}>
          <LoadingPage />
        </div>
      )}

      {events && events.length > 0 && (
        <Table sx={{ marginTop: "8px" }}>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td style={{ width: "160px" }}>
                  <Text size="sm">
                    {getStringRangeFromDates({
                      startDate: event.startDate,
                      endDate: event.endDate,
                      format: "DD.MM.YY",
                    })}
                  </Text>
                </td>
                <td>{event.title}</td>
                <td style={{ width: "80px" }}>
                  <Button
                    variant="outline"
                    compact
                    component="a"
                    href={paths.events.protocol(event.id)}
                    target="_blank"
                  >
                    Перейти
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Events;
