import React, { FC, useRef } from "react";
import {
  BsFillTrophyFill,
  BsInfoSquareFill,
  BsPersonFill,
} from "react-icons/bs";
import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");
import { useApi } from "hooks";
import { Gender, SportLevel } from ".prisma/client";
import {
  Anchor,
  Box,
  Button,
  Divider,
  Group,
  Select,
  TextInput,
  Text,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useNotifications } from "@mantine/notifications";

type Props = {
  prevStep: () => void;
};

type FormData = {
  fisCode: string;
  rusCode: string;
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: null | Date;
  payDate: null | Date;
  sportLevel: null | string;
  team: string;
  city: string;
  phone: string;
  gender: null | string;
};

const RegistartionForm: FC<Props> = ({ prevStep }) => {
  const resetStorage = () => {
    window.localStorage.removeItem("athlete_registration");
  };
  const getFromStorage = (key: keyof Partial<FormData>) => {
    const storedData = window.localStorage.getItem("athlete_registration");
    if (storedData) {
      const values = JSON.parse(storedData);
      if (values[key]) return values[key];
    }

    return undefined;
  };

  const { showNotification } = useNotifications();
  const fisCode = useRef(getFromStorage("fisCode") ?? "");
  const rusCode = useRef(getFromStorage("rusCode") ?? "");
  const lastName = useRef(getFromStorage("lastName") ?? "");
  const firstName = useRef(getFromStorage("firstName") ?? "");
  const middleName = useRef(getFromStorage("middleName") ?? "");
  const birthDate = useRef<null | Date>(
    getFromStorage("birthDate") ? new Date(getFromStorage("birthDate")) : null
  );
  const payDate = useRef<null | Date>(
    getFromStorage("payDate") ? new Date(getFromStorage("payDate")) : null
  );
  const sportLevel = useRef<null | string>(
    getFromStorage("sportLevel") ?? null
  );
  const gender = useRef<null | string>(getFromStorage("gender") ?? null);
  const team = useRef(getFromStorage("team") ?? "");
  const city = useRef(getFromStorage("city") ?? "");
  const phone = useRef(getFromStorage("phone") ?? "");

  const updateLocalStorage = (data: Partial<FormData>) => {
    const storedData = window.localStorage.getItem("athlete_registration");
    let newData: Partial<FormData> = data;
    if (storedData) {
      newData = { ...JSON.parse(storedData), ...data };
    }
    window.localStorage.setItem(
      "athlete_registration",
      JSON.stringify(newData)
    );
  };

  const dateParser = (dateString: string) => {
    const parts = dateString.split(".");
    if (parts.length > 2) {
      return new Date(Date.parse(`${parts[1]}.${parts[0]}.${parts[2]}`));
    }
    return new Date(Date.parse(dateString));
  };

  const isValid = () => {
    if (
      !lastName.current ||
      !firstName.current ||
      !middleName.current ||
      !birthDate.current ||
      !team.current ||
      !city.current ||
      !sportLevel.current ||
      !gender.current ||
      !phone.current ||
      !payDate.current
    ) {
      showNotification({
        color: "red",
        title: "Заполните обязательные поля",
        message: `${!lastName.current ? "Фамилия, " : ""}
        ${!firstName.current ? "Имя, " : ""}
        ${!middleName.current ? "Отчество, " : ""}
        ${!birthDate.current ? "Дата рождения, " : ""}
        ${!payDate.current ? "Дата оплаты взноса, " : ""}
        ${!sportLevel.current ? "Спортивный разряд, " : ""}
        ${!team.current ? "Спорт школа, " : ""}
        ${!city.current ? "Город, " : ""}
        ${!phone.current ? "Телефон, " : ""}
        ${!gender.current ? "Пол" : ""}`,
      });

      return false;
    }

    return true;
  };

  const [_, loading, createAthlete] = useApi(
    (api) => api.athletes.createAthlete
  );

  const onSubmit = async () => {
    if (!isValid()) return;

    try {
      await createAthlete({
        fisCode: fisCode.current,
        rusCode: rusCode.current,
        lastName: lastName.current,
        firstName: firstName.current,
        middleName: middleName.current,
        birthDate: birthDate.current as Date,
        birthYear: (birthDate.current as Date).getFullYear(),
        payDate: payDate.current,
        sportLevel: sportLevel.current as SportLevel,
        team: team.current,
        city: city.current,
        phone: phone.current,
        gender: gender.current as Gender,
      });

      showNotification({
        color: "green",
        title: "Спортсмен зарегистрирован в базе",
        message: `${lastName.current} ${firstName.current} ${middleName.current}`,
        autoClose: false,
      });

      resetStorage();
      prevStep();
    } catch (err) {
      console.log(err);
      showNotification({
        color: "red",
        message: "Произошла ошибка. Попробуйте ещё раз",
      });
    }
  };

  return (
    <Box sx={{ marginTop: "24px" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "280px 280px 280px",
          gridGap: "48px",
          "@media (max-width: 1080px)": {
            gridTemplateColumns: "1fr",
          },
        }}
      >
        <Box>
          <Group spacing={8}>
            <BsPersonFill size="20px" color="#339AF0" />
            <Title order={5}>Основное</Title>
          </Group>
          <Divider />

          <Group direction="column" sx={{ marginTop: "20px" }}>
            <TextInput
              label="Фамилия"
              required
              defaultValue={getFromStorage("lastName")}
              onChange={(e) => {
                lastName.current = e.currentTarget.value;
                updateLocalStorage({ lastName: e.currentTarget.value });
              }}
              sx={{ width: "100%" }}
            />
            <TextInput
              label="Имя"
              required
              defaultValue={getFromStorage("firstName")}
              onChange={(e) => {
                firstName.current = e.currentTarget.value;
                updateLocalStorage({ firstName: e.currentTarget.value });
              }}
              sx={{ width: "100%" }}
            />
            <TextInput
              label="Отчество"
              required
              defaultValue={getFromStorage("middleName")}
              onChange={(e) => {
                middleName.current = e.currentTarget.value;
                updateLocalStorage({ middleName: e.currentTarget.value });
              }}
              sx={{ width: "100%" }}
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridGap: "24px",
              }}
            >
              <Select
                label="Пол"
                required
                defaultValue={getFromStorage("gender") as Gender}
                data={[
                  { value: "MAN", label: "Мужской" },
                  { value: "WOMAN", label: "Женский" },
                ]}
                onChange={(value) => {
                  gender.current = value;
                  updateLocalStorage({ gender: value });
                }}
              />

              <DatePicker
                label="Дата рождения"
                locale="ru"
                inputFormat="DD.MM.YYYY"
                dateParser={dateParser}
                allowFreeInput
                required
                defaultValue={
                  getFromStorage("birthDate")
                    ? new Date(getFromStorage("birthDate"))
                    : null
                }
                onChange={(date) => {
                  birthDate.current = date;
                  updateLocalStorage({ birthDate: date });
                }}
              />
            </Box>
          </Group>
        </Box>

        <Box>
          <Group spacing={8}>
            <BsFillTrophyFill size="16px" color="#339AF0" />
            <Title order={5}>Спортивные данные</Title>
          </Group>
          <Divider />

          <Group direction="column" sx={{ marginTop: "20px" }}>
            <Select
              label="Спортивный разряд"
              required
              data={[
                { value: "ZMS", label: "ЗМС" },
                { value: "MSMK", label: "МСМК" },
                { value: "MS", label: "МС" },
                { value: "KMS", label: "КМС" },
                { value: "FIRST", label: "I разряд" },
                { value: "SECOND", label: "II разряд" },
                { value: "THIRD", label: "III разряд" },
                { value: "FIRST_JUNIOR", label: "I юн. разряд" },
                { value: "SECOND_JUNIOR", label: "II юн. разряд" },
                { value: "THIRD_JUNIOR", label: "III юн. разряд" },
                { value: "NONE", label: "Без разряда" },
              ]}
              defaultValue={getFromStorage("sportLevel") as SportLevel}
              onChange={(value) => {
                sportLevel.current = value;
                updateLocalStorage({ sportLevel: value });
              }}
              sx={{ width: "100%" }}
            />
            <TextInput
              label="FIS код (при наличии)"
              defaultValue={getFromStorage("fisCode")}
              onChange={(e) => {
                fisCode.current = e.currentTarget.value;
                updateLocalStorage({ fisCode: e.currentTarget.value });
              }}
              sx={{ width: "100%" }}
            />
            <TextInput
              label="RUS код (при наличии)"
              defaultValue={getFromStorage("rusCode")}
              onChange={(e) => {
                rusCode.current = e.currentTarget.value;
                updateLocalStorage({ rusCode: e.currentTarget.value });
              }}
              sx={{ width: "100%" }}
            />
          </Group>
        </Box>

        <Box>
          <Group spacing={8}>
            <BsInfoSquareFill size="16px" color="#339AF0" />
            <Title order={5}>Дополнительная информация</Title>
          </Group>
          <Divider />

          <Group direction="column" sx={{ marginTop: "20px" }}>
            <TextInput
              label="Муниципальный округ / город"
              required
              defaultValue={getFromStorage("city")}
              onChange={(e) => {
                city.current = e.currentTarget.value;
                updateLocalStorage({ city: e.currentTarget.value });
              }}
              sx={{ width: "100%" }}
            />
            <TextInput
              label="Спорт школа / коллектив / клуб"
              required
              defaultValue={getFromStorage("team")}
              onChange={(e) => {
                team.current = e.currentTarget.value;
                updateLocalStorage({ team: e.currentTarget.value });
              }}
              sx={{ width: "100%" }}
            />
            <TextInput
              label="Номер телефона спортсмена"
              placeholder="88000000000"
              required
              defaultValue={getFromStorage("phone")}
              onChange={(e) => {
                phone.current = e.currentTarget.value;
                updateLocalStorage({ phone: e.currentTarget.value });
              }}
              sx={{ width: "100%" }}
            />
          </Group>
        </Box>
      </Box>

      <Box sx={{ marginTop: "24px" }}>
        <Divider />
      </Box>

      <Group direction="column" spacing={4} sx={{ marginTop: "16px" }}>
        <Text size="sm" weight="500" sx={{ color: "#212529" }}>
          Дата оплаты взноса <span style={{ color: "red" }}>*</span>
        </Text>

        <DatePicker
          locale="ru"
          inputFormat="DD.MM.YYYY"
          dateParser={dateParser}
          allowFreeInput
          sx={{ maxWidth: "128px" }}
          defaultValue={
            getFromStorage("payDate")
              ? new Date(getFromStorage("payDate"))
              : null
          }
          onChange={(date) => {
            payDate.current = date;
            updateLocalStorage({ payDate: date });
          }}
        />

        <Text size="xs" sx={{ opacity: 0.6 }}>
          Спортсмен будет подтвержден после проверки оплаты
        </Text>
      </Group>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "36px",
        }}
      >
        <Group
          spacing={24}
          sx={{
            "@media (max-width: 600px)": {
              width: "100%",
              flexDirection: "column-reverse",
            },
          }}
        >
          <Anchor size="sm" onClick={prevStep}>
            Вернуться к реквизитам
          </Anchor>

          <Button
            size="lg"
            loading={loading}
            onClick={onSubmit}
            sx={{
              width: "240px",
              "@media (max-width: 600px)": {
                width: "100%",
              },
            }}
          >
            Регистрация
          </Button>
        </Group>
      </Box>
    </Box>
  );
};

export default RegistartionForm;
