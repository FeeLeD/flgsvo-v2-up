import React, { FC, useRef } from "react";
import { useApi } from "hooks";
import { FileDto } from "_api/dto/cdn";
import { Button, Group, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useNotifications } from "@mantine/notifications";
import {
  BsFileEarmarkArrowDown,
  BsFillFileEarmarkArrowDownFill,
} from "react-icons/bs";

type Props = {
  onChange?: (programs: FileDto[]) => void;
  accept?: string[];
  size?: "lg" | "sm";
  onlyButton?: boolean;
  buttonText?: string;
};

const FileDropZone: FC<Props> = ({
  onChange = () => ({}),
  size = "lg",
  accept,
  onlyButton,
  buttonText,
}) => {
  const openRef = useRef<() => void>(null);
  const { showNotification } = useNotifications();
  const [_, loading, uploadFiles] = useApi((api) => api.cdn.uploadFiles);

  const onDrop = async (files: File[]) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const files = await uploadFiles(formData);
      onChange(files ?? []);
    } catch (err) {
      showNotification({
        color: "red",
        message: "Файлы не были загружены. Попробуйте ещё раз",
      });
    }
  };

  const openSelectFiles = () => {
    if (openRef.current) openRef.current();
  };

  return (
    <>
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        loading={loading}
        openRef={openRef}
        sx={{ width: "100%", display: onlyButton ? "none" : "initial" }}
      >
        {(status) => (
          <Group
            position="center"
            spacing="xl"
            style={{
              minHeight: size === "lg" ? 120 : 40,
              pointerEvents: "none",
            }}
          >
            <BsFillFileEarmarkArrowDownFill
              size={size === "lg" ? "40px" : "24px"}
              color="rgba(0,0,0,.6)"
            />

            <div>
              <Text size={size === "lg" ? "xl" : "md"} inline>
                Перетащите файлы или нажмите для их выбора
              </Text>
              <Text
                size={size === "lg" ? "sm" : "xs"}
                color="dimmed"
                inline
                mt={7}
              >
                Вы можете прикрепить несколько файлов
              </Text>
            </div>
          </Group>
        )}
      </Dropzone>

      {onlyButton && (
        <Button
          variant="outline"
          loading={loading}
          leftIcon={<BsFileEarmarkArrowDown />}
          onClick={openSelectFiles}
        >
          {buttonText}
        </Button>
      )}
    </>
  );
};

export default FileDropZone;
