import React, { FC, useState } from "react";
import { useApi } from "hooks";
import { useRouter } from "next/router";
import { AthleteDto } from "_api/dto/athletes";
import { Gender, SportLevel, Athlete } from ".prisma/client";
import { Box, Button, Checkbox, Group, Select, TextInput } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/hooks";

type Props = {
  athlete: AthleteDto;
};

const EditAthleteForm: FC<Props> = ({ athlete }) => {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const [birthDate, setBirthDate] = useState(new Date(athlete.birthDate));
  const [sportLevel, setSportLevel] = useState(athlete.sportLevel);
  const [gender, setGender] = useState(athlete.gender);
  const [errors, setErrors] = useState({
    birthDate: !athlete.birthDate,
    sportLevel: !athlete.sportLevel,
    gender: !athlete.gender,
  });
  const [_, loading, updateAthlete] = useApi(
    (api) => api.athletes.updateAthlete
  );

  const form = useForm({
    initialValues: {
      code: athlete.code,
      fisCode: athlete.fisCode,
      rusCode: athlete.rusCode,
      lastName: athlete.lastName,
      firstName: athlete.firstName,
      middleName: athlete.middleName,
      team: athlete.team,
      city: athlete.city,
      phone: athlete.phone,
      confirmed: athlete.confirmed,
    },
    validationRules: {
      lastName: (value) => Boolean(value),
      firstName: (value) => Boolean(value),
      middleName: (value) => Boolean(value),
      team: (value) => Boolean(value),
      city: (value) => Boolean(value),
      phone: (value) => Boolean(value),
    },
    errorMessages: {
      lastName: "Обязательное поле",
      firstName: "Обязательное поле",
      middleName: "Обязательное поле",
      team: "Обязательное поле",
      city: "Обязательное поле",
      phone: "Обязательное поле",
    },
  });

  const fillEmptyFieldsNotification = () =>
    showNotification({ message: "Заполните обязательные поля" });

  const onSubmit = async (values: typeof form.values) => {
    if (!birthDate) {
      setErrors({ ...errors, birthDate: true });
      fillEmptyFieldsNotification();
      return;
    }
    if (!sportLevel) {
      setErrors({ ...errors, sportLevel: true });
      fillEmptyFieldsNotification();
      return;
    }
    if (!gender) {
      setErrors({ ...errors, gender: true });
      fillEmptyFieldsNotification();
      return;
    }
    if (values.confirmed && !values.code) {
      showNotification({
        title: "Заполните SVO код",
        message:
          "При подтвержденной оплате спортсмену необходимо присвоить код",
      });
      return;
    }

    try {
      await updateAthlete({
        id: athlete.id,
        ...values,
        code: parseInt(values.code as any),
        birthDate,
        birthYear: birthDate.getFullYear(),
        gender,
        sportLevel,
      });
      router.reload();
    } catch (err) {
      const error: { response: { data: { code: string; athlete: Athlete } } } =
        err as any;

      if (error.response.data?.code === "SAME_CODE_EXISTS") {
        showNotification({
          color: "yellow",
          title: `SVO-код ${error.response.data.athlete.code} уже присвоен`,
          message: `${error.response.data.athlete.lastName} ${error.response.data.athlete.firstName} (${error.response.data.athlete.birthYear})`,
        });
      } else {
        showNotification({
          color: "red",
          title: "Что-то пошло не так",
          message: "Попробуйте перезагрузить страницу",
        });
      }
    }
  };

  const dateParser = (dateString: string) => {
    const parts = dateString.split(".");
    if (parts.length > 2) {
      return new Date(Date.parse(`${parts[1]}.${parts[0]}.${parts[2]}`));
    }
    return new Date(Date.parse(dateString));
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Group direction="column">
        <TextInput
          label="Фамилия"
          sx={{ width: "100%" }}
          required
          {...form.getInputProps("lastName")}
        />
        <TextInput
          label="Имя"
          sx={{ width: "100%" }}
          required
          {...form.getInputProps("firstName")}
        />
        <TextInput
          label="Отчество"
          sx={{ width: "100%" }}
          required
          {...form.getInputProps("middleName")}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridGap: "24px",
          }}
        >
          <DatePicker
            label="Дата рождения"
            locale="ru"
            value={birthDate}
            onChange={setBirthDate as (date: Date | null) => void}
            required
            clearable={false}
            allowFreeInput
            dateParser={dateParser}
            inputFormat="DD.MM.YYYY"
            error={errors.birthDate ? "Обязательное поле" : ""}
          />
          <Select
            label="Пол"
            data={[
              { value: "MAN", label: "Мужской" },
              { value: "WOMAN", label: "Женский" },
            ]}
            required
            value={gender}
            onChange={setGender as (gender: null | Gender) => void}
            error={errors.gender ? "Обязательное поле" : ""}
          />
        </Box>

        <TextInput
          label="Команда"
          sx={{ width: "100%" }}
          required
          {...form.getInputProps("team")}
        />
        <TextInput
          label="Регион"
          sx={{ width: "100%" }}
          required
          {...form.getInputProps("city")}
        />
        <TextInput
          label="Телефон"
          sx={{ width: "100%" }}
          required
          {...form.getInputProps("phone")}
        />
        <Select
          label="Спортивный разряд"
          data={[
            { value: "ZMS", label: "ЗМС" },
            { value: "MSMK", label: "МСМК" },
            { value: "MS", label: "МС" },
            { value: "KMS", label: "КМС" },
            { value: "FIRST", label: "I разряд" },
            { value: "SECOND", label: "II разряд" },
            { value: "THIRD", label: "III разряд" },
            { value: "FIRST_JUNIOR", label: "III разряд" },
            { value: "SECOND_JUNIOR", label: "I юн.разряд" },
            { value: "THIRD_JUNIOR", label: "II юн.разряд" },
            { value: "NONE", label: "III юн.разряд" },
          ]}
          required
          value={sportLevel}
          onChange={setSportLevel as (level: null | SportLevel) => void}
          error={errors.sportLevel ? "Обязательное поле" : ""}
          sx={{ width: "100%" }}
        />
        <TextInput
          label="FIS код"
          sx={{ width: "100%" }}
          {...form.getInputProps("fisCode")}
        />
        <TextInput
          label="RUS код"
          sx={{ width: "100%" }}
          {...form.getInputProps("rusCode")}
        />
        <TextInput
          label="SVO код"
          type="number"
          description="При изменении убедитесь, что код никому не присвоен"
          sx={{ width: "100%" }}
          {...form.getInputProps("code")}
        />
        <Checkbox
          label="Оплата подтверждена"
          sx={{ alignSelf: "flex-end" }}
          {...form.getInputProps("confirmed", { type: "checkbox" })}
        />

        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            type="submit"
            loading={loading}
            sx={{ width: "160px", marginTop: "12px" }}
          >
            Изменить
          </Button>
        </Box>
      </Group>
    </form>
  );
};

export default EditAthleteForm;
