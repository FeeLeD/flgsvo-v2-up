import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");

export function getStringRangeFromDates(data: {
  startDate: Date;
  endDate: Date | null;
  format: string;
}) {
  const start = dayjs(data.startDate).format(data.format);
  if (
    data.endDate &&
    !dayjs(data.startDate).isSame(dayjs(data.endDate), "date")
  ) {
    const end = dayjs(data.endDate).format(data.format);

    return `${start} – ${end}`;
  }

  return start;
}
