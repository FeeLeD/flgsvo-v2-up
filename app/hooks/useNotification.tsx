import { useState } from "react";
import { Notification, Portal, Transition } from "@mantine/core";
import { NotificationProps } from "@mantine/notifications";

const defaultProps: NotificationProps = {
  message: "",
};

// TODO: update
export function useNotification(notificationProps?: NotificationProps) {
  const [props, setProps] = useState<NotificationProps>(
    notificationProps ?? defaultProps
  );
  const [isOpened, setOpened] = useState(false);
  const openNotification = (newProps?: NotificationProps) => {
    setProps(newProps ?? defaultProps);
    setOpened(true);
    setTimeout(() => {
      setOpened(false);
    }, 4000);
  };
  const closeNotification = () => setOpened(false);

  const Component = (
    <Portal zIndex={5}>
      <Transition
        mounted={isOpened}
        transition="fade"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Notification
            {...props}
            style={styles}
            sx={{
              position: "fixed",
              width: "400px",
              bottom: "24px",
              right: "24px",
            }}
            onClose={closeNotification}
          >
            {props.message}
          </Notification>
        )}
      </Transition>
    </Portal>
  );

  return {
    render: Component,
    open: openNotification,
    close: closeNotification,
  };
}
