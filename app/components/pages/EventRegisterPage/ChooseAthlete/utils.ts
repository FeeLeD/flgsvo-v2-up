import dayjs from "dayjs";

export const athletesParser = {
  code: (code: number) => (code >= 70000 || code >= 80000 ? code : ""),
  birthDate: (date: Date) =>
    dayjs(date).get("year") === 1900 ? "" : dayjs(date).format("DD.MM.YYYY"),
};
