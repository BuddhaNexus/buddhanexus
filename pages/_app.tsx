import "globalStyles.css";

import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { appWithTranslation } from "next-i18next";
import i18nextConfig from "next-i18next.config";
import { NextAdapter } from "next-query-params";
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
import queryString from "query-string";
import { QueryParamProvider } from "use-query-params";
import { queryCacheTimeDefaults } from "utils/api/apiQueryUtils";
import { ThemeProvider } from "utils/ThemeProvider";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, ...queryCacheTimeDefaults },
        },
      }),
  );

  return (
    <AppCacheProvider>
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
              <CssBaseline />
              <AppTopBar />
              <Component {...pageProps} />
            </ThemeProvider>
          </HydrationBoundary>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </QueryParamProvider>
    </AppCacheProvider>
  );
}

export default appWithTranslation(MyApp, i18nextConfig);
