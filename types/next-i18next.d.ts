// import the original type declarations
import "react-i18next";

// import all namespaces (for the default language, only)
import type en from "@public/locales/en/common.json";
import type dbEn from "@public/locales/en/dbPli.json";

declare module "react-i18next" {
  // and extend them!
  interface CustomTypeOptions {
    // custom resources type
    resources: {
      common: typeof en;
      dbPli: typeof dbEn;
    };
  }
}
