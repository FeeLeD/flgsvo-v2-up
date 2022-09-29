import React, { FC } from "react";
import { File } from ".prisma/client";
import { Anchor, Divider, Group, Title } from "@mantine/core";
import { BsFillFileEarmarkFill } from "react-icons/bs";

type Props = {
  title: string;
  files: File[];
};

const FilesList: FC<Props> = ({ title, files }) => {
  if (files.length > 0) {
    return (
      <div style={{ width: "100%" }}>
        <Title order={5}>{title}</Title>
        <Divider />

        <Group direction="column" spacing={8} sx={{ marginTop: "12px" }}>
          {files.map((file) => (
            <div
              key={file.id}
              style={{
                display: "grid",
                gridTemplateColumns: "32px auto",
                gridGap: "8px",
              }}
            >
              <BsFillFileEarmarkFill size="32px" color="#228BE6" />
              <Anchor
                size="sm"
                href={file.sourceLink}
                target="_blank"
                sx={{ alignSelf: "center" }}
              >
                {file.name}
              </Anchor>
            </div>
          ))}
        </Group>
      </div>
    );
  }

  return null;
};

export default FilesList;
