import React, { FC } from "react";
import { SiMicrosoftexcel } from "react-icons/si";
import { Paper, Group, Anchor, Table } from "@mantine/core";
import Page from "../Page";

const AthletesRatingPage: FC = () => {
  const rows = [
    {
      title: "Девушки (средний возраст)",
      googleLink: "https://docs.google.com/spreadsheets/d/1DrbbPAs62PpIngKDwQyT7FH9McVhgRl7oyOrDiZu9RQ/edit#gid=1842129842",
      fileLink:
        "https://storage.yandexcloud.net/flgso-files/rating/%D0%A0%D0%B5%D0%B8%CC%86%D1%82%D0%B8%D0%BD%D0%B3%20%D0%B4%D0%B5%D0%B2%D1%83%D1%88%D0%BA%D0%B8%20%D1%81%D1%80%D0%B5%D0%B4%D0%BD%D0%B8%D0%B8%CC%86%202022%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B8%CC%86.xlsx",
    },
    {
      title: "Юноши (средний возраст)",
      googleLink: "https://docs.google.com/spreadsheets/d/1DrbbPAs62PpIngKDwQyT7FH9McVhgRl7oyOrDiZu9RQ/edit#gid=239064941",
      fileLink:
        "https://storage.yandexcloud.net/flgso-files/rating/%D0%A0%D0%B5%D0%B8%CC%86%D1%82%D0%B8%D0%BD%D0%B3%20%D1%8E%D0%BD%D0%BE%D1%88%D0%B8%20%D1%81%D1%80%D0%B5%D0%B4%D0%BD%D0%B8%D0%B8%CC%86%202022%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B8%CC%86.xlsx",
    },
    {
      title: "Девушки (старший возраст)",
      googleLink: "https://docs.google.com/spreadsheets/d/1DrbbPAs62PpIngKDwQyT7FH9McVhgRl7oyOrDiZu9RQ/edit#gid=1809705019",
      fileLink:
        "https://storage.yandexcloud.net/flgso-files/rating/%D0%A0%D0%B5%D0%B8%CC%86%D1%82%D0%B8%D0%BD%D0%B3%20%D0%B4%D0%B5%D0%B2%D1%83%D1%88%D0%BA%D0%B8%20%D1%81%D1%82.%202022%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B8%CC%86.xlsx",
    },
    {
      title: "Юноши (старший возраст)",
      googleLink: "https://docs.google.com/spreadsheets/d/1DrbbPAs62PpIngKDwQyT7FH9McVhgRl7oyOrDiZu9RQ/edit#gid=42477702",
      fileLink:
        "https://storage.yandexcloud.net/flgso-files/rating/%D0%A0%D0%B5%D0%B8%CC%86%D1%82%D0%B8%D0%BD%D0%B3%20%D1%8E%D0%BD%D0%BE%D1%88%D0%B8%20%D1%81%D1%82.%202022%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B8%CC%86.xlsx",
    },
    {
      title: "Юниорки",
      googleLink: "https://docs.google.com/spreadsheets/d/1DrbbPAs62PpIngKDwQyT7FH9McVhgRl7oyOrDiZu9RQ/edit#gid=1131636849",
      fileLink:
        "https://storage.yandexcloud.net/flgso-files/rating/%D0%A0%D0%B5%D0%B8%CC%86%D1%82%D0%B8%D0%BD%D0%B3%20%D1%8E%D0%BD%D0%B8%D0%BE%D1%80%D0%BA%D0%B8%202022%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B8%CC%86.xlsx",
    },
    {
      title: "Юниоры",
      googleLink: "https://docs.google.com/spreadsheets/d/1DrbbPAs62PpIngKDwQyT7FH9McVhgRl7oyOrDiZu9RQ/edit#gid=1454134465",
      fileLink:
        "https://storage.yandexcloud.net/flgso-files/rating/%D0%A0%D0%B5%D0%B8%CC%86%D1%82%D0%B8%D0%BD%D0%B3%20%D1%8E%D0%BD%D0%B8%D0%BE%D1%80%D1%8B%202022%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B8%CC%86.xlsx",
    },
    {
      title: "Женщины",
      googleLink: "https://docs.google.com/spreadsheets/d/1DrbbPAs62PpIngKDwQyT7FH9McVhgRl7oyOrDiZu9RQ/edit#gid=236614713",
      fileLink:
        "https://storage.yandexcloud.net/flgso-files/rating/%D0%A0%D0%B5%D0%B8%CC%86%D1%82%D0%B8%D0%BD%D0%B3%20%D0%B6%D0%B5%D0%BD%D1%89%D0%B8%D0%BD%D1%8B%202022%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B8%CC%86.xlsx",
    },
    {
      title: "Мужчины",
      googleLink: "https://docs.google.com/spreadsheets/d/1DrbbPAs62PpIngKDwQyT7FH9McVhgRl7oyOrDiZu9RQ/edit#gid=1977801877",
      fileLink:
        "https://storage.yandexcloud.net/flgso-files/rating/%D0%A0%D0%B5%D0%B8%CC%86%D1%82%D0%B8%D0%BD%D0%B3%20%D0%BC%D1%83%D0%B6%D1%87%D0%B8%D0%BD%D1%8B%202022%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B8%CC%86.xlsx",
    },
    {
      title: "КФК",
      googleLink: "https://docs.google.com/spreadsheets/d/1DrbbPAs62PpIngKDwQyT7FH9McVhgRl7oyOrDiZu9RQ/edit#gid=1643937949",
      fileLink:
        "https://storage.yandexcloud.net/flgso-files/rating/%D0%A0%D0%B5%D0%B8%CC%86%D1%82%D0%B8%D0%BD%D0%B3%20%D0%9A%D0%A4%D0%9A%202022%20%D0%B3.xlsx",
    },
    {
      title: "СШ",
      googleLink: "https://docs.google.com/spreadsheets/d/1DrbbPAs62PpIngKDwQyT7FH9McVhgRl7oyOrDiZu9RQ/edit#gid=1694340264",
      fileLink:
        "https://storage.yandexcloud.net/flgso-files/rating/%D0%A0%D0%B5%D0%B8%CC%86%D1%82%D0%B8%D0%BD%D0%B3%20%D0%A1%D0%A8%202022%20%D0%B3.xlsx",
    },
  ].map(({ title, googleLink, fileLink }, i) => (
    <tr key={i}>
      <td style={{ padding: "12px 24px", fontSize: "16px" }}>{title}</td>
      <td style={{ width: "100px" }}>
        <Anchor size="sm" target="_blank" href={googleLink}>
          Просмотр
        </Anchor>
      </td>
      <td style={{ width: "120px" }}>
        <Group spacing={4}>
          <SiMicrosoftexcel size="24px" color="#2F9E44" />
          <Anchor
            size="xs"
            target="_blank"
            href={fileLink}
            sx={{ color: "#2F9E44" }}
          >
            Скачать
          </Anchor>
        </Group>
      </td>
    </tr>
  ));

  return (
    <Page
      title="Рейтинг спортсменов"
      subTitle={""}
      description="Рейтинг спортсменов. Сайт Федерации лыжных гонок Свердловской области"
    >
      <Paper
        shadow="xs"
        sx={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          borderRadius: "16px",
        }}
      >
        <Table striped sx={{ background: "white" }}>
          <thead>
            <tr>
              <th style={{ padding: "24px" }}>Категория</th>
              <th></th>
              <th></th>
            </tr>
          </thead>

          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </Page>
  );
};

export default AthletesRatingPage;
