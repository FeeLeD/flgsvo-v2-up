import React, { FC } from "react";
import { FileDto } from "_api/dto/cdn";
import { ActionIcon, Group, Text } from "@mantine/core";
import { MIME_TYPES } from "@mantine/dropzone";
import FileDropZone from "../FileDropZone";
import { BsFillFileEarmarkFill, BsXSquare } from "react-icons/bs";

type Props = {
  files: FileDto[];
  onChange: (files: FileDto[]) => void;
};

const Files: FC<Props> = ({ files = [], onChange = () => ({}) }) => {
  const onFilesUpload = (newFiles: FileDto[]) => {
    onChange([...files, ...newFiles]);
  };

  const onFileRemove = (url: string | undefined) => {
    return () => {
      onChange(files.filter((file) => file?.url !== url));
    };
  };

  return (
    <Group direction="column" spacing={8} sx={{ width: "100%" }}>
      {files.map((file, i) => (
        <Group
          key={i}
          sx={{
            width: "100%",
            justifyContent: "space-between",
            borderRadius: "8px",
            "&:hover": {
              background: "rgba(0,0,0,.025)",
            },
          }}
        >
          <Group spacing={8}>
            <BsFillFileEarmarkFill size="28px" color="#228BE6" />

            <div>
              <Text size="sm">{file.name}</Text>
              <Text
                size="xs"
                sx={{ wordWrap: "break-word", maxWidth: "920px" }}
              >
                {file.url}
              </Text>
            </div>
          </Group>

          <ActionIcon onClick={onFileRemove(file.url)}>
            <BsXSquare />
          </ActionIcon>
        </Group>
      ))}

      <FileDropZone
        size="sm"
        onChange={onFilesUpload}
        accept={[MIME_TYPES.docx, MIME_TYPES.doc, MIME_TYPES.pdf]}
      />
    </Group>
  );
};

export default Files;
