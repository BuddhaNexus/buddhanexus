import "globalStyles.css";

import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { appWithTranslation } from "next-i18next";
import i18nextConfig from "next-i18next.config";
import { NextAdapter } from "next-query-params";
import { DefaultSeo } from "next-seo";
import SEO from "next-seo.config";
import { ThemeProvider } from "next-themes";
import { AppTopBar } from "@components/layout/AppTopBar";
import type { EmotionCache } from "@emotion/react";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryString from "query-string";
import { QueryParamProvider } from "use-query-params";
import { queryCacheTimeDefaults } from "utils/api/apiQueryUtils";
import createEmotionCache from "utils/createEmotionCache";
import { MUIThemeProvider } from "utils/MUIThemeProvider";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache: EmotionCache;
}

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, ...queryCacheTimeDefaults },
        },
      }),
  );

  return (
    <CacheProvider value={emotionCache}>
      <QueryParamProvider
        adapter={NextAdapter}
        options={{
          searchStringToObject: queryString.parse,
          objectToSearchString: queryString.stringify,
          updateType: "replaceIn",
          enableBatching: true,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={pageProps.dehydratedState}>
            <DefaultSeo {...SEO} />
            <Head>
              <meta
                name="viewport"
                content="initial-scale=1, width=device-width"
              />
            </Head>

            <ThemeProvider>
              <MUIThemeProvider>
                <CssBaseline />
                <AppTopBar />
                <Component {...pageProps} />
              </MUIThemeProvider>
            </ThemeProvider>
          </HydrationBoundary>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </QueryParamProvider>
    </CacheProvider>
  );
}

export default appWithTranslation(MyApp, i18nextConfig);
