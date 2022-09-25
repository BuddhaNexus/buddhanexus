import "../globalStyles.css";

import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { appWithTranslation, i18n } from "next-i18next";
import { ThemeProvider } from "next-themes";
import { AppMDXComponents } from "@components/AppMDXComponents";
import { AppTopBar } from "@components/AppTopBar";
import type { EmotionCache } from "@emotion/react";
import { CacheProvider } from "@emotion/react";
import { MDXProvider } from "@mdx-js/react";
import CssBaseline from "@mui/material/CssBaseline";
import createEmotionCache from "utils/createEmotionCache";

import { MUIThemeProvider } from "../utils/MUIThemeProvider";

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
}

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <MDXProvider components={AppMDXComponents}>
        <Head>
          <title>BuddhaNexus</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>

        <ThemeProvider>
          <MUIThemeProvider>
            <CssBaseline />
            <AppTopBar />
            <Component {...pageProps} />
          </MUIThemeProvider>
        </ThemeProvider>
      </MDXProvider>
    </CacheProvider>
  );
}

export default appWithTranslation(MyApp);
