import React, { FC, useMemo, useRef } from "react";
import { useApi } from "hooks";
import { athletesParser } from "./utils";
import { paths } from "lib/paths";
import { useNotifications } from "@mantine/notifications";
import {
  TextInput,
  Paper,
  Group,
  Button,
  Table,
  Anchor,
  Text,
} from "@mantine/core";
import Page from "../Page";

const AthletesPage: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { showNotification } = useNotifications();
  const [athletes, loading, search] = useApi(
    (api) => api.athletes.searchAthlete
  );

  const onSearch = () => {
    const value = inputRef.current?.value;
    if (!value || value.length < 3) {
      showNotification({
        message: "Введите минимум 3 символа",
        color: "red",
      });

      return;
    }

    search({ searchValue: value });
  };

  const generate = () => {
    fetch("/api/generate_codes");
  };

  return (
    <Page
      title="Спортсмены"
      subTitle={""}
      description="Список спортсменов сайта Федерации лыжных гонок Свердловской области"
    >
      <Paper padding="xl" shadow="xs">
        <Group sx={{ alignItems: "flex-end" }}>
          <TextInput
            ref={inputRef}
            label="Фамилия"
            placeholder="Например, Иванов"
            disabled={loading}
            sx={{
              width: "200px",
              "@media (max-width: 450px)": {
                width: "100%",
              },
            }}
          />
          <Button
            onClick={onSearch}
            loading={loading}
            sx={{
              width: "120px",
              "@media (max-width: 450px)": {
                width: "100%",
              },
            }}
          >
            Поиск
          </Button>
        </Group>

        {athletes && (
          <Table sx={{ background: "white", marginTop: "24px" }}>
            <thead>
              <tr>
                {["Код", "ФИО", "Дата рождения", "Регион", "Команда"].map(
                  (th, i) => (
                    <th key={i}>{th}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {athletes.length > 0 ? (
                athletes.map((athlete) => (
                  <tr key={athlete.id}>
                    <td>{athlete.code < 70000 ? "" : athlete.code}</td>
                    <td>
                      <Anchor
                        href={paths.athletes.athlete(athlete.id)}
                        target="_blank"
                      >
                        {`${athlete.lastName} ${athlete.firstName} ${athlete.middleName}`}
                      </Anchor>
                    </td>
                    <td>{athletesParser.birthDate(athlete.birthDate)}</td>
                    <td>{athlete.team}</td>
                    <td>{athlete.city}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <Text
                      size="sm"
                      sx={{
                        textAlign: "center",
                        marginTop: "12px",
                        opacity: 0.6,
                      }}
                    >
                      Результаты отсутсвуют
                    </Text>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Paper>
    </Page>
  );
};

export default AthletesPage;
