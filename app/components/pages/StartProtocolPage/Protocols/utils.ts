import { eventParser } from "lib/eventParser";
import { RaceByEventIdDto } from "_api/dto/event";

export const raceTitleFrom = (race: RaceByEventIdDto) => {
  return `${eventParser.category(race.category)} ${eventParser.discipline({
    distanceKm: race.distanceKm,
    type: race.type,
  })} (${eventParser.raceStyle(race.style)})`;
};
