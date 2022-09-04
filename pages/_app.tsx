import "../globalStyles.css";

import React, { useEffect, useRef } from "react";
import { Cookies, CookiesProvider, useCookies } from "react-cookie";
import type { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { appWithTranslation, i18n } from "next-i18next";
import { AppTopBar } from "@components/AppTopBar";
import { MUIComponents } from "@components/MUIComponents";
import { getDesignTokens } from "@components/theme";
import type { EmotionCache } from "@emotion/react";
import { CacheProvider } from "@emotion/react";
import { MDXProvider } from "@mdx-js/react";
import type { PaletteMode } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import { ColorModeContext } from "utils/colorModeContext";
import { parseCookies } from "utils/cookies";
import createEmotionCache from "utils/createEmotionCache";
import { addDays } from "utils/dates";

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
  themeSetting: PaletteMode;
}

function MyApp({
  Component,
  pageProps,
  emotionCache,
  themeSetting,
}: MyAppProps) {
  const [mode, setMode] = React.useState<PaletteMode>(themeSetting || "light");

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    []
  );
  const [cookies, setCookie] = useCookies(["cookieColorMode"]);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    if (prefersDarkMode && !cookies.cookieColorMode) {
      setMode("dark");
    }
  }, [prefersDarkMode, cookies.cookieColorMode]);

  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    const date = new Date();
    const expires = addDays(date, 365);
    setCookie("cookieColorMode", mode, { path: "/", expires, secure: true });
  }, [mode, setCookie]);

  const theme = React.useMemo(() => {
    return responsiveFontSizes(createTheme(getDesignTokens(mode)));
  }, [mode]);

  return (
    <CacheProvider value={emotionCache ?? clientSideEmotionCache}>
      <MDXProvider components={MUIComponents}>
        <Head>
          <title>BuddhaNexus</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>

        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <CookiesProvider
              cookies={isBrowser ? undefined : new Cookies(cookies)}
            >
              <AppTopBar />
              <Component {...pageProps} />
            </CookiesProvider>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </MDXProvider>
    </CacheProvider>
  );
}

MyApp.getInitialProps = ({ ctx }: AppContext) => {
  let themeSetting;
  if (ctx.req?.headers.cookie) {
    themeSetting = parseCookies(ctx).cookieColorMode;
  }
  return {
    themeSetting,
  };
};

export default appWithTranslation(MyApp);
