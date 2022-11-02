// import the original type declarations
import "react-i18next";

// import all namespaces (for the default language, only)
import type en from "@public/locales/en/common.json";
import type dbChnEn from "@public/locales/en/dbChn.json";
import type dbPliEn from "@public/locales/en/dbPli.json";
import type dbSktEn from "@public/locales/en/dbSkt.json";
import type dbTibEn from "@public/locales/en/dbTib.json";

declare module "react-i18next" {
  // and extend them!
  interface CustomTypeOptions {
    // custom resources type
    resources: {
      common: typeof en;
      dbChn: typeof dbChnEn;
      dbPli: typeof dbPliEn;
      dbSkt: typeof dbSktEn;
      dbTib: typeof dbTibEn;
    };
  }
}
