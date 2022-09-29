import React, { useMemo } from "react";
import { paths } from "lib/paths";
import { File, Location, PrismaClient } from ".prisma/client";
import { GetStaticProps, NextPage } from "next";
import ResultsPage from "components/pages/ResultsPage";

type ResultsProtocolPageProps = {
  stringifiedEvent: {
    id: number;
    title: string;
    startDate: string;
    endDate: string | null;
    location: Location;
    files: (Omit<File, "createdAt"> & { createdAt: string })[];
  };
};

const ResultsProtocol: NextPage<ResultsProtocolPageProps> = ({
  stringifiedEvent,
}) => {
  const event = useMemo(
    () => ({
      ...stringifiedEvent,
      startDate: new Date(stringifiedEvent.startDate),
      endDate: stringifiedEvent.endDate
        ? new Date(stringifiedEvent.endDate)
        : null,
      files: stringifiedEvent.files.map((file) => ({
        ...file,
        createdAt: new Date(file.createdAt),
      })),
    }),
    [stringifiedEvent]
  );

  return <ResultsPage event={event} />;
};

export default ResultsProtocol;

export const getStaticProps: GetStaticProps<ResultsProtocolPageProps> = async (
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
      files: true,
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
    paths: events.map((event) => ({
      params: { eventId: event.id.toString() },
    })),
    fallback: "blocking",
  };
}
