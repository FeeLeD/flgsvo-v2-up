import { Location, Organizer, Race } from ".prisma/client";
import {
  CreateDistanceDto,
  CreateEventDto,
  CreateLocationDto,
  CreateOrgDto,
  EventDto,
  ExportProtocolDto,
  GetAvailableDto,
  ProtocolDto,
  RegisterDto,
  RegisterResultDto,
  ShortEventDto,
  EventRacesInfo,
  UpdateRaceDto,
  UpdateEventDto,
  ChangeStartProtocolDto,
  RaceByEventIdDto,
  LoadResultsDto,
} from "./dto/event";
import { request } from "./request";

export const event = {
  createEvent: async (createEventDto: CreateEventDto) => {
    const event = await request.post<{ eventId: number }>(
      `/api/event`,
      createEventDto
    );

    return event.eventId;
  },
  getEventById: async (eventId: number | string) => {
    const event = await request.get<EventDto>(`/api/event/${eventId}`);

    return event;
  },
  getEvents: async () => {
    const events = await request.get<ShortEventDto[]>(`/api/event`);

    return events;
  },
  updateEvent: async ({ eventId, ...data }: UpdateEventDto) => {
    const event = await request.put<{ eventId: number }>(
      `/api/event/${eventId}`,
      data
    );

    return event.eventId;
  },
  deleteEventById: async (eventId: number | string) => {
    const event = await request.delete<{ eventId: number }>(
      `/api/event/${eventId}`
    );

    return event.eventId;
  },
  createLocation: async (createLocationDto: CreateLocationDto) => {
    const location = await request.post<{ id: number }>(
      `/api/event/location`,
      createLocationDto
    );

    return location.id;
  },
  getLocations: async () => {
    const locations = await request.get<Location[]>(`/api/event/location`);

    return locations;
  },
  createOrg: async (createOrgDto: CreateOrgDto) => {
    const org = await request.post<{ id: number }>(
      `/api/event/org`,
      createOrgDto
    );

    return org.id;
  },
  getOrgs: async () => {
    const orgs = await request.get<Organizer[]>(`/api/event/org`);

    return orgs;
  },
  createDistance: async (createDistanceDto: CreateDistanceDto) => {
    const distance = await request.post<{ raceId: number }>(
      `/api/event/race`,
      createDistanceDto
    );

    return distance.raceId;
  },
  updateRaceById: async ({ raceId, ...updateRaceDto }: UpdateRaceDto) => {
    const race = await request.put<{ raceId: number }>(
      `/api/event/race/${raceId}`,
      updateRaceDto
    );

    return race.raceId;
  },
  getDistanceById: async (raceId: number | string) => {
    const distance = await request.get<Race>(`/api/event/race/${raceId}`);

    return distance;
  },
  deleteDistanceById: async (raceId: number | string) => {
    await request.delete(`/api/event/race/${raceId}`);
  },
  getDistances: async () => {
    const distances = await request.get<Race[]>(`/api/event/race`);

    return distances;
  },
  getAvailable: async (getAvailableDto: GetAvailableDto) => {
    const events = await request.post<ShortEventDto[]>(
      `/api/event/available/`,
      getAvailableDto
    );

    return events;
  },
  getOpened: async () => {
    const events = await request.get<ShortEventDto[]>(`/api/event/opened/`);

    return events;
  },
  register: async (registerDto: RegisterDto) => {
    const status = await request.post<RegisterResultDto>(
      `/api/event/register`,
      registerDto
    );

    return status;
  },
  getProtocols: async () => {
    const protocols = await request.get<ProtocolDto[]>(`/api/event/protocols`);

    return protocols;
  },
  getRacesByEventId: async (eventId: number | string) => {
    const races = await request.get<RaceByEventIdDto[]>(
      `/api/event/race/event/${eventId}`
    );

    return races;
  },
  getEventRacesInfo: async (eventId: number | string) => {
    const eventInfo = await request.get<EventRacesInfo>(
      `/api/event/protocols/${eventId}`
    );

    return eventInfo;
  },
  exportProtocol: async (exportProtocolDto: ExportProtocolDto) => {
    const protocols = await request.post<{}>(
      `/api/event/protocols/export`,
      exportProtocolDto
    );

    return protocols;
  },
  createStartProtocolOnRace: async ({
    raceId,
    ...changeStartProtocolDto
  }: ChangeStartProtocolDto) => {
    const race = await request.post<{ raceId: number }>(
      `/api/event/race/${raceId}/start`,
      changeStartProtocolDto
    );

    return race.raceId;
  },
  loadResults: async ({ raceId, ...loadResultsDto }: LoadResultsDto) => {
    const race = await request.post<{ status: "Loaded" }>(
      `/api/event/race/${raceId}/results`,
      loadResultsDto
    );

    return race.status;
  },
};
