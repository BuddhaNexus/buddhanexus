// import the original type declarations
import "react-i18next";

// import all namespaces (for the default language, only)
import type common from "@public/locales/en/common.json";
import type dbChn from "@public/locales/en/db/chn.json";
import type dbPli from "@public/locales/en/db/pli.json";
import type dbSkt from "@public/locales/en/db/skt.json";
import type dbTib from "@public/locales/en/db/tib.json";
import type home from "@public/locales/en/home.json";

declare module "react-i18next" {
  // and extend them!
  interface CustomTypeOptions {
    // custom resources type
    resources: {
      common: typeof common;
      home: typeof home;
      dbChn: typeof dbChn;
      dbPli: typeof dbPli;
      dbSkt: typeof dbSkt;
      dbTib: typeof dbTib;
    };
  }
}

export type SupportedLocale = "de" | "en";
