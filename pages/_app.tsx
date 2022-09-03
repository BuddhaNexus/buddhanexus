import "../globalStyles.css";

import React, { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Image from "next/image";
import { appWithTranslation } from "next-i18next";
import { AppTopBar } from "@components/AppTopBar";
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
import Typography from "@mui/material/Typography";
import type { MDXComponents } from "mdx/types";
import createPersistedState from "use-persisted-state";
import { ColorModeContext } from "utils/colorModeContext";
import createEmotionCache from "utils/createEmotionCache";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const useSelectedColorModeState = createPersistedState("selectedColorMode");

const ResponsiveImage = ({ alt, ...props }: any) => (
  <Image alt={alt} layout="responsive" width="100%" {...props} />
);

const components: MDXComponents = {
  img: ResponsiveImage,
  h1: ({ children }) => (
    <Typography variant="h2" component="h1">
      {children}
    </Typography>
  ),
  h2: ({ children }) => <Typography variant="h2">{children}</Typography>,
  h3: ({ children }) => <Typography variant="h3">{children}</Typography>,
  h4: ({ children }) => <Typography variant="h4">{children}</Typography>,
  h5: ({ children }) => <Typography variant="h5">{children}</Typography>,
  h6: ({ children }) => <Typography variant="h6">{children}</Typography>,
  body: ({ children }) => <Typography variant="body1">{children}</Typography>,
  p: ({ children }) => (
    <Typography variant="body1" sx={{ my: 2 }}>
      {children}
    </Typography>
  ),
};

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

  const [isMounted, setIsMounted] = useState(false);

  useEffect(function onMount() {
    setIsMounted(true);
  }, []);

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
      <MDXProvider components={components}>
        <Head>
          <title>BuddhaNexus</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>

        <ColorModeContext.Provider value={colorMode}>
          {isMounted && (
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <>
                <AppTopBar />
                <Component {...pageProps} />
              </>
            </ThemeProvider>
          )}
        </ColorModeContext.Provider>
      </MDXProvider>
    </CacheProvider>
  );
}

export default appWithTranslation(MyApp);
