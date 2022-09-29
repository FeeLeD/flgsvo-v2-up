import React, { FC } from "react";
import { EventDataFile } from "../types";
import { BsFillFileEarmarkFill, BsXSquare } from "react-icons/bs";
import { ActionIcon, Anchor, Group, Text } from "@mantine/core";

type Props = {
  files: Array<EventDataFile>;
  onFileRemove: (file: EventDataFile) => void;
};

const UploadedFiles: FC<Props> = ({ files, onFileRemove = () => ({}) }) => {
  const onRemove = (file: EventDataFile) => {
    return () => onFileRemove(file);
  };

  return (
    <Group direction="column">
      {files.map((file, i) => (
        <Group
          key={i}
          sx={{
            width: "100%",
            justifyContent: "space-between",
            borderRadius: "8px",
            padding: "4px",
            "&:hover": {
              background: "rgba(0,0,0,.025)",
            },
          }}
        >
          <Group>
            <BsFillFileEarmarkFill size="32px" color="#228BE6" />

            <div>
              <Anchor
                lineClamp={1}
                size="sm"
                href={file.sourceLink}
                target="_blank"
                sx={{ overflow: "hidden" }}
              >
                {file.name}
              </Anchor>

              <Text size="xs">
                {file.type === "PROGRAM"
                  ? "Положение / регламент"
                  : file.type === "RESULT"
                  ? "Результат"
                  : ""}
              </Text>
            </div>
          </Group>

          <ActionIcon
            variant="transparent"
            sx={{ opacity: 0.8 }}
            onClick={onRemove(file)}
          >
            <BsXSquare />
          </ActionIcon>
        </Group>
      ))}
    </Group>
  );
};

export default UploadedFiles;
