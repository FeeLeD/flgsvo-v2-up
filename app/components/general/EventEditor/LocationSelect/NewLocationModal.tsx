import React, { FC, useRef } from "react";
import { useApi } from "hooks";
import { useNotifications } from "@mantine/notifications";
import { Button, Group, Modal, Textarea, TextInput } from "@mantine/core";

type Props = {
  opened: boolean;
  onClose: () => void;
  updateLocationsList: () => void;
};

const NewLocationModal: FC<Props> = ({
  opened,
  onClose,
  updateLocationsList,
}) => {
  const { showNotification } = useNotifications();
  const [_, isLoading, createLocation] = useApi(
    (api) => api.event.createLocation
  );
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const webRef = useRef<HTMLInputElement>(null);

  const onAdd = async () => {
    if (
      !nameRef.current?.value ||
      !descriptionRef.current ||
      !addressRef.current ||
      !cityRef.current?.value ||
      !phoneRef.current ||
      !webRef.current
    ) {
      showNotification({
        color: "yellow",
        message: "Заполните обязательные поля",
      });
      return;
    }

    try {
      await createLocation({
        name: nameRef.current.value,
        description: descriptionRef.current.value,
        address: addressRef.current.value,
        city: cityRef.current.value,
        phone: phoneRef.current.value,
        web: webRef.current.value,
        country: "Россйская Федерация",
      });
      updateLocationsList();
      onClose();
    } catch (err) {
      showNotification({
        color: "red",
        title: "Произошла ошибка",
        message: "Запись не создана. Попробуйте ещё раз",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Создание нового местоположения"
      overflow="outside"
    >
      <Group direction="column" spacing={12}>
        <TextInput
          ref={nameRef}
          label="Название"
          required
          sx={{ width: "100%" }}
        />
        <Textarea
          ref={descriptionRef}
          label="Описание"
          autosize
          minRows={2}
          maxRows={10}
          sx={{ width: "100%" }}
        />
        <TextInput ref={addressRef} label="Адрес" sx={{ width: "100%" }} />
        <TextInput
          ref={cityRef}
          label="Город"
          sx={{ width: "100%" }}
          required
        />
        <TextInput ref={phoneRef} label="Телефон" sx={{ width: "100%" }} />
        <TextInput ref={webRef} label="Веб-сайт" sx={{ width: "100%" }} />
      </Group>

      <Button
        loading={isLoading}
        sx={{ marginTop: "24px", float: "right" }}
        onClick={onAdd}
      >
        Создать
      </Button>
    </Modal>
  );
};

export default React.memo(NewLocationModal);
