// import the original type declarations
import "i18next";

// import all namespaces (for the default language, only)
import type common from "@public/locales/en/common.json";
import type dbChn from "@public/locales/en/db/chn.json";
import type dbPli from "@public/locales/en/db/pli.json";
import type dbSkt from "@public/locales/en/db/skt.json";
import type dbTib from "@public/locales/en/db/tib.json";
import type home from "@public/locales/en/home.json";

interface I18nNamespaces {
  common: typeof common;
  home: typeof home;
  dbChn: typeof dbChn;
  dbPli: typeof dbPli;
  dbSkt: typeof dbSkt;
  dbTib: typeof dbTib;
}

declare module "i18next" {
  interface CustomTypeOptions {
    resources: I18nNamespaces;
  }
}

export type SupportedLocale = "de" | "en";
