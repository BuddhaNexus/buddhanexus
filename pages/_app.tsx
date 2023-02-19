// eslint-disable-next-line @typescript-eslint/no-import-type-side-effects
import "globalStyles.css";

import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { appWithTranslation, i18n } from "next-i18next";
import { NextAdapter } from "next-query-params";
import { DefaultSeo } from "next-seo";
import SEO from "next-seo.config";
import { ThemeProvider } from "next-themes";
import { AppMDXComponents } from "@components/layout/AppMDXComponents";
import { AppTopBar } from "@components/layout/AppTopBar";
import { CacheProvider, type EmotionCache } from "@emotion/react";
import { MDXProvider } from "@mdx-js/react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppBar } from "features/sidebar/MuiStyledSidebarComponents";
import { sidebarIsOpenAtom } from "features/sidebar/Sidebar";
import { useAtomValue } from "jotai";
import { QueryParamProvider } from "use-query-params";
import { SETTING_SIDEBAR_PATHS_REGEX } from "utils/constants";
import createEmotionCache from "utils/createEmotionCache";
import { MUIThemeProvider } from "utils/MUIThemeProvider";

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
  const { pathname } = useRouter();
  const [queryClient] = React.useState(() => new QueryClient());
  const sidebarIsOpen = useAtomValue(sidebarIsOpenAtom);

  return (
    <CacheProvider value={emotionCache}>
      <MDXProvider components={AppMDXComponents}>
        <QueryParamProvider adapter={NextAdapter}>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
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
                  {/* 😭 This is a hack, there must be a better way */}
                  {SETTING_SIDEBAR_PATHS_REGEX.test(pathname) ? (
                    <AppBar position="fixed" open={sidebarIsOpen}>
                      <AppTopBar />
                    </AppBar>
                  ) : (
                    <AppTopBar />
                  )}
                  <Component {...pageProps} />
                </MUIThemeProvider>
              </ThemeProvider>
            </Hydrate>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </QueryParamProvider>
      </MDXProvider>
    </CacheProvider>
  );
}

export default appWithTranslation(MyApp);
