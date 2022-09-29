import React, { FC } from "react";
import { api } from "_api";
import RichTextEditor from "@mantine/rte";
import { useNotifications } from "@mantine/notifications";

type Props = {
  content: string;
  onChange: (content: string) => void;
};

const TextEditor: FC<Props> = ({ content, onChange = () => ({}) }) => {
  const { showNotification } = useNotifications();

  const onImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = await api.cdn.uploadFile(formData);
      return url ?? "";
    } catch (err) {
      showNotification({
        color: "red",
        message: "Изображение не было загружено",
      });
      return "";
    }
  };

  return (
    <RichTextEditor
      value={content}
      onChange={onChange}
      onImageUpload={onImageUpload}
      sx={{ width: "100%" }}
    />
  );
};

export default TextEditor;
