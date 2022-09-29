import React, { useMemo } from "react";
import { GetStaticProps, NextPage } from "next";
import { File, PrismaClient, Race } from ".prisma/client";
import { paths } from "lib/paths";
import { EventDto } from "_api/dto/event";
import EventPage from "components/pages/EventPage";

type EventPageProps = {
  stringifiedEvent: Omit<
    EventDto,
    "startDate" | "endDate" | "races" | "files"
  > & {
    startDate: string;
    endDate: string | null;
    races: Array<Omit<Race, "date"> & { date: string }>;
    files: Array<Omit<File, "createdAt"> & { createdAt: string }>;
  };
};

const Event: NextPage<EventPageProps> = ({ stringifiedEvent }) => {
  const event: EventDto = useMemo(
    () => ({
      ...stringifiedEvent,
      startDate: new Date(stringifiedEvent.startDate),
      endDate: stringifiedEvent.endDate
        ? new Date(stringifiedEvent.endDate)
        : null,
      races: stringifiedEvent.races.map((race) => ({
        ...race,
        date: new Date(race.date),
      })),
      files: stringifiedEvent.files.map((file) => ({
        ...file,
        createdAt: new Date(file.createdAt),
      })),
    }),
    [stringifiedEvent]
  );

  return <EventPage event={event} />;
};

export default Event;

export const getStaticProps: GetStaticProps<EventPageProps> = async (
  context
) => {
  const { params } = context;
  const eventId = params?.id;
  const prisma = new PrismaClient();

  const event = await prisma.event.findUnique({
    where: {
      id: parseInt(eventId as string),
    },
    include: {
      location: true,
      organizers: true,
      races: { orderBy: { date: "asc" } },
      files: true,
    },
  });

  if (!event) {
    return {
      redirect: {
        destination: paths.events.index,
        permanent: false,
      },
    };
  }

  prisma.$disconnect();

  return {
    props: {
      stringifiedEvent: {
        ...event,
        startDate: event.startDate.toDateString(),
        endDate: event.endDate ? event.endDate.toDateString() : null,
        races: event.races.map((race) => ({
          ...race,
          date: race.date.toDateString(),
        })),
        files: event.files.map((file) => ({
          ...file,
          createdAt: file.createdAt.toDateString(),
        })),
      },
    },
    revalidate: 10,
  };
};

export async function getStaticPaths() {
  const prisma = new PrismaClient();

  const events = await prisma.event.findMany();

  prisma.$disconnect();

  return {
    paths: events.map((event) => ({ params: { id: event.id.toString() } })),
    fallback: "blocking",
  };
}
