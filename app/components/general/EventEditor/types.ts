import { EventType, File, Race } from ".prisma/client";

export const defaultEventData: EventData = {
  type: "SKIING",
  startDate: undefined,
  endDate: undefined,
  title: "",
  description: "",
  locationId: undefined,
  organizersIds: [],
  races: [],
  files: [],
  registrationOpened: false,
};

export type EventData = {
  type: EventType;
  startDate: Date | undefined;
  endDate: Date | undefined;
  title: string;
  description: string;
  locationId: number | undefined;
  organizersIds: number[];
  races: Array<Omit<Race, "id" | "eventId"> & { id?: number }>;
  files: Array<EventDataFile>;
  registrationOpened: boolean;
};

export type EventDataFile = Omit<
  File,
  "id" | "eventId" | "postId" | "authorId" | "createdAt"
> & {
  id?: number;
};
