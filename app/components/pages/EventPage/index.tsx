import React, { FC, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");
import Link from "next/link";
import { useRouter } from "next/router";
import { paths } from "lib/paths";
import { UserSession } from "lib/types";
import { useSession } from "next-auth/client";
import { EventDto } from "_api/dto/event";
import parse from "html-react-parser";
import { useApi } from "hooks";
import {
  Anchor,
  Box,
  Button,
  Group,
  Modal,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import {
  BsFillGeoAltFill,
  BsFillPeopleFill,
  BsFillTelephoneFill,
  BsGlobe,
  BsFillPencilFill,
  BsTrash,
} from "react-icons/bs";
import RacesTable from "./RacesTable";
import Files from "./Files";
import { useNotifications } from "@mantine/notifications";
import { eventParser } from "lib/eventParser";
import { InternalLink } from "components/general";

type Props = {
  event: EventDto;
};

const EventPage: FC<Props> = ({ event }) => {
  const { push: redirectTo } = useRouter();
  const { showNotification } = useNotifications();
  const [deleteModalOpened, setModalOpened] = useState(false);
  const openDeleteModal = () => setModalOpened(true);
  const closeDeleteModal = () => setModalOpened(false);
  const [_, loading, deleteEvent] = useApi((api) => api.event.deleteEventById);
  const [session] = useSession();

  const onDeletePost = async () => {
    try {
      await deleteEvent(event.id);
      redirectTo(paths.events.index);
    } catch (err) {
      showNotification({
        color: "red",
        message: "Что-то пошло не так. Попробуйте снова",
      });
    }
  };

  return (
    <div>
      <Group
        sx={{
          justifyContent: "space-between",
          "@media (max-width: 600px)": {
            width: "100%",
            textAlign: "center",
          },
        }}
      >
        <Box
          sx={{
            width: "75%",
            "@media (max-width: 800px)": {
              width: "100%",
            },
          }}
        >
          <Title order={3}>{event.title}</Title>
          <Text sx={{ marginTop: "4px", opacity: 0.6 }}>
            {eventParser.dateString({
              startDate: event.startDate,
              endDate: event.endDate,
            })}
          </Text>
        </Box>

        {session?.user && (session.user as UserSession).isAdmin && (
          <Group>
            <Link href={paths.events.edit(event.id)} passHref>
              <Button
                component="a"
                variant="outline"
                size="xs"
                leftIcon={<BsFillPencilFill />}
              >
                Редактировать
              </Button>
            </Link>

            <Button
              size="xs"
              variant="outline"
              color="red"
              onClick={openDeleteModal}
            >
              Удалить
            </Button>
          </Group>
        )}
      </Group>

      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "300px auto",
          gridGap: "24px",
          marginTop: "20px",
          "@media (max-width: 800px)": {
            display: "initial",
          },
        }}
      >
        <Paper
          padding="xl"
          shadow="xs"
          sx={{
            "@media (max-width: 800px)": {
              marginTop: "24px",
            },
          }}
        >
          <Group direction="column">
            <div style={{ display: "flex", width: "fit-content" }}>
              <div style={{ width: "14px" }}>
                <BsFillGeoAltFill
                  color="#228BE6"
                  style={{ marginTop: "4px" }}
                />
              </div>

              <Box sx={{ marginLeft: "12px" }}>
                <Text>{event.location?.city}</Text>
                <Text sx={{ opacity: 0.6 }} weight="500">
                  {event.location?.name}
                </Text>
                <Text size="sm" sx={{ opacity: 0.6 }}>
                  {event.location?.address}
                </Text>
              </Box>
            </div>

            {event.registrationOpened && (
              <Link href={paths.events.register} passHref>
                <Button component="a" variant="outline" sx={{ width: "100%" }}>
                  К регистрации
                </Button>
              </Link>
            )}
          </Group>

          {event.location?.phone && (
            <div style={{ display: "flex", marginTop: "12px" }}>
              <div style={{ width: "14px" }}>
                <BsFillTelephoneFill
                  color="#228BE6"
                  style={{ marginTop: "4px" }}
                />
              </div>

              <Text size="sm" sx={{ marginLeft: "12px" }}>
                {event.location?.phone}
              </Text>
            </div>
          )}

          {event.location?.web && (
            <div style={{ display: "flex", marginTop: "12px" }}>
              <div style={{ width: "14px" }}>
                <BsGlobe color="#228BE6" style={{ marginTop: "4px" }} />
              </div>

              <Anchor size="sm" target="_blank" sx={{ marginLeft: "12px" }}>
                {event.location?.web}
              </Anchor>
            </div>
          )}
        </Paper>

        <Paper
          padding="xl"
          shadow="xs"
          sx={{
            "@media (max-width: 800px)": {
              marginTop: "24px",
            },
          }}
        >
          <RacesTable races={event.races} />
        </Paper>

        <Paper
          padding="xl"
          shadow="xs"
          sx={{
            "@media (max-width: 800px)": {
              marginTop: "24px",
            },
          }}
        >
          <div style={{ display: "flex", marginBottom: "12px" }}>
            <div style={{ width: "14px" }}>
              <BsFillPeopleFill color="#228BE6" style={{ marginTop: "4px" }} />
            </div>

            <Text sx={{ marginLeft: "12px" }}>Организаторы</Text>
          </div>

          {event.organizers.map((org) => (
            <Text key={org.id} size="sm" sx={{ opacity: 0.8 }}>
              {org.name}
            </Text>
          ))}

          {event.organizers.length === 0 && (
            <Text size="sm" sx={{ opacity: 0.6 }}>
              Нет информации
            </Text>
          )}
        </Paper>

        <Paper
          padding="xl"
          shadow="xs"
          sx={{
            minWidth: "50%",
            "@media (max-width: 800px)": {
              marginTop: "24px",
            },
          }}
        >
          {event.description ? (
            <Text
              sx={{
                "& a": { textDecoration: "none", color: "#228BE6" },
                "& a:hover": { opacity: 0.8 },
              }}
            >
              {parse(event.description)}
            </Text>
          ) : (
            <Text size="sm" sx={{ opacity: 0.6 }}>
              Нет информации
            </Text>
          )}
        </Paper>
      </Box>

      <div style={{ margin: "24px 0 32px" }}>
        <Files files={event.files} />
      </div>

      {session?.user && (
        <Modal
          opened={deleteModalOpened}
          onClose={closeDeleteModal}
          hideCloseButton
        >
          <Text>
            <b>Внимание!</b> Событие будет удалено без возможности
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
    </div>
  );
};

export default EventPage;
