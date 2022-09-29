import React, { FC } from "react";
import { Paper } from "@mantine/core";
import SyncAthletes from "./SyncAthletes";
import Events from "./Events";
import PrivateLayout from "components/PrivateLayout";

const ControlPanelPage: FC = () => {
  return (
    <PrivateLayout onlyAdmin>
      <Paper padding="xl" shadow="xs">
        <SyncAthletes />
        {/* <button
          onClick={async () => {
            console.log("start loading");
            await fetch(`/api/generate_codes`, { method: "POST" });
            console.log("finish loading");
          }}
        >
          sync
        </button> */}

        <div style={{ marginTop: "24px" }}>
          <Events />
        </div>
      </Paper>
    </PrivateLayout>
  );
};

export default ControlPanelPage;
