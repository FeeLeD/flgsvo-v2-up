import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import { useApi } from "hooks";
import { FileDto } from "_api/dto/cdn";
import { useNotifications } from "@mantine/notifications";
import { Paper, Title, Button } from "@mantine/core";
import { PostEditorForm } from "components/general/";
import PrivateLayout from "components/PrivateLayout";

const NewPostPage: FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileDto[]>([]);
  const { showNotification } = useNotifications();
  const [_, loading, createPost] = useApi((api) => api.post.createPost);

  const onDataChange = (newData: {
    title: string;
    content: string;
    files: FileDto[];
  }) => {
    if (newData.title !== title) setTitle(newData.title);
    if (newData.content !== content) setContent(newData.content);
    if (newData.files.length !== files.length) setFiles(newData.files);
  };

  const onSubmit = async () => {
    try {
      await createPost({
        title,
        content,
        files,
      });

      router.push("/");
    } catch (err) {
      showNotification({
        color: "red",
        title: "Произошла ошибка",
        message: "Новость не опубликована. Попробуйте ещё раз",
      });
    }
  };

  return (
    <PrivateLayout onlyAdmin>
      <div style={{ width: "100%" }}>
        <Title>Создание Новости</Title>

        <Paper padding="xl" shadow="xs" sx={{ margin: "24px 0 48px" }}>
          <PostEditorForm
            data={{ title, content, files }}
            onChange={onDataChange}
          />

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              size="lg"
              loading={loading}
              onClick={onSubmit}
              disabled={!title || !content}
              sx={{ width: "200px", marginTop: "32px" }}
            >
              Создать
            </Button>
          </div>
        </Paper>
      </div>
    </PrivateLayout>
  );
};

export default NewPostPage;
