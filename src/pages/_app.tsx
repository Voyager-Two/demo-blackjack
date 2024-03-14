import "@app/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { AppProps } from "next/app";
import React from "react";
import { Provider as ReduxProvider } from 'react-redux';
import store from '@app/state/store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <ReduxProvider store={store}>
          <Component {...pageProps} />
        </ReduxProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
