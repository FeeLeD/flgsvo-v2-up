import React, { useMemo } from "react";
import { paths } from "lib/paths";
import { PrismaClient, Location, File } from ".prisma/client";
import { GetStaticProps, NextPage } from "next";
import StartProtocolPage from "components/pages/StartProtocolPage";

type StartProtocolPageProps = {
  stringifiedEvent: {
    id: number;
    title: string;
    startDate: string;
    endDate: string | null;
    location: Location;
  };
};

const StartProtocol: NextPage<StartProtocolPageProps> = ({
  stringifiedEvent,
}) => {
  const event = useMemo(
    () => ({
      ...stringifiedEvent,
      startDate: new Date(stringifiedEvent.startDate),
      endDate: stringifiedEvent.endDate
        ? new Date(stringifiedEvent.endDate)
        : null,
    }),
    [stringifiedEvent]
  );

  return <StartProtocolPage event={event} />;
};

export default StartProtocol;

export const getStaticProps: GetStaticProps<StartProtocolPageProps> = async (
  context
) => {
  const { params } = context;
  const eventId = params?.eventId;
  const prisma = new PrismaClient();

  const event = await prisma.event.findUnique({
    where: {
      id: parseInt(eventId as string),
    },
    select: {
      id: true,
      title: true,
      startDate: true,
      endDate: true,
      location: true,
    },
  });

  if (!event) {
    return {
      redirect: {
        destination: paths.events.protocols,
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
    paths: events.map((event) => ({
      params: { eventId: event.id.toString() },
    })),
    fallback: "blocking",
  };
}
