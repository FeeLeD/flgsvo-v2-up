import React, { FC, useMemo } from "react";
import { useSession } from "next-auth/client";
import { UserSession } from "lib/types";
import { File } from ".prisma/client";
import FileList from "./FilesList";
import { Group } from "@mantine/core";
import FileDropZone from "components/general/FileDropZone";

type Props = {
  files: File[];
};

const Files: FC<Props> = ({ files = [] }) => {
  const [session] = useSession();

  const [programs, results] = useMemo(() => {
    const programs = files.filter((file) => file.type === "PROGRAM");
    const results = files.filter((file) => file.type === "RESULT");

    return [programs, results];
  }, [files]);

  return (
    <div>
      {(session?.user as UserSession)?.isAdmin && (
        <Group sx={{ marginTop: "8px" }}>
          <FileDropZone
            onlyButton
            buttonText="Добавить положение / регламент"
            // onChange={onFilesUpload("PROGRAM")}
          />
          <FileDropZone
            onlyButton
            buttonText="Добавить результаты"
            // onChange={onFilesUpload("RESULT")}
          />
        </Group>
      )}

      <Group
        direction="column"
        spacing={24}
        sx={{ width: "100%", marginTop: "24px" }}
      >
        <FileList title="Результаты" files={results} />
        <FileList title="Положение / регламент" files={programs} />
      </Group>
    </div>
  );
};

export default Files;
