import "../globalStyles.css";

import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Image from "next/image";
import { appWithTranslation } from "next-i18next";
import { AppTopBar } from "@components/AppTopBar";
import { theme } from "@components/theme";
import type { EmotionCache } from "@emotion/react";
import { CacheProvider } from "@emotion/react";
import { MDXProvider } from "@mdx-js/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { MDXComponents } from "mdx/types";
import createEmotionCache from "utils/createEmotionCache";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

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
  return (
    <CacheProvider value={emotionCache ?? clientSideEmotionCache}>
      <MDXProvider components={components}>
        <Head>
          <title>BN Next</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>

        <ThemeProvider theme={theme}>
          <CssBaseline />

          <AppTopBar />

          <Component {...pageProps} />
        </ThemeProvider>
      </MDXProvider>
    </CacheProvider>
  );
}

export default appWithTranslation(MyApp);
