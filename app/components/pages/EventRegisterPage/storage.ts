import { Athlete, Race } from ".prisma/client";

type RegistrationData = {
  step: number;
  athlete: Athlete | undefined;
  races: Array<Race & { eventId: number; eventName: string }>;
};

const defaultRegistrationData: RegistrationData = {
  step: 0,
  athlete: undefined,
  races: [],
};

export const getRegistrationData = (): RegistrationData | undefined => {
  if (typeof window === "undefined") return undefined;
  const data = window.localStorage.getItem("registrationData");

  return data ? JSON.parse(data) : undefined;
};

export const updateRegistrationData = (data: Partial<RegistrationData>) => {
  let existedData = getRegistrationData();
  if (!existedData) existedData = defaultRegistrationData;

  window.localStorage.setItem(
    "registrationData",
    JSON.stringify({ ...existedData, ...data })
  );
};

export const resetStorage = () => {
  if (typeof window === "undefined") return undefined;
  window.localStorage.removeItem("registrationData");
};

export const storage = {
  getRegistrationData,
  updateRegistrationData,
  reset: resetStorage,
};
