import React, { FC } from "react";
import dynamic from "next/dynamic";
import { FileDto } from "_api/dto/cdn";
import { Group, TextInput } from "@mantine/core";
import Files from "./Files";

const TextEditor = dynamic(() => import("./TextEditor"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  data: {
    title: string;
    content: string;
    files: FileDto[];
  };
  onChange: (data: {
    title: string;
    content: string;
    files: FileDto[];
  }) => void;
};

const PostEditorForm: FC<Props> = ({ data, onChange = () => ({}) }) => {
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, title: e.currentTarget.value });
  };

  const onContentChange = (newContent: string) => {
    onChange({ ...data, content: newContent });
  };

  const onFilesChange = (newFiles: FileDto[]) => {
    onChange({ ...data, files: newFiles });
  };

  return (
    <Group direction="column" spacing={24} sx={{ width: "100%" }}>
      <TextInput
        value={data.title}
        onChange={onTitleChange}
        label="Заголовок"
        required
        sx={{ width: "100%" }}
      />

      <TextEditor content={data.content} onChange={onContentChange} />

      <Files files={data.files} onChange={onFilesChange} />
    </Group>
  );
};

export default PostEditorForm;
