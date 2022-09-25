import "../globalStyles.css";

import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import withDarkMode from "next-dark-mode";
import { appWithTranslation, i18n } from "next-i18next";
import { AppMDXComponents } from "@components/AppMDXComponents";
import { AppTopBar } from "@components/AppTopBar";
import { getDesignTokens } from "@components/theme";
import type { EmotionCache } from "@emotion/react";
import { CacheProvider } from "@emotion/react";
import { MDXProvider } from "@mdx-js/react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import createEmotionCache from "utils/createEmotionCache";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

if (process.env.NODE_ENV !== "production") {
  if (typeof window === "undefined") {
    const { applyServerHMR } = await import("i18next-hmr/server");
    applyServerHMR(() => i18n);
  } else {
    const { applyClientHMR } = await import("i18next-hmr/client");
    applyClientHMR(() => i18n);
  }
}

interface MyAppProps extends AppProps {
  emotionCache: EmotionCache;
  darkMode: { darkModeActive: boolean };
}

function MyApp({
  Component,
  pageProps,
  darkMode,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  const { darkModeActive } = darkMode;

  const theme = responsiveFontSizes(
    createTheme(getDesignTokens(darkModeActive ? "dark" : "light"))
  );

  return (
    <CacheProvider value={emotionCache}>
      <MDXProvider components={AppMDXComponents}>
        <Head>
          <title>BuddhaNexus</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>

        <ThemeProvider theme={{ darkMode: darkModeActive, ...theme }}>
          <CssBaseline />
          <AppTopBar />
          <Component {...pageProps} />
        </ThemeProvider>
      </MDXProvider>
    </CacheProvider>
  );
}

export default withDarkMode(appWithTranslation(MyApp));
