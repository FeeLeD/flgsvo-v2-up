import React, { FC } from "react";
import { MdLabelImportant } from "react-icons/md";
import { Anchor, Box, Group, Paper, Table, Text, Title } from "@mantine/core";

const FirstStep: FC = () => {
  return (
    <Group direction="column" spacing={32}>
      <Paper
        shadow="md"
        padding="xl"
        sx={{ width: "100%", borderRadius: "8px", border: "1px solid #74C0FC" }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "28px auto",
            gridGap: "12px",
            "@media (max-width: 600px)": {
              gridTemplateColumns: "1fr",
            },
          }}
        >
          <Box
            sx={{
              "@media (max-width: 600px)": {
                display: "none",
              },
            }}
          >
            <MdLabelImportant size="28px" color="#339AF0" />
          </Box>

          <Box>
            <Text>
              До начала регистрации необходимо оплатить регистрационный взнос{" "}
              <b>300 рублей</b>
            </Text>
            <Box
              sx={{
                marginTop: "16px",
                "@media (max-width: 600px)": {
                  marginTop: "16px",
                },
              }}
            >
              <Text>В комментарии к оплате обязательно указать:</Text>
              <Text
                sx={{
                  "@media (max-width: 600px)": {
                    fontSize: "16px",
                  },
                }}
              >
                <i>
                  «Регистрационный взнос спортсмена ФЛГСО (без НДС): Фамилии
                  И.О., г. рождения, спорт школа»
                </i>
              </Text>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ width: "100%" }}>
        <Title order={2}>Реквизиты</Title>

        <Table
          striped
          sx={{
            marginTop: "12px",
            border: "1px solid black",
            background: "white",
          }}
        >
          <tbody>
            {[
              {
                title: "Наименование",
                payload:
                  "Региональная общественная организация «Федерация лыжных гонок Свердловской области»",
              },
              {
                title: "ИНН/КПП",
                payload: "6672184783 / 668601001",
              },
              {
                title: "Р/С",
                payload: "40703810600020004643",
              },
              {
                title: "Банк",
                payload: "Филиал «ЦЕНТРАЛЬНЫЙ» Банка ВТБ ПАО г. Москва",
              },
              {
                title: "БИК",
                payload: "044525411",
              },
              {
                title: "К/С",
                payload: "30101810145250000411",
              },
            ].map((row) => (
              <tr key={row.title}>
                <td>
                  <Text
                    sx={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      width: "130px",
                    }}
                  >
                    {row.title}
                  </Text>
                </td>
                <td>
                  <Text sx={{ fontSize: "16px", width: "100%" }}>
                    {row.payload}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Box sx={{ marginTop: "4px" }}>
          <Anchor
            size="sm"
            href="https://storage.yandexcloud.net/flgso-files/files/%D0%A0%D0%B5%D0%BA%D0%B2%D0%B8%D0%B7%D0%B8%D1%82%D1%8B%20%D1%80%D0%B5%D0%B3%D0%B2%D0%B7%D0%BD%D0%BE%D1%81.pdf"
            target="_blank"
          >
            Реквизиты Федерации лыжных гонок Свердловской области
          </Anchor>
        </Box>
      </Box>
    </Group>
  );
};

export default FirstStep;
