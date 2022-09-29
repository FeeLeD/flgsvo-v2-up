import {
  Applications,
  Athlete,
  Event,
  EventType,
  File,
  Gender,
  Location,
  Organizer,
  Race,
  RaceStyle,
} from ".prisma/client";
import { RaceCategory, RacesAthletes, RaceType, Results } from "@prisma/client";
import { EventDataFile } from "components/general/EventEditor/types";
import { FileDto } from "./cdn";

export type CreateEventDto = {
  type: EventType;
  startDate: Date;
  endDate: Date | undefined;
  title: string;
  description: string;
  locationId: number;
  organizersIds: number[];
  races: Array<Omit<Race, "id" | "eventId"> & { id?: number }>;
  files: Array<EventDataFile>;
  registrationOpened: boolean;
};

export type UpdateEventDto = Omit<CreateEventDto, "files" | "races"> & {
  eventId: string | number;
};

export type EventDto = Event & {
  location: Location;
  organizers: Organizer[];
  races: Race[];
  files: File[];
};

export type ShortEventDto = Event & {
  races: Race[];
};

export type CreateLocationDto = {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  web: string;
};

export type CreateOrgDto = {
  name: string;
  description: string;
  phone: string;
  email: string;
  web: string;
  location: string;
};

export type CreateDistanceDto = {
  description: string | undefined;
  date: Date;
  category: string;
  gender: Gender;
  distanceKm: number | undefined;
  style: RaceStyle | undefined;
  isRelay: boolean | undefined;
};

export type UpdateRaceDto = Omit<Race, "id" | "eventId"> & { raceId: number };

export type RegisterDto = {
  racesIds: number[];
  athleteId: number;
  payload?: {
    bindingTypes?: { [id: string]: "NNN" | "SNS" | undefined };
  };
};

export type RegisterResultDto = {
  registered: number[];
  failed: number[];
};

export type GetAvailableDto = {
  gender: Gender;
};

export type ProtocolDto = Race & {
  athletes: Athlete[];
};

export type EventRace = {
  id: number;
  description: string | null;
  date: Date;
  category: RaceCategory[];
  type: RaceType;
  style: RaceStyle | null;
  distanceKm: number | null;
  startProtocol: File | null;
  athletes: (RacesAthletes & {
    athlete: Athlete;
  })[];
};

export type EventRacesInfo = {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date | null;
  location: Location;
  races: EventRace[];
};

export type ExportProtocolDto = {
  sheetId: string;
  eventId: number;
};

export type ChangeStartProtocolDto = {
  raceId: number;
  file: FileDto;
};

export type RaceByEventIdDto = {
  id: number;
  description: string | null;
  date: Date;
  category: RaceCategory[];
  type: RaceType;
  style: RaceStyle | null;
  distanceKm: number | null;
  startProtocol: File | null;
  applications: (Applications & {
    athlete: Athlete;
  })[];
  athletes: (RacesAthletes & {
    athlete: Athlete;
  })[];
  results: (Results & {
    athlete: Athlete;
  })[];
};

export type LoadResultsDto = {
  raceId: number;
  sheetId: string;
};
