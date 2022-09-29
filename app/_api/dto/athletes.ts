import { Athlete, Race, Results } from ".prisma/client";

export type AthleteDto = Athlete & {
  results: (Results & {
    race: Race & {
      event: {
        title: string;
      } | null;
    };
  })[];
};

export type CreateAthleteDto = Omit<
  Athlete,
  "id" | "code" | "active" | "confirmed"
>;

export type UpdateAthleteDto = Omit<Athlete, "active" | "payDate">;

export type SearchAthleteDto = {
  searchValue: string;
};

export type FilterDto = {
  confirmed?: boolean;
};

export type SyncAthletesDto = {
  fromNumber?: number;
};
