import dayjs from "dayjs";

export const SPORT_LEVEL = {
  ZMS: "ЗМС",
  MSMK: "МСМК",
  MS: "МС",
  KMS: "КМС",
  FIRST: "I",
  SECOND: "II",
  THIRD: "III",
  FIRST_JUNIOR: "I юн.",
  SECOND_JUNIOR: "II юн.",
  THIRD_JUNIOR: "III юн.",
  NONE: "",
};

export const athletesParser = {
  code: (code: number) => (code >= 70000 || code >= 80000 ? code : ""),
  birthDate: (date: Date) =>
    dayjs(date).get("year") === 1900 ? "" : dayjs(date).format("DD.MM.YYYY"),
};
