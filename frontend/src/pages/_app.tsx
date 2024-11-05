import "globalStyles.css";

import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "next-i18next.config";
import { DefaultSeo } from "next-seo";
import SEO from "next-seo.config";
import { AppTopBar } from "@components/layout/AppTopBar";
import CssBaseline from "@mui/material/CssBaseline";
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryCacheTimeDefaults } from "@utils/api/apiQueryUtils";
import { ThemeProvider } from "@utils/ThemeProvider";
import { NuqsAdapter } from "nuqs/adapters/react";

function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, ...queryCacheTimeDefaults },
        },
      }),
  );

  return (
    <AppCacheProvider {...props}>
      <NuqsAdapter>
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
              <CssBaseline />
              <AppTopBar />
              <Component {...pageProps} />
            </ThemeProvider>
          </HydrationBoundary>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </NuqsAdapter>
    </AppCacheProvider>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
