import React, { FC, useState } from "react";
import { Button, Divider, Group, TextInput } from "@mantine/core";
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { useApi } from "hooks";
import { useNotifications } from "@mantine/notifications";

type Props = {
  raceId: number | undefined;
};

const UploadResults: FC<Props> = ({ raceId }) => {
  const { showNotification } = useNotifications();
  const [input, setInput] = useState("");
  const [_, loading, loadResults] = useApi((api) => api.event.loadResults);

  const onLoadResults = async () => {
    if (!raceId) return;

    try {
      const firstParts = input.split("d/");
      const [sheetId] = firstParts[1].split("/");
      await loadResults({ raceId, sheetId });

      showNotification({
        color: "green",
        title: "Данные гонки загружены",
        message: "Обновите страницу, чтобы увидеть результаты",
      });
    } catch (err) {
      showNotification({
        color: "red",
        message: "Произошла ошибка",
      });
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Group
        sx={{
          width: "100%",
          alignItems: "flex-end",
          marginBottom: "24px",
        }}
      >
        <TextInput
          label="Ссылка на Google таблицу"
          description="Для добавления результатов необходимо добавить в качестве редактора таблицы: spreadsheets@flgso-v2.iam.gserviceaccount.com"
          placeholder="Например, https://docs.google.com/spreadsheets/d/doc_id/edit"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          sx={{ width: "500px" }}
        />

        <Button
          leftIcon={<BsFillFileEarmarkSpreadsheetFill />}
          loading={loading}
          onClick={onLoadResults}
          disabled={!input || !raceId}
        >
          Загрузить из Google таблицы
        </Button>
      </Group>

      <Divider />
    </div>
  );
};

export default UploadResults;
