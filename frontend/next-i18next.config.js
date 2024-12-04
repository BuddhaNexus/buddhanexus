/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const HttpBackend = require("i18next-http-backend/cjs");
const ChainedBackend = require("i18next-chained-backend").default;
const LocalStorageBackend = require("i18next-localstorage-backend").default;

const isBrowser = typeof window !== "undefined";
const isDev = process.env.NODE_ENV === "development";

// https://github.com/i18next/next-i18next/blob/master/examples/auto-static-optimize/next-i18next.config.js

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  backend: {
    backendOptions: [
      { expirationTime: isDev ? 60 * 1000 : 60 * 60 * 1000 },
      {},
    ], // 1 hour
    backends: isBrowser ? [LocalStorageBackend, HttpBackend] : [],
  },

  debug: false,
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "bo"],
  },

  initImmediate: false,

  /** To avoid issues when deploying to some paas (vercel...) */
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/locales",

  reloadOnPrerender: isDev,

  ns: ["common", "settings", "db", "home"],
  partialBundledLanguages: isBrowser,
  use: isBrowser ? [ChainedBackend] : [],
};
