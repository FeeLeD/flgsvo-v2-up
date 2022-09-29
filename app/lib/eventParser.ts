import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");
import { RaceStyle, RaceType, RaceCategory } from ".prisma/client";

const TYPES = {
  INDIVIDUAL: "ИНД",
  MASS: "МСТ",
  RELAY: "ЭСТ",
  SKIATHLON: "СКИАТЛОН",
  SPRINT: "СПРИНТ",
  PURSUIT: "ПЕРСЬЮТ",
};

const discipline = (data: { distanceKm: number | null; type: RaceType }) => {
  const raceType = shortType(data.type) !== "ИНД" ? TYPES[data.type] : "";

  return `${
    distance(data.distanceKm) ? distance(data.distanceKm) + " " : ""
  }${raceType}`;
};

const distance = (distanceKm: number | null) => {
  return distanceKm ? `${distanceKm} км` : "";
};

const shortType = (type: RaceType) => {
  return TYPES[type];
};

const dateString = (dateRange: {
  startDate: Date;
  endDate: Date | null | undefined;
}) => {
  if (
    !dateRange.endDate ||
    dayjs(dateRange.startDate).isSame(dayjs(dateRange.endDate), "date")
  ) {
    return dayjs(dateRange.startDate).format("D MMMM YYYY (dddd)");
  }

  const startDate = dayjs(dateRange.startDate).isSame(
    dayjs(dateRange.endDate),
    "month"
  )
    ? dayjs(dateRange.startDate).format("D")
    : dayjs(dateRange.startDate).format("D MMMM");
  const endDate = dayjs(dateRange.endDate).format("D MMMM");
  const year = dayjs(dateRange.startDate).get("year");
  const startDay = dayjs(dateRange.startDate).format("dddd");
  const endDay = dayjs(dateRange.endDate).format("dddd");

  return `${startDate} – ${endDate} (${startDay} – ${endDay}) ${year} г.`;
};

const raceStyle = (style: RaceStyle | null | undefined) => {
  return style === "CLASSIC" ? "КЛ" : style === "FREE" ? "СВ" : "";
};

const CATEGORIES = {
  MEN: "Мужчины",
  MEN_JUNIORS: "Юниоры",
  MEN_YOUTH_ELDER: "Старшие юноши",
  MEN_YOUTH_MIDDLE: "Средние юноши",
  MEN_YOUTH_JUNIOR: "Младшие юноши",
  MEN_CHILDREN: "Дети (мальчики)",
  WOMEN: "Женщины",
  WOMEN_JUNIORS: "Юниорки",
  WOMEN_YOUTH_ELDER: "Старшие девушки",
  WOMEN_YOUTH_MIDDLE: "Средние девушки",
  WOMEN_YOUTH_JUNIOR: "Младшие девушки",
  WOMEN_CHILDREN: "Дети (девочки)",
};
const category = (category: RaceCategory[]) => {
  return category.map((category) => CATEGORIES[category]).join(", ");
};

export const eventParser = {
  discipline,
  distance,
  shortType,
  dateString,
  raceStyle,
  category,
};
