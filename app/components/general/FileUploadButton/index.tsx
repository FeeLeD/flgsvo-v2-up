import React, { FC, useRef } from "react";
import { FileDto } from "_api/dto/cdn";
import { useApi } from "hooks";
import { Button, ButtonVariant, CSSObject, MantineTheme } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { Dropzone } from "@mantine/dropzone";

type Props = {
  onChange?: (files: FileDto[]) => void;
  multiple?: boolean;
  variant?: ButtonVariant;
  compact?: boolean;
  loading?: boolean;
  disabled?: boolean;
  sx?: CSSObject | ((theme: MantineTheme) => CSSObject);
};

const FileUploadButton: FC<Props> = ({
  onChange = () => ({}),
  multiple,
  variant,
  compact,
  loading,
  disabled,
  sx,
}) => {
  const openRef = useRef<() => void>(null);
  const { showNotification } = useNotifications();
  const [_, uploadLoading, uploadFiles] = useApi((api) => api.cdn.uploadFiles);

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

  const openSelect = () => (openRef.current ? openRef.current() : {});

  return (
    <>
      <Dropzone
        openRef={openRef}
        onDrop={onDrop}
        sx={{ display: "none" }}
        multiple={multiple}
      >
        {() => <></>}
      </Dropzone>

      <Button
        onClick={openSelect}
        loading={loading || uploadLoading}
        variant={variant}
        compact={compact}
        disabled={disabled}
        sx={sx}
      >
        Загрузить протокол
      </Button>
    </>
  );
};

export default FileUploadButton;
