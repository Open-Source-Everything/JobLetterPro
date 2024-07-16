import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import "@mantine/core/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <MantineProvider>
      <SessionProvider session={session}>
        <Head>
          <title></title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
          />
          <link rel="shortcut icon" href="/favicon.svg" />
        </Head>
        <div className={GeistSans.className}>
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
