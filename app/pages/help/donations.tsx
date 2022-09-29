import React from "react";
import { NextPage } from "next";
import Page from "components/pages/Page";
import { Anchor, Image, Paper, Text } from "@mantine/core";
import { BsFillFileEarmarkFill } from "react-icons/bs";

const Donations: NextPage = () => {
  return (
    <Page
      title="Реквизиты для пожертвований"
      subTitle="Федерация лыжных гонок Свердловской области"
      description="Реквизиты для пожертвований. Сайт федерации лыжных гонок Свердловской области"
    >
      <Paper padding="xl" shadow="md" sx={{ borderRadius: "16px" }}>
        <embed
          src="https://storage.yandexcloud.net/flgso-files/%D1%80%D0%B5%D0%BA%D0%B2%D0%B8%D0%B7%D0%B8%D1%82%D1%8B-%D0%A4%D0%9B%D0%93%D0%A1%D0%9E-%D0%B1%D0%BB%D0%B0%D0%B3%D0%BE%D1%82%D0%B2%D0%BE%D1%80%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B8%CC%86-%D0%B2%D0%B7%D0%BD%D0%BE%D1%81-2%20(1).pdf"
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
            href="https://storage.yandexcloud.net/flgso-files/%D1%80%D0%B5%D0%BA%D0%B2%D0%B8%D0%B7%D0%B8%D1%82%D1%8B-%D0%A4%D0%9B%D0%93%D0%A1%D0%9E-%D0%B1%D0%BB%D0%B0%D0%B3%D0%BE%D1%82%D0%B2%D0%BE%D1%80%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B8%CC%86-%D0%B2%D0%B7%D0%BD%D0%BE%D1%81-2%20(1).pdf"
            target="_blank"
            sx={{ alignSelf: "center" }}
          >
            Реквизиты ФЛГСО – благотворительный взнос
          </Anchor>
        </div>
      </Paper>
    </Page>
  );
};

export default Donations;
