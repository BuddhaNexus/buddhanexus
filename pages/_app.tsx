import "../globalStyles.css";

import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { appWithTranslation } from "next-i18next";
import { AppTopBar } from "@components/AppTopBar";
import { MUIComponents } from "@components/MUIComponents";
import { getDesignTokens } from "@components/theme";
import type { EmotionCache } from "@emotion/react";
import { CacheProvider } from "@emotion/react";
import { MDXProvider } from "@mdx-js/react";
import { useMediaQuery } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import createPersistedState from "use-persisted-state";
import { ColorModeContext } from "utils/colorModeContext";
import createEmotionCache from "utils/createEmotionCache";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const useSelectedColorModeState = createPersistedState<"dark" | "light">(
  "selectedColorMode"
);

interface MyAppProps extends AppProps {
  emotionCache: EmotionCache;
}

function MyApp({ Component, pageProps, emotionCache }: MyAppProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [manuallySelectedColorMode, setManuallySelectedColorMode] =
    useSelectedColorModeState(prefersDarkMode ? "dark" : "light");

  const [mode, setMode] = React.useState<"light" | "dark">(
    manuallySelectedColorMode
  );

  const colorMode = React.useMemo(() => {
    return {
      toggleColorMode: () => {
        setMode((prevMode) => {
          const colorMode = prevMode === "light" ? "dark" : "light";
          setManuallySelectedColorMode(colorMode);
          return colorMode;
        });
      },
    };
  }, [setManuallySelectedColorMode]);

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
            <>
              <AppTopBar />
              <Component {...pageProps} />
            </>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </MDXProvider>
    </CacheProvider>
  );
}

export default appWithTranslation(MyApp);
