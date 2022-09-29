import React, { FC, useEffect, useState } from "react";
import { Button, Modal, Paper, Title } from "@mantine/core";
import Profile from "./Profile";
import Races from "./Races";
import Page from "../Page";
import { useApi } from "hooks";
import { useRouter } from "next/router";
import LoadingPage from "components/LoadingPage";
import EditAthleteForm from "./EditAthleteForm";

const AthletePage: FC = () => {
  const { query } = useRouter();
  const [opened, setOpened] = useState(false);
  const openModal = () => setOpened(true);
  const closeModal = () => setOpened(false);
  const [athlete, loading, getAthlete] = useApi(
    (api) => api.athletes.getAthlete
  );

  useEffect(() => {
    if (query.id && typeof query.id === "string") {
      getAthlete(query.id);
    }
  }, [query.id]);

  if (loading) {
    return <LoadingPage />;
  }

  if (athlete) {
    return (
      <Page
        title={`${athlete.lastName} ${athlete.firstName}`}
        subTitle="Спортсмен"
        description={`Спортсмен Свердловской области: ${athlete.lastName} ${athlete.firstName}. Сайт федерации лыжных гонок Свердловской области`}
        adminPanel={
          <>
            <Button variant="outline" compact onClick={openModal}>
              Редактировать
            </Button>

            <Modal
              opened={opened}
              onClose={closeModal}
              title="Редактирование данных"
            >
              <EditAthleteForm athlete={athlete} />
            </Modal>
          </>
        }
      >
        <Paper
          shadow="xs"
          padding="xl"
          sx={{ position: "relative", borderRadius: "16px" }}
        >
          <Profile athlete={athlete} />
        </Paper>

        <Title order={3} sx={{ marginTop: "32px" }}>
          Результаты
        </Title>

        <Paper
          shadow="xs"
          padding="xl"
          sx={{ position: "relative", marginTop: "12px", borderRadius: "16px" }}
        >
          <Races results={athlete.results} />
        </Paper>
      </Page>
    );
  }

  return null;
};

export default AthletePage;
