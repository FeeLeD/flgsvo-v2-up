import { Athlete } from ".prisma/client";
import {
  AthleteDto,
  CreateAthleteDto,
  FilterDto,
  SearchAthleteDto,
  SyncAthletesDto,
  UpdateAthleteDto,
} from "./dto/athletes";
import { request } from "./request";

export const athletes = {
  getAll: async () => {
    const athletes = await request.get<Athlete[]>(`/api/athletes`);

    return athletes;
  },
  getAthlete: async (athleteId: string | number) => {
    const athlete = await request.get<AthleteDto | null>(
      `/api/athletes/${athleteId}`
    );

    return athlete;
  },
  createAthlete: async (createDto: CreateAthleteDto) => {
    const athleteId = await request.post<number>(`/api/athletes`, createDto);

    return athleteId;
  },
  updateAthlete: async ({ id, ...updateDto }: UpdateAthleteDto) => {
    const athleteId = await request.put<number>(
      `/api/athletes/${id}`,
      updateDto
    );

    return athleteId;
  },
  filter: async (filterDto: FilterDto) => {
    const athletes = await request.post<Athlete[]>(
      `/api/athletes/filter`,
      filterDto
    );

    return athletes;
  },
  syncAthletes: async (syncDto: SyncAthletesDto) => {
    const res = await request.post(`/api/sync_athletes`, syncDto);

    return res;
  },
  searchAthlete: async (searchAthleteDto: SearchAthleteDto) => {
    const athlete = await request.post<Athlete[]>(
      `/api/athletes/search`,
      searchAthleteDto
    );

    return athlete;
  },
};
