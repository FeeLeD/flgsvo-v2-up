import React, { FC, useEffect, useState } from "react";
import { Athlete, Race } from "@prisma/client";
import { storage } from "./storage";
import { Button, Group, Paper, Stepper } from "@mantine/core";
import ChooseAthlete from "./ChooseAthlete";
import ChooseRaces from "./ChooseRaces";
import Acceptance from "./Acceptance";
import { BsArrowLeft } from "react-icons/bs";
import Page from "../Page";

const EventRegisterPage: FC = () => {
  const [active, setActive] = useState(0);
  const nextStep = () => {
    const newStep = active < 3 ? active + 1 : active;
    setActive(newStep);
    storage.updateRegistrationData({ step: newStep });
  };
  const prevStep = () => {
    const newStep = active > 0 ? active - 1 : active;
    setActive(newStep);
    storage.updateRegistrationData({ step: newStep });
  };
  const [athlete, setAthlete] = useState<Athlete | undefined>();
  const [races, setRaces] = useState<
    Array<Race & { eventId: number; eventName: string }>
  >([]);

  useEffect(() => {
    const data = storage.getRegistrationData();
    if (data?.step) setActive(data.step);
    if (data?.athlete) {
      if (data?.step < 1) setActive(1);
      setAthlete(data.athlete);
    }
    if (data?.races) setRaces(data.races);
  }, []);

  const onAthleteChoose = (athlete: Athlete) => {
    setAthlete(athlete);
    setRaces([]);
    storage.updateRegistrationData({ athlete, races: [] });
    nextStep();
  };

  const onRacesChange = (
    race: Race & { eventId: number; eventName: string },
    isChosen: boolean
  ) => {
    if (isChosen) {
      const newRaces = [...races, race];
      setRaces(newRaces);
      storage.updateRegistrationData({ races: newRaces });
    } else {
      const newRaces = races.filter((r) => r.id !== race.id);
      setRaces(newRaces);
      storage.updateRegistrationData({ races: newRaces });
    }
  };

  const onReset = () => {
    storage.reset();
    setActive(0);
    setAthlete(undefined);
    setRaces([]);
  };

  return (
    <Page
      title={"Заявка на ближайшие соревнования"}
      description="Заявка на ближайшие соревнования. Сайт федерации лыжных гонок Свердловской области"
    >
      <Paper
        padding="xl"
        shadow="xs"
        sx={{
          marginTop: "24px",
          marginBottom: "24px",
          borderRadius: "16px",
          position: "relative",
        }}
      >
        {active > 0 && (
          <Group
            sx={{
              position: "absolute",
              top: "112px",
              right: "24px",
              alignSelf: "flex-end",
              "@media (max-width: 768px)": {
                position: "initial",
                marginBottom: "32px",
              },
            }}
          >
            <Button
              size="xs"
              leftIcon={<BsArrowLeft />}
              variant="outline"
              onClick={prevStep}
              sx={{
                "@media (max-width: 600px)": {
                  display: "none",
                },
              }}
            >
              Предыдущий шаг
            </Button>
            <Button
              size="xs"
              variant="outline"
              onClick={prevStep}
              sx={{
                "@media (min-width: 600px)": {
                  display: "none",
                },
              }}
            >
              Предыдущий шаг
            </Button>

            {active === 1 && (
              <Button
                size="xs"
                onClick={nextStep}
                disabled={races.length === 0}
              >
                Продолжить
              </Button>
            )}
          </Group>
        )}

        <Stepper active={active} breakpoint="sm">
          <Stepper.Step
            label="Спортсмен"
            description={
              athlete
                ? `${athlete.lastName} ${athlete.firstName} ${athlete.middleName}`
                : "Выбор спортсмена"
            }
          >
            <ChooseAthlete onChoose={onAthleteChoose} />
          </Stepper.Step>

          <Stepper.Step label="Дистанции" description="Выбор дистанций">
            <ChooseRaces
              athlete={athlete}
              races={races}
              onChange={onRacesChange}
            />
          </Stepper.Step>

          <Stepper.Step
            label="Подтверждение"
            description="Завершение регистрации"
          >
            {athlete && (
              <Acceptance races={races} athlete={athlete} onReset={onReset} />
            )}
          </Stepper.Step>
        </Stepper>
      </Paper>
    </Page>
  );
};

export default EventRegisterPage;
