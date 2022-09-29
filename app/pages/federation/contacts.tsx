import React from "react";
import { NextPage } from "next";
import { Paper, Text } from "@mantine/core";
import Page from "components/pages/Page";

const Contacts: NextPage = () => {
  return (
    <Page
      title="Контакты"
      subTitle="Федерация лыжных гонок Свердловской области"
      description="Контактная информация. Сайт федерации лыжных гонок Свердловской области"
    >
      <Paper padding="xl" shadow="md" sx={{ borderRadius: "16px" }}>
        <Text size="lg">
          Электронная почта Федерации лыжных гонок Свердловской области:{" "}
          <b>flgsvo@gmail.com</b>
        </Text>

        <Text sx={{ margin: "12px 0" }}>
          В теме писем указывайте «Вызов на ТМ или ВС Сыктывкар», «Положение на
          Кубок..», «Запрос инфо», «заявка на проведение соревнований», «хочу
          внести пожертвования» и т.д. и НЕ смешивайте разные документы в одном
          письме (например, вызов спортсмена и Положение на соревнования).
        </Text>

        <Text>
          На разборе почты трудится 4 человека. Определив тему письма, вы будете
          уверены, что ваше письмо будет СВОЕВРЕМЕННО рассмотрено и оперативно
          обработано.
        </Text>
      </Paper>
    </Page>
  );
};

export default Contacts;
