import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");

export const SPORT_LEVEL = {
  ZMS: "ЗМС",
  MSMK: "МСМК",
  MS: "МС",
  KMS: "КМС",
  FIRST: "I разряд",
  SECOND: "II разряд",
  THIRD: "III разряд",
  FIRST_JUNIOR: "I юн. разряд",
  SECOND_JUNIOR: "II юн. разряд",
  THIRD_JUNIOR: "III юн. разряд",
  NONE: "",
};

export const athleteParser = {
  code: (code: number) => (code >= 70000 || code >= 80000 ? code : "–"),
  birthDate: (date: Date) =>
    dayjs(date).get("year") === 1900 ? "–" : dayjs(date).format("DD.MM.YYYY"),
};
