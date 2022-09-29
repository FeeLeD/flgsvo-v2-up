import React, { FC, useRef } from "react";
import { useApi } from "hooks";
import { Athlete } from ".prisma/client";
import { useNotifications } from "@mantine/notifications";
import { Group, TextInput, Button, Table, Text } from "@mantine/core";
import { BsFillPeopleFill } from "react-icons/bs";
import { athletesParser } from "./utils";

type Props = {
  onChoose: (athlete: Athlete) => void;
};

const ChooseAthlete: FC<Props> = ({ onChoose }) => {
  const { showNotification } = useNotifications();
  const inputRef = useRef<HTMLInputElement>(null);
  const [athletes, searchLoading, searchAthlete] = useApi(
    (api) => api.athletes.searchAthlete
  );

  const onSearch = async () => {
    if (inputRef.current && inputRef.current.value.length < 3) {
      showNotification({
        color: "red",
        message: "Введите минимум 3 символа",
      });
      return;
    }

    try {
      await searchAthlete({
        searchValue: inputRef.current?.value ?? "",
      });
    } catch (err) {
      showNotification({
        color: "red",
        message: "Произошла ошибка. Попробуйте ещё раз",
      });
    }
  };

  const onAthleteChoose = (athlete: Athlete) => {
    return () => {
      onChoose(athlete);
    };
  };

  return (
    <>
      <Group
        sx={{
          width: "100%",
          marginTop: "24px",
          justifyContent: "center",
        }}
      >
        <TextInput
          ref={inputRef}
          placeholder="Например, 82351"
          label="Введите Ваш уникальный номер или фамилию"
          required
        />

        <Button
          loading={searchLoading}
          onClick={onSearch}
          sx={{ width: "120px", alignSelf: "flex-end" }}
        >
          Поиск
        </Button>
      </Group>

      {athletes && athletes.length > 0 ? (
        <Table sx={{ marginTop: "32px", background: "white" }}>
          <thead>
            <tr>
              <th>Код</th>
              <th>ФИО</th>
              <th>Спорт школа / коллектив / клуб</th>
              <th>Дата рождения</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((athlete) => (
              <tr key={athlete.id}>
                <td>{athletesParser.code(athlete.code)}</td>
                <td>
                  {athlete.lastName} {athlete.firstName} {athlete.middleName}
                </td>

                <td>{athlete.team}</td>

                <td>{athletesParser.birthDate(athlete.birthDate)}</td>

                <td>
                  <Group
                    direction="column"
                    spacing={0}
                    sx={{ alignItems: "flex-end", float: "right" }}
                  >
                    {athlete.confirmed ? (
                      <Button
                        variant="light"
                        onClick={onAthleteChoose(athlete)}
                        compact
                      >
                        Выбрать
                      </Button>
                    ) : (
                      <Text
                        size="xs"
                        color="red"
                        sx={{
                          width: "150px",
                          textAlign: "right",
                          opacity: 0.8,
                        }}
                      >
                        Оплата не подтверждена
                      </Text>
                    )}
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        athletes && (
          <Group
            spacing={8}
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "24px",
              opacity: 0.4,
            }}
          >
            <BsFillPeopleFill />
            <Text>Спортсмены не найдены</Text>
          </Group>
        )
      )}
    </>
  );
};

export default ChooseAthlete;
