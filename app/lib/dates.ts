import dayjs from "dayjs";

export const datesHandler = {
  translateMonthToRussian: (month: string) => {
    const monthsTranslations = {
      january: "Январь",
      february: "Февраль",
      march: "Март",
      april: "Апрель",
      may: "Май",
      june: "Июнь",
      july: "Июль",
      august: "Август",
      september: "Сентябрь",
      october: "Октябрь",
      november: "Ноябрь",
      december: "Декабрь",
      month: "Месяц",
    };

    const lowerMonth = month.toLowerCase();

    return monthsTranslations[
      lowerMonth in monthsTranslations ? (lowerMonth as "month") : "month"
    ];
  },
  formatDateToRussianLocale(date: Date) {
    const dayjsDateString = dayjs(date).format("DD MMMM YYYY");
    const [day, month, year] = dayjsDateString.split(" ");

    const months = {
      January: "января",
      February: "февраля",
      March: "марта",
      April: "апреля",
      May: "мая",
      June: "июня",
      July: "июля",
      August: "августа",
      September: "сентября",
      October: "октября",
      November: "ноября",
      December: "декабря",
    };

    return `${parseInt(day)} ${months[month as Dayjs_Month]} ${year}`;
  },
};

type Dayjs_Month =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";
