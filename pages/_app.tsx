import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { AppTopBar } from "@components/AppTopBar";
import { theme } from "@components/theme";
import type { EmotionCache } from "@emotion/react";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import createEmotionCache from "utils/createEmotionCache";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache: EmotionCache;
}

function MyApp({ Component, pageProps, emotionCache }: MyAppProps) {
  return (
    <CacheProvider value={emotionCache ?? clientSideEmotionCache}>
      <Head>
        <title>BN Next</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <AppTopBar />

        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
