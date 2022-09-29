import React, { FC } from "react";
import "dayjs/locale/ru";
import { Group, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { BsCalendar3 } from "react-icons/bs";

type Props = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onChange?: (range: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => void;
};

const DateRange: FC<Props> = ({
  startDate,
  endDate,
  onChange = () => ({}),
}) => {
  const changeDate = (type: "start" | "end") => {
    return (date: Date) => {
      if (type === "start") {
        onChange({ startDate: date, endDate });
      } else if (type === "end") {
        onChange({ endDate: date, startDate });
      }
    };
  };

  return (
    <Group sx={{ alignItems: "flex-end" }}>
      <DatePicker
        locale="ru"
        placeholder="Выберите дату"
        icon={<BsCalendar3 />}
        label="Дата начала"
        inputFormat="D MMMM YYYY"
        required
        clearable={false}
        value={startDate}
        onChange={changeDate("start")}
      />

      <DatePicker
        locale="ru"
        placeholder="Выберите дату"
        icon={<BsCalendar3 />}
        label="Дата окончания"
        inputFormat="DD MMMM YYYY"
        value={endDate}
        minDate={startDate}
        clearable={false}
        onChange={changeDate("end")}
      />

      {startDate && endDate && startDate > endDate && (
        <Text size="sm" color="red" sx={{ lineHeight: "36px" }}>
          Диапазон дат некорректный
        </Text>
      )}
    </Group>
  );
};

export default DateRange;
