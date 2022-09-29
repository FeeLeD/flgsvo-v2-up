import React, { FC, useRef } from "react";

const SignUpPage: FC = () => {
  const firstName = useRef<HTMLInputElement>(null);
  const lastName = useRef<HTMLInputElement>(null);
  const otherName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.current?.value,
          lastName: lastName.current?.value,
          otherName: otherName.current?.value ?? "",
          email: email.current?.value,
          password: password.current?.value,
        }),
      });

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input ref={firstName} placeholder="Имя" required />
        <input ref={lastName} placeholder="Фамилия" required />
        <input ref={otherName} placeholder="Отчество" />
        <input ref={email} type="email" placeholder="E-mail" required />
        <input ref={password} type="password" placeholder="Пароль" required />

        <button type="submit">Регистрация</button>
      </form>
    </div>
  );
};

export default SignUpPage;
