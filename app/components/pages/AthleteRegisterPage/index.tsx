import React, { FC, useState } from "react";
import { Box, Button, Paper, Stepper } from "@mantine/core";
import RegistartionForm from "./RegistrationForm";
import FirstStep from "./FirstStep";
import Page from "../Page";

const AthletesRegisterPage: FC = () => {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Page
      title="Регистрация лыжника-гонщика Свердловской области"
      subTitle="Обязательная регистрация для участия в областных соревнованиях"
      description="Регистрация лыжника-гонщика Свердловской области в базе данных. Сайт федерации лыжных гонок Свердловской области"
    >
      <Paper shadow="sm" padding="xl" sx={{ borderRadius: "16px" }}>
        <Stepper
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
          sx={{
            padding: "0 24px",
            "@media (max-width: 800px)": {
              padding: "0",
            },
          }}
        >
          <Stepper.Step label="Оплата" description="Регистрационный взнос">
            <Box sx={{ marginTop: "12px" }}>
              <FirstStep />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "24px",
                }}
              >
                <Button
                  size="lg"
                  onClick={nextStep}
                  sx={{
                    width: "200px",
                    "@media (max-width: 600px)": {
                      width: "100%",
                    },
                  }}
                >
                  Далее
                </Button>
              </Box>
            </Box>
          </Stepper.Step>

          <Stepper.Step label="Регистрация" description="Данные спортсмена">
            <RegistartionForm prevStep={prevStep} />
          </Stepper.Step>
        </Stepper>
      </Paper>
    </Page>
  );
};

export default AthletesRegisterPage;
