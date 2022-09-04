import React from "react";
import type { DocumentContext } from "next/document";
import Document, { Head, Html, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "utils/createEmotionCache";

import i18nextConfig from "../next-i18next.config";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;

    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) =>
          function EnhanceApp(props) {
            // @ts-expect-error https://github.com/mui/material-ui/blob/master/examples/nextjs-with-typescript/pages/_document.tsx#L65
            return <App emotionCache={cache} {...props} />;
          },
      });

    const initialProps = await Document.getInitialProps(ctx);
    // This is important. It prevents Emotion to render invalid HTML.
    // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        key={style.key}
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      emotionStyleTags,
    };
  }

  render(): JSX.Element {
    const currentLocale =
      this.props.__NEXT_DATA__.locale ?? i18nextConfig.i18n.defaultLocale;

    return (
      <Html lang={currentLocale}>
        <Head nonce={process.env.nonce}>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />

          <script
            nonce={process.env.nonce}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `window.__webpack_nonce__ = '${process.env.nonce}'`,
            }}
          />
          <meta property="csp-nonce" content={process.env.nonce} />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#361f0d" />
          <meta name="msapplication-TileColor" content="#361f0d" />
          <meta name="theme-color" content="#361f0d" />

          <link
            href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro&?family=Source+Sans+Pro&display=optional"
            rel="stylesheet"
          />

          <meta name="theme-color" content="#361F0D" />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: light)"
            content="#FFBC73"
          />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: dark)"
            content="#361F0D"
          />
          <meta name="emotion-insertion-point" content="" />
          {(this.props as any).emotionStyleTags}
        </Head>

        <body>
          <Main />
          <NextScript nonce={process.env.nonce} />
        </body>
      </Html>
    );
  }
}
