// import the original type declarations
import "i18next";

// import all namespaces (for the default language, only)
import type common from "@public/locales/en/common.json";
import type db from "@public/locales/en/db.json";
import type home from "@public/locales/en/home.json";

interface I18nNamespaces {
  common: typeof common;
  home: typeof home;
  db: typeof db;
}

declare module "i18next" {
  interface CustomTypeOptions {
    resources: I18nNamespaces;
  }
}

export type SupportedLocale = "de" | "en";
