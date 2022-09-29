import React, { useMemo } from "react";
import { GetStaticProps, NextPage } from "next";
import { paths } from "lib/paths";
import { AthleteDto } from "_api/dto/athletes";
import { PrismaClient, Race, Results } from ".prisma/client";
import AthletePage from "components/pages/AthletePage";

// type AthletePageProps = {
//   stringifiedAthlete: Omit<AthleteDto, "birthDate" | "results"> & {
//     birthDate: string;
//     results: (Results & {
//       race: Omit<Race, "date"> & { date: string };
//     })[];
//   };
// };

const Athlete: NextPage = ({}) => {
  // const athlete: AthleteDto = useMemo(
  //   () =>
  //     ({
  //       ...stringifiedAthlete,
  //       birthDate: new Date(stringifiedAthlete.birthDate),
  //       results: stringifiedAthlete.results.map((result) => ({
  //         ...result,
  //         race: { ...result.race, date: new Date(result.race.date) },
  //       })),
  //     } as AthleteDto), // something wrong...
  //   [stringifiedAthlete]
  // );

  return <AthletePage /* athlete={athlete} */ />;
};

export default Athlete;

// export const getStaticProps: GetStaticProps<AthletePageProps> = async (
//   context
// ) => {
//   const { params } = context;
//   const id = params?.id;
//   const prisma = new PrismaClient();

//   const athlete = await prisma.athlete.findUnique({
//     where: {
//       id: parseInt(id as string),
//     },
//     include: {
//       results: {
//         orderBy: {
//           race: {
//             date: "asc",
//           },
//         },
//         include: {
//           race: {
//             include: {
//               event: {
//                 select: { title: true },
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   if (!athlete) {
//     return {
//       redirect: {
//         destination: paths.events.protocols,
//         permanent: false,
//       },
//     };
//   }

//   prisma.$disconnect();

//   return {
//     props: {
//       stringifiedAthlete: {
//         ...athlete,
//         birthDate: athlete.birthDate.toDateString(),
//         results: athlete.results.map((result) => ({
//           ...result,
//           race: { ...result.race, date: result.race.date.toDateString() },
//         })),
//       },
//     },
//     revalidate: 10,
//   };
// };

// export async function getStaticPaths() {
//   const prisma = new PrismaClient();

//   const athletes = await prisma.athlete.findMany();

//   prisma.$disconnect();

//   return {
//     paths: athletes.map((athlete) => ({
//       params: { id: athlete.id.toString() },
//     })),
//     fallback: "blocking",
//   };
// }
