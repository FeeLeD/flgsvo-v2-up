import React from "react";
import { NextPage } from "next";
import { Anchor, Paper } from "@mantine/core";
import Page from "components/pages/Page";
import { BsFillFileEarmarkFill } from "react-icons/bs";

const Charter: NextPage = () => {
  return (
    <Page
      title="Документы о регистрации ФЛГСО"
      description="Документы о регистрации ФЛГСО. Сайт федерации лыжных гонок Свердловской области"
    >
      <Paper padding="xl" shadow="md" sx={{ borderRadius: "16px" }}>
        <embed
          src="https://storage.yandexcloud.net/flgso-files/%D0%B0%D0%BA%D0%BA%D1%80%D0%B5%D0%B4%D0%B8%D1%82%D0%B0%D1%86%D0%B8%D1%8F-%D0%A4%D0%9B%D0%93-%D0%A1%D0%9E.pdf"
          width="100%"
          height="550px"
          style={{ borderRadius: "8px" }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "32px auto",
            gridGap: "8px",
            marginTop: "12px",
          }}
        >
          <BsFillFileEarmarkFill size="32px" color="#228BE6" />
          <Anchor
            size="sm"
            href="https://storage.yandexcloud.net/flgso-files/%D0%B0%D0%BA%D0%BA%D1%80%D0%B5%D0%B4%D0%B8%D1%82%D0%B0%D1%86%D0%B8%D1%8F-%D0%A4%D0%9B%D0%93-%D0%A1%D0%9E.pdf"
            target="_blank"
            sx={{ alignSelf: "center" }}
          >
            Аккредитация ФЛГ СО
          </Anchor>
        </div>
      </Paper>
    </Page>
  );
};

export default Charter;
