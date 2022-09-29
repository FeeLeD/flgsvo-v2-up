import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { paths } from "lib/paths";
import { Post } from ".prisma/client";
import parse from "html-react-parser";
import { useSession } from "next-auth/client";
import { useApi } from "hooks";
import { UserSession } from "lib/types";
import { useNotifications } from "@mantine/notifications";
import {
  ActionIcon,
  Box,
  Button,
  Modal,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { HStack } from "components/general";
import {
  BsFillPencilFill,
  BsTrashFill,
  BsTrash,
  BsSnow2,
} from "react-icons/bs";
import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");

type PostType = {
  post: Post;
};

const Post: FC<PostType> = ({ post }) => {
  const router = useRouter();
  const [session] = useSession();
  const { showNotification } = useNotifications();
  const [deleteModalOpened, setModalOpened] = useState(false);
  const openDeleteModal = () => setModalOpened(true);
  const closeDeleteModal = () => setModalOpened(false);
  const [_, loading, deletePost] = useApi((api) => api.post.deletePost);

  const onDeletePost = async () => {
    try {
      await deletePost(post.id ?? "");
      router.reload();
    } catch (err) {
      showNotification({
        color: "red",
        message: "Ошибка во время удаления. Попробуйте снова",
      });
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <Paper
      padding="xl"
      shadow="xs"
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: "16px",
      }}
    >
      <BsSnow2
        size="140px"
        style={{
          position: "absolute",
          top: "-36px",
          right: "-36px",
          opacity: 0.03,
        }}
      />

      <HStack sx={{ width: "100%", justifyContent: "space-between" }}>
        <div>
          <Title
            order={2}
            sx={{
              "@media (max-width: 620px)": {
                fontSize: "20px",
              },
            }}
          >
            {post.title}
          </Title>
          <Text size="sm" sx={{ marginTop: "8px", opacity: 0.6 }}>
            {dayjs(post.createdAt).format("DD MMMM YYYY")}
          </Text>
        </div>

        {session?.user && (session?.user as UserSession).isAdmin && (
          <HStack>
            <Link href={paths.post.edit(post.id)} passHref>
              <ActionIcon
                component="a"
                variant="outline"
                color="blue"
                size="sm"
              >
                <BsFillPencilFill size="12px" />
              </ActionIcon>
            </Link>

            <ActionIcon
              variant="outline"
              color="pink"
              size="sm"
              onClick={openDeleteModal}
            >
              <BsTrashFill size="12px" />
            </ActionIcon>
          </HStack>
        )}
      </HStack>

      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <Box
          sx={() => ({
            marginTop: "24px",
            "& .ql-align-right": {
              textAlign: "right",
            },
            "& .ql-align-left": {
              textAlign: "left",
            },
            "& .ql-align-center": {
              textAlign: "center",
            },
            "& img": {
              maxWidth: "100%",
              maxHeight: "90vh",
            },
            "& a": {
              textDecoration: "none",
              color: "#228BE6",
            },
            "& a:hover": { opacity: 0.8 },
            iframe: {
              width: "100%",
              height: "50vh",
            },
          })}
        >
          {parse(post.content ?? "")}
        </Box>
      </Box>

      {session?.user && (
        <Modal
          opened={deleteModalOpened}
          onClose={closeDeleteModal}
          hideCloseButton
        >
          <Text>
            <b>Внимание!</b> Новость будет удалена без возможности
            восстановления
          </Text>

          <Button
            variant="default"
            color="blue"
            sx={{ marginTop: "24px", float: "right" }}
            onClick={closeDeleteModal}
          >
            Отмена
          </Button>

          <Button
            variant="outline"
            color="pink"
            leftIcon={<BsTrash />}
            sx={{ marginTop: "24px", marginRight: "8px", float: "right" }}
            onClick={onDeletePost}
            loading={loading}
          >
            Удалить
          </Button>
        </Modal>
      )}
    </Paper>
  );
};

export default Post;
