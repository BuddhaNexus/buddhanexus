import "globalStyles.css";

import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { appWithTranslation, i18n } from "next-i18next";
import { DefaultSeo } from "next-seo";
import SEO from "next-seo.config";
import { ThemeProvider } from "next-themes";
import { AppMDXComponents } from "@components/layout/AppMDXComponents";
import type { EmotionCache } from "@emotion/react";
import { CacheProvider } from "@emotion/react";
import { MDXProvider } from "@mdx-js/react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
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
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <CacheProvider value={emotionCache}>
      <MDXProvider components={AppMDXComponents}>
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
                <Component {...pageProps} />
              </MUIThemeProvider>
            </ThemeProvider>
          </Hydrate>
        </QueryClientProvider>
      </MDXProvider>
    </CacheProvider>
  );
}

export default appWithTranslation(MyApp);
