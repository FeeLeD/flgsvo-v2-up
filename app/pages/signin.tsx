import React, { FC, useRef } from "react";
import { signIn } from "next-auth/client";
import { Button, Paper, PasswordInput, TextInput, Title } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";

const SignIn: FC = () => {
  const { showNotification } = useNotifications();
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.current?.value || !password.current?.value) {
      showNotification({
        color: "yellow",
        message: "Заполните все поля",
      });

      return;
    }

    try {
      await signIn("credentials", {
        email: email.current?.value,
        password: password.current?.value,
        callbackUrl: `${process.env.NEXTAUTH_URL}/`,
      });
    } catch (err) {
      showNotification({
        color: "red",
        message: "Что-то пошло не так. Попробуйте ещё раз",
      });
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Paper
        padding="xl"
        shadow="xs"
        sx={{ width: "340px", borderRadius: "16px" }}
      >
        <Title order={3}>Авторизация</Title>

        <form onSubmit={onSubmit} style={{ marginTop: "24px" }}>
          <TextInput ref={email} placeholder="Введитие e-mail" label="E-mail" />

          <PasswordInput
            ref={password}
            placeholder="Введитие пароль"
            label="Пароль"
            sx={{ marginTop: "12px" }}
          />

          <Button
            type="submit"
            sx={{ width: "120px", marginTop: "32px", float: "right" }}
          >
            Войти
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default SignIn;
