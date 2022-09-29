import React from "react";
import Link from "next/link";
import { NextPage } from "next";
import { Anchor, Paper, Text } from "@mantine/core";
import Page from "components/pages/Page";

const Charity: NextPage = () => {
  return (
    <Page
      title="Благотворительность"
      subTitle="Федерация лыжных гонок Свердловской области"
      description="Благотворительность. Сайт федерации лыжных гонок Свердловской области"
    >
      <Paper padding="xl" shadow="md" sx={{ borderRadius: "16px" }}>
        <Text size="lg">
          Благотворительность — это важный инструмент поддержки спорта.
        </Text>

        <Text sx={{ margin: "12px 0" }}>
          Мы приступили к формированию благотворительного фонда федерации лыжных
          гонок Свердловской области, и нам очень важно, чтобы состоявшиеся
          люди, любящие лыжные гонки, а также неравнодушные к самому здоровому и
          красивому виду спорта, внесли свой вклад. Тем самым они позволят нам
          решать не только вопросы жизнеобеспечения федерации, но и поддержать
          спортивные таланты Свердловской области.
        </Text>

        <Text> Мы будем благодарны за любой вклад!</Text>

        <div style={{ marginTop: "12px" }}>
          <Link href="/help/donations" passHref>
            <Anchor>Реквизиты для пожертвований</Anchor>
          </Link>
        </div>
      </Paper>
    </Page>
  );
};

export default Charity;
