// import the original type declarations
import "i18next";

// import all namespaces (for the default language, only)
import type common from "@public/locales/en/common.json";
import type dbChnEn from "@public/locales/en/dbChn.json";
import type dbPliEn from "@public/locales/en/dbPli.json";
import type dbSktEn from "@public/locales/en/dbSkt.json";
import type dbTibEn from "@public/locales/en/dbTib.json";

interface I18nNamespaces {
  common: typeof common;
  dbChn: typeof dbChnEn;
  dbPli: typeof dbPliEn;
  dbSkt: typeof dbSktEn;
  dbTib: typeof dbTibEn;
}

declare module "i18next" {
  interface CustomTypeOptions {
    resources: I18nNamespaces;
  }
}
