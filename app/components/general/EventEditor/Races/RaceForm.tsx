import React, { FC, useEffect, useReducer, useState } from "react";
import dynamic from "next/dynamic";
import { defaultRaceData, RaceData } from "./types";
import { Race, RaceCategory, RaceStyle, RaceType } from ".prisma/client";
import { NumberInput, Select, MultiSelect, Button, Group } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { BsFillPencilFill, BsPlusLg } from "react-icons/bs";

const TextEditor = dynamic(() => import("@mantine/rte"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  race?: Omit<Race, "id" | "eventId"> & { id?: number };
  onAdd: (race: RaceData) => void;
  onCancel?: () => void;
};

const RaceForm: FC<Props> = ({
  race: outerRace,
  onAdd = () => ({}),
  onCancel = () => ({}),
}) => {
  const [isOpenDesc, toggleDesc] = useReducer(
    (openDesc: boolean) => !openDesc,
    false
  );
  const [race, setRace] = useState<RaceData>(defaultRaceData);

  useEffect(() => {
    if (outerRace)
      setRace({
        id: outerRace.id,
        date: outerRace.date,
        distanceKm: outerRace.distanceKm ?? undefined,
        type: outerRace.type,
        style: outerRace.style ?? undefined,
        description: outerRace.description ?? "",
        category: outerRace.category,
      });
  }, [outerRace]);

  const updateData = (data: Partial<RaceData>) => {
    setRace({ ...race, ...data });
  };

  const onDateChange = (date: Date | null) =>
    updateData({ date: date ?? undefined });
  const onDistanceChange = (distanceKm: number | undefined) =>
    updateData({ distanceKm });
  const onTypeChange = (type: RaceType) => updateData({ type });
  const onStyleChange = (style: RaceStyle) => updateData({ style });
  const onCategoryChange = (category: RaceCategory[]) =>
    updateData({ category });
  const onDescriptionChange = (description: string) =>
    updateData({ description });

  const onRaceAdd = () => {
    onAdd(race);
    setRace({ ...defaultRaceData, date: race.date });
  };

  return (
    <div>
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "120px 160px 160px 90px auto 100px",
          gridGap: "12px",
          marginTop: "8px",
        }}
      >
        <DatePicker
          placeholder="????????*"
          locale="ru"
          inputFormat="DD.MM.YYYY"
          value={race.date}
          onChange={onDateChange}
          sx={{ width: "100%" }}
        />

        <NumberInput
          placeholder="?????????????????? (????)"
          precision={2}
          min={0}
          value={race.distanceKm}
          onChange={onDistanceChange}
          sx={{ width: "100%" }}
        />

        <Select
          placeholder="?????? ??????????*"
          data={[
            { value: "INDIVIDUAL", label: "????????????????????????????" },
            { value: "MASS", label: "????????-??????????" },
            { value: "SPRINT", label: "????????????" },
            { value: "RELAY", label: "????????????????" },
            { value: "SKIATHLON", label: "????????????????" },
            { value: "PURSUIT", label: "??????????????" },
          ]}
          value={race.type ?? ""}
          onChange={onTypeChange}
          sx={{ width: "100%" }}
        />

        <Select
          placeholder="??????????"
          data={[
            { value: "CLASSIC", label: "????" },
            { value: "FREE", label: "????" },
          ]}
          value={race.style ?? ""}
          onChange={onStyleChange}
          sx={{ width: "100%" }}
        />

        <MultiSelect
          placeholder="??????????????????*"
          data={[
            { value: "MEN", label: "??????????????" },
            { value: "WOMEN", label: "??????????????" },
            { value: "MEN_JUNIORS", label: "????????????" },
            { value: "WOMEN_JUNIORS", label: "??????????????" },
            { value: "MEN_YOUTH_ELDER", label: "?????????????? ??????????" },
            { value: "WOMEN_YOUTH_ELDER", label: "?????????????? ??????????????" },
            { value: "MEN_YOUTH_MIDDLE", label: "?????????????? ??????????" },
            { value: "WOMEN_YOUTH_MIDDLE", label: "?????????????? ??????????????" },
            { value: "MEN_YOUTH_JUNIOR", label: "?????????????? ??????????" },
            { value: "WOMEN_YOUTH_JUNIOR", label: "?????????????? ??????????????" },
            { value: "MEN_CHILDREN", label: "???????? (????????????????)" },
            { value: "WOMEN_CHILDREN", label: "???????? (??????????????)" },
          ]}
          value={race.category}
          onChange={onCategoryChange}
          sx={{ width: "100%" }}
        />

        <Button
          variant="light"
          leftIcon={isOpenDesc ? <></> : <BsPlusLg size="12px" />}
          onClick={toggleDesc}
          sx={{ alignSelf: "center", fontSize: "12px", padding: "8px" }}
        >
          {isOpenDesc ? "????????????" : "????????????????"}
        </Button>

        {isOpenDesc && (
          <TextEditor
            value={race.description}
            onChange={onDescriptionChange}
            sx={{ gridColumn: "1 / 7" }}
          />
        )}
      </div>

      {outerRace ? (
        <Group
          spacing={8}
          sx={{ justifyContent: "flex-end", marginTop: "8px" }}
        >
          <Button
            onClick={onRaceAdd}
            disabled={
              !race.date ||
              !race.type ||
              !race.category ||
              race.category.length === 0
            }
            sx={{ width: "160px" }}
            compact
          >
            <BsFillPencilFill style={{ marginRight: "8px" }} />
            ????????????????
          </Button>

          <Button variant="outline" onClick={onCancel} compact>
            ????????????
          </Button>
        </Group>
      ) : (
        <Button
          variant="outline"
          onClick={onRaceAdd}
          disabled={
            !race.date ||
            !race.type ||
            !race.category ||
            race.category.length === 0
          }
          sx={{ width: "100%", marginTop: "8px" }}
        >
          <BsPlusLg style={{ marginRight: "8px" }} />
          ???????????????? ????????????????????
        </Button>
      )}
    </div>
  );
};

export default RaceForm;
