import { AppProps } from "next/app";
import Head from "next/head";
import { NotificationsProvider } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { Provider } from "next-auth/client";
import Layout from "components/Layout";
import GlobalStyles from "components/GlobalStyles";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <Provider session={pageProps.session}>
      <Head>
        <title>Федерация лыжных гонок Свердловской области</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <MantineProvider withNormalizeCSS>
        <GlobalStyles />
        <NotificationsProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NotificationsProvider>
      </MantineProvider>
    </Provider>
  );
}
