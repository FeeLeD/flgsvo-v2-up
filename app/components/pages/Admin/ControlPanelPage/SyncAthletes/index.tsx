import React, { FC, useRef, useState } from "react";
import { useApi } from "hooks";
import { Button, Group, Modal, Text, TextInput } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";

const SyncAthletes: FC = () => {
  const { showNotification } = useNotifications();
  const [opened, setOpened] = useState(false);
  const openAlert = () => setOpened(true);
  const closeAlert = () => setOpened(false);
  const numberRef = useRef(0);
  const [_, loading, syncAthletes] = useApi((api) => api.athletes.syncAthletes);

  const onSync = async () => {
    try {
      await syncAthletes({ fromNumber: numberRef.current ?? 0 });
      closeAlert();
      showNotification({
        color: "green",
        message: "База синхронизирована",
      });
    } catch (err) {
      showNotification({
        color: "red",
        message: "Ошибка синхронизации",
      });
    }
  };

  return (
    <Group sx={{ width: "100%", justifyContent: "flex-end" }}>
      <Button variant="outline" onClick={openAlert}>
        Синхронизировать базу с Google таблицей
      </Button>
      <TextInput
        type="number"
        placeholder="C номера..."
        onChange={(e) => (numberRef.current = parseInt(e.currentTarget.value))}
        sx={{ width: "120px" }}
      />

      {opened && (
        <Modal opened={opened} onClose={closeAlert} title="Внимание!">
          <Text>Вы уверены в своём действии?</Text>
          <Text size="sm" sx={{ opacity: 0.6 }}>
            Данное действие может привести к сбою в работе системы
          </Text>

          <Button
            loading={loading}
            onClick={onSync}
            sx={{ marginTop: "24px", float: "right" }}
          >
            Синхронизировать с номера {numberRef.current || 0}
          </Button>
        </Modal>
      )}
    </Group>
  );
};

export default SyncAthletes;
