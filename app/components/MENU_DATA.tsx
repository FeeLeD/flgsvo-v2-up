import React from "react";
import { paths } from "lib/paths";
import { GiSkis } from "react-icons/gi";
import { BsCalendarWeek, BsListOl, BsSnow, BsTrophy } from "react-icons/bs";

export const MENU = [
  {
    title: "Федерация",
    items: [
      { title: "Структура", link: "", icon: <></> },
      { title: "Деятельность", link: "", icon: <></> },
      {
        title: "Легенды лыжного спорта Свердловской области",
        link: "",
        icon: <></>,
      },
      { title: "Контакты", link: "/federation/contacts", icon: <></> },
    ],
  },
  {
    title: "Соревнования",
    items: [
      {
        title: "Заявка на ближайшие соревнования",
        link: paths.events.register,
        icon: <BsCalendarWeek />,
      },
      {
        title: "Календарь соревнований",
        link: paths.events.index,
        icon: <BsCalendarWeek />,
      },
      {
        title: "Стартовые протоколы и результаты",
        link: paths.events.protocols,
        icon: <BsListOl />,
      },
      {
        title: "Результаты всероссийских соревнований",
        link: "https://flgr-results.ru/results",
        icon: <BsListOl />,
      },
      { title: "Кубок «Надежды Урала»", link: "", icon: <BsTrophy /> },
      { title: "Лыжня России", link: "", icon: <BsSnow /> },
      { title: "Марафоны", link: "", icon: <GiSkis /> },
    ],
  },
  {
    title: "Спортсмены",
    items: [
      { title: "Список спортсменов", link: paths.athletes.index, icon: <></> },
      { title: "Сборная области", link: "", icon: <></> },
      {
        title: "Рейтинг спортсменов",
        link: paths.athletes.rating,
        icon: <></>,
      },
      {
        title: "Подготовка сборной Свердловской области по лыжным гонкам",
        link: "",
        icon: <></>,
      },
    ],
  },
  {
    title: "Документы",
    items: [
      { title: "Устав ФЛГСО", link: "/documents/charter", icon: <></> },
      {
        title: "Положение о порядке приема в члены ФЛГСО",
        link: "",
        icon: <></>,
      },
      { title: "Программа ФЛГСО", link: "", icon: <></> },
      {
        title: "Документы о регистрации ФЛГСО",
        link: "/documents/registration",
        icon: <></>,
      },
      { title: "Стандарт спортивной подготовки", link: "", icon: <></> },
      { title: "Правила соревнований по лыжным гонкам", link: "", icon: <></> },
      { title: "Разрядные нормативы", link: "", icon: <></> },
    ],
  },
  {
    title: "Антидопинг",
    items: [
      {
        title: "Всемирный антидопинговый кодекс",
        link: "https://rusada.ru/upload/iblock/80a/%D0%92%D1%81%D0%B5%D0%BC%D0%B8%D1%80%D0%BD%D1%8B%D0%B9%20%D0%B0%D0%BD%D1%82%D0%B8%D0%B4%D0%BE%D0%BF%D0%B8%D0%BD%D0%B3%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%BA%D0%BE%D0%B4%D0%B5%D0%BA%D1%81_%D0%905_2020-preview7.pdf",
        icon: <></>,
      },
      {
        title: "Общероссийские антидопинговые правила",
        link: "https://rusada.ru/upload/iblock/b7b/%D0%9F%D1%80%D0%B8%D0%BA%D0%B0%D0%B7%20%E2%84%96%20464%20%D0%BE%D1%82%2024.06.2021%20%D0%BE%D0%B1%20%D1%83%D1%82%D0%B2.%20%D0%9E%D0%B1%D1%89%D0%B5%D1%80%D0%BE%D1%81%D1%81%D0%B8%D0%B9%D1%81%D0%BA%D0%B8%D1%85%20%D0%B0%D0%BD%D1%82%D0%B8%D0%B4%D0%BE%D0%BF%D0%B8%D0%BD%D0%B3%D0%BE%D0%B2%D1%8B%D1%85%20%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB.pdf",
        icon: <></>,
      },
      {
        title: "Список запрещённых препаратов",
        link: "https://rusada.ru/substances/prohibited-list/",
        icon: <></>,
      },
      { title: "РУСАДА", link: "https://www.rusada.ru/", icon: <></> },
    ],
  },
  {
    title: "Нам помогают",
    items: [
      { title: "Благотворительность", link: "/help/charity", icon: <></> },
      { title: "Совет попечителей", link: "", icon: <></> },
      {
        title: "Реквизиты для пожертвований",
        link: "/help/donations",
        icon: <></>,
      },
      { title: "ЦСП", link: "http://cspso.ru/", icon: <></> },
      { title: "ТиМ-Спорт", link: "http://www.tim-sport.ru/", icon: <></> },
      {
        title: "Экипировочный центр имени Дементьева",
        link: "https://dema-sport.ru/",
        icon: <></>,
      },
      { title: "Ray", link: "https://www.luchski.ru/", icon: <></> },
    ],
  },
];
