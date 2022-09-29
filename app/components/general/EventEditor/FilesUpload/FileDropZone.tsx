import React, { FC } from "react";
import { useApi } from "hooks";
import { RaceFile } from "./type";
import { Group, Text } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useNotifications } from "@mantine/notifications";
import { BsFillFileEarmarkArrowDownFill } from "react-icons/bs";

type Props = {
  onChange?: (programs: RaceFile[]) => void;
};

const FileDropZone: FC<Props> = ({ onChange = () => ({}) }) => {
  const { showNotification } = useNotifications();
  const [_, isLoading, uploadFiles] = useApi((api) => api.cdn.uploadFiles);

  const onDrop = async (files: File[]) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const files = await uploadFiles(formData);
      const programs = files?.map((file) => ({
        name: file.name,
        link: file.url,
        isDownloaded: Boolean(file.error),
      }));
      onChange(programs ?? []);
    } catch (err) {
      showNotification({
        color: 'red',
        message: 'Файлы не были загружены. Попробуйте ещё раз'
      })
    }
  };

  return (
    <Dropzone
      onDrop={onDrop}
      accept={[MIME_TYPES.docx, MIME_TYPES.doc, MIME_TYPES.pdf]}
      loading={isLoading}
      sx={{ width: "100%" }}
    >
      {(status) => (
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: 120, pointerEvents: "none" }}
        >
          <BsFillFileEarmarkArrowDownFill size="40px" color="rgba(0,0,0,.6)" />

          <div>
            <Text size="xl" inline>
              Перетащите файлы или нажмите для их выбора
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Вы можете прикрепить несколько файлов (.doc, .docx, .pdf)
            </Text>
          </div>
        </Group>
      )}
    </Dropzone>
  );
};

export default FileDropZone;
