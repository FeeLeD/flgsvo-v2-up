import { post } from "./PostController";
import { cdn } from "./CdnController";
import { event } from "./EventController";
import { athletes } from "./AthletesController";

export const api = {
  post,
  cdn,
  event,
  athletes,
};

export type Api = typeof api;
