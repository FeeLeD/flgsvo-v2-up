import React, { FC, useRef } from "react";
import { useApi } from "hooks";
import { useNotifications } from "@mantine/notifications";
import { Button, Group, Modal, Textarea, TextInput } from "@mantine/core";

type Props = {
  opened: boolean;
  onClose: () => void;
  updateOrgsList: () => void;
};

const NewOrganizationModal: FC<Props> = ({
  opened,
  onClose,
  updateOrgsList,
}) => {
  const { showNotification } = useNotifications();
  const [_, isLoading, createOrg] = useApi((api) => api.event.createOrg);
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const webRef = useRef<HTMLInputElement>(null);

  const onAdd = async () => {
    if (
      !nameRef.current?.value ||
      !descriptionRef.current ||
      !locationRef.current ||
      !emailRef.current ||
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
      await createOrg({
        name: nameRef.current.value,
        description: descriptionRef.current.value,
        location: locationRef.current.value,
        email: emailRef.current.value,
        phone: phoneRef.current.value,
        web: webRef.current.value,
      });
      updateOrgsList();
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
      title="Создание нового организатора"
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
        <TextInput ref={locationRef} label="Адрес" sx={{ width: "100%" }} />
        <TextInput ref={phoneRef} label="Телефон" sx={{ width: "100%" }} />
        <TextInput ref={emailRef} label="E-mail" sx={{ width: "100%" }} />
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

export default NewOrganizationModal;
