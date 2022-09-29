import { RaceCategory, RaceStyle, RaceType } from ".prisma/client";

export type RaceData = {
  id?: number;
  date: Date | undefined;
  distanceKm: number | undefined;
  type: RaceType | undefined;
  style: RaceStyle | undefined;
  category: RaceCategory[];
  description: string;
};

export const defaultRaceData: RaceData = {
  date: undefined,
  distanceKm: undefined,
  type: undefined,
  style: undefined,
  description: "",
  category: [],
};
