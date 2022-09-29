import React, { FC, useEffect, useState } from "react";
import { useApi } from "hooks";
import { useRouter } from "next/router";
import { FileDto } from "_api/dto/cdn";
import { useNotifications } from "@mantine/notifications";
import { Paper, Title, Button, Center } from "@mantine/core";
import { PostEditorForm } from "components/general/";
import PrivateLayout from "components/PrivateLayout";

const EditPostPage: FC = () => {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const [_, loadingUpdate, updatePost] = useApi((api) => api.post.updatePost);
  const [__, loadingPost, loadPost, loadPostError] = useApi(
    (api) => api.post.getPost
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<Array<FileDto & { id?: number }>>([]);

  useEffect(() => {
    if (router.query.id && typeof router.query.id === "string") {
      fetchPost();
    }
  }, [router.query.id]);

  const fetchPost = async () => {
    try {
      const post = await loadPost(router.query.id as string);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setFiles(
          post.files.map((file) => ({
            id: file.id,
            name: file.name,
            url: file.sourceLink,
            error: undefined,
          }))
        );
      }
    } catch (err) {
      showNotification({
        color: "red",
        title: "Произошла ошибка",
        message: "Попробуйте перезагрузить страницу",
      });
    }
  };

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
      await updatePost({
        id: (router.query.id as string) ?? "",
        title,
        content,
        files,
      });

      router.push("/");
    } catch (err) {
      showNotification({
        color: "red",
        title: "Произошла ошибка",
        message: "Новость не обновлена. Попробуйте ещё раз",
      });
    }
  };

  return (
    <PrivateLayout isLoading={loadingPost} onlyAdmin>
      {!loadPostError ? (
        <div style={{ width: "100%" }}>
          <Title>Редактирование новости</Title>

          <Paper padding="xl" shadow="xs" sx={{ margin: "24px 0 48px" }}>
            <PostEditorForm
              data={{ title, content, files }}
              onChange={onDataChange}
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                size="lg"
                loading={loadingUpdate}
                disabled={!title || !content}
                onClick={onSubmit}
                sx={{ width: "200px", marginTop: "24px" }}
              >
                Изменить
              </Button>
            </div>
          </Paper>
        </div>
      ) : (
        <Center>Ошибка во время загрузки новости</Center>
      )}
    </PrivateLayout>
  );
};

export default EditPostPage;
