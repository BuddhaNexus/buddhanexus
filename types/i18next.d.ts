// import the original type declarations
import "i18next";

// import all namespaces (for the default language, only)
import type common from "@public/locales/en/common.json";
import type home from "@public/locales/en/home.json";
import type settings from "@public/locales/en/settings.json";

interface I18nNamespaces {
  common: typeof common;
  home: typeof home;
  settings: typeof settings;
}

declare module "i18next" {
  interface CustomTypeOptions {
    resources: I18nNamespaces;
  }
}

export type SupportedLocale = "de" | "en";

export type SupportedLocales = {
  [key in SupportedLocale]: string;
};
