import React, { FC, useEffect, useMemo, useState } from "react";
import { useApi } from "hooks";
import { paths } from "lib/paths";
import { athletesParser } from "./utils";
import {
  Anchor,
  Group,
  Paper,
  Select,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import PrivateLayout from "components/PrivateLayout";
import LoadingPage from "components/LoadingPage";
import { BsPencil } from "react-icons/bs";
import { useDebouncedValue } from "@mantine/hooks";
import { Athlete } from "@prisma/client";

type FilterOptions = "all" | "not_paid";
const SELECT_DATA: Array<{
  label: string;
  value: FilterOptions;
}> = [
  { label: "Все", value: "all" },
  { label: "Без оплаты", value: "not_paid" },
];

const AthletesPage: FC = () => {
  const [value, setValue] = useState("");
  const [debounced] = useDebouncedValue(value, 200);
  const [selected, setSelected] = useState<FilterOptions>("all");
  const [athletes, loading, loadAthletes] = useApi(
    (api) => api.athletes.filter
  );

  const onSelectChange = (value: FilterOptions) => {
    setSelected(value);
  };

  const ths = useMemo(
    () => ["№", "ФИО", "Дата рождения", "Регион", "Команда", ""],
    []
  );

  useEffect(() => {
    loadAthletes({});
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setValue(value);
  };

  const filteredAthletes = useMemo(() => {
    let filtered: Athlete[] | undefined = [];
    if (selected === "all" && athletes) {
      filtered = [...athletes];
    } else if (selected === "not_paid" && athletes) {
      filtered = athletes?.filter((a) => !a.confirmed);
    }

    if (debounced) {
      filtered = filtered.filter((a) =>
        a.lastName.toLowerCase().includes(debounced.toLowerCase())
      );
    }

    return filtered;
  }, [athletes, selected, debounced]);

  return (
    <PrivateLayout onlyAdmin>
      <Title order={2} sx={{ marginBottom: "12px" }}>
        Список спортсменов
        {filteredAthletes.length > 0 ? ` (${filteredAthletes.length})` : ``}
      </Title>

      <Paper
        padding="xl"
        shadow="xs"
        sx={{ width: "100%", marginTop: "4px", marginBottom: "100px" }}
      >
        <button
          onClick={() => fetch("/api/generate_codes", { method: "POST" })}
        >
          generate
        </button>
        <Group sx={{ alignItems: "flex-end", marginBottom: "24px" }}>
          <Select
            label="Фильтр"
            data={SELECT_DATA}
            defaultValue={"all" as FilterOptions}
            onChange={onSelectChange}
            sx={{ width: "200px" }}
          />
          <TextInput
            label="Поиск по фамилии"
            placeholder="Иванов"
            disabled={loading}
            onChange={onInputChange}
            sx={{ width: "200px" }}
          />
        </Group>

        {loading ? (
          <LoadingPage />
        ) : (
          <Table striped sx={{ background: "white" }}>
            <thead>
              <tr>
                {ths.map((th, i) => (
                  <th key={i}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAthletes.map((athlete, i) => (
                <tr key={`row_${i}`}>
                  <td>{i + 1}</td>
                  <td>
                    {`${athlete.lastName} ${athlete.firstName} ${athlete.middleName}`}
                  </td>
                  <td>{athletesParser.birthDate(athlete.birthDate)}</td>
                  <td>{athlete.team}</td>
                  <td>{athlete.city}</td>
                  <td>
                    <Anchor
                      href={paths.athletes.athlete(athlete.id)}
                      target="_blank"
                    >
                      <BsPencil />
                    </Anchor>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Paper>
    </PrivateLayout>
  );
};

export default AthletesPage;
