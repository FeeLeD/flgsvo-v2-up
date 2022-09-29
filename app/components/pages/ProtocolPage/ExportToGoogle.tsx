import React, { FC, useState } from "react";
import { useApi } from "hooks";
import { useNotifications } from "@mantine/notifications";
import { Group, TextInput, Button, Divider } from "@mantine/core";
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";

type Props = {
  eventId: number;
};

const ExportToGoogle: FC<Props> = ({ eventId }) => {
  const { showNotification } = useNotifications();
  const [_, loading, exportProtocol] = useApi(
    (api) => api.event.exportProtocol
  );
  const [input, setInput] = useState("");

  const onExportToGoogle = async () => {
    try {
      const firstParts = input.split("d/");
      const [sheetId] = firstParts[1].split("/");
      await exportProtocol({ sheetId, eventId });

      showNotification({
        color: "green",
        title: "Данные успешно экспортированы",
        message: input,
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
          description="Для экспорта необходимо создать Google таблицу и добавить в качестве редактора: spreadsheets@flgso-v2.iam.gserviceaccount.com"
          placeholder="Например, https://docs.google.com/spreadsheets/d/doc_id/edit"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          sx={{ width: "500px" }}
        />
        <Button
          leftIcon={<BsFillFileEarmarkSpreadsheetFill />}
          loading={loading}
          onClick={onExportToGoogle}
          disabled={!input}
        >
          Открыть в Google таблицах
        </Button>
      </Group>

      <Divider />
    </div>
  );
};

export default ExportToGoogle;
