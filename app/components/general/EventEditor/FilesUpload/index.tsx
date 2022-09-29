import React, { FC } from "react";
import { FileDto } from "_api/dto/cdn";
import { EventDataFile } from "../types";
import { FileType } from ".prisma/client";
import { Divider, Group, Title } from "@mantine/core";
import FileDropZone from "components/general/FileDropZone";
import UploadedFiles from "./UploadedFiles";

type Props = {
  files: Array<EventDataFile>;
  onChange?: (files: Array<EventDataFile>) => void;
};

const FilesUpload: FC<Props> = ({ files = [], onChange = () => ({}) }) => {
  const onFilesUpload = (type: FileType) => {
    return (newFiles: FileDto[]) => {
      onChange([
        ...files,
        ...newFiles
          .filter((file) => !file.error)
          .map((file) => ({
            name: file.name ?? "",
            sourceLink: file.url ?? "",
            type,
          })),
      ]);
    };
  };

  const onFileRemove = (file: EventDataFile) => {
    onChange(files.filter((f) => f.sourceLink !== file.sourceLink));
  };

  return (
    <div style={{ width: "100%" }}>
      <Title order={4}>Файлы</Title>
      <Divider />

      <Group sx={{ marginTop: "8px" }}>
        <FileDropZone
          onlyButton
          buttonText="Добавить положение / регламент"
          onChange={onFilesUpload("PROGRAM")}
        />
        <FileDropZone
          onlyButton
          buttonText="Добавить результаты"
          onChange={onFilesUpload("RESULT")}
        />
      </Group>

      <div style={{ marginTop: "24px" }}>
        <UploadedFiles files={files} onFileRemove={onFileRemove} />
      </div>
    </div>
  );
};

export default FilesUpload;
