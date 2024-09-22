import { SupportedLocales } from "src/types/i18next";

export enum SourceLanguage {
  PALI = "pli",
  CHINESE = "chn",
  TIBETAN = "tib",
  SANSKRIT = "skt",
}

export const SOURCE_LANGUAGES = [
  SourceLanguage.SANSKRIT,
  SourceLanguage.TIBETAN,
  SourceLanguage.PALI,
  SourceLanguage.CHINESE,
];

// i18n
export const SUPPORTED_LOCALES: SupportedLocales = {
  en: "English",
  de: "Deutsch",
};

export enum DbViewEnum {
  GRAPH = "graph",
  NUMBERS = "numbers",
  TABLE = "table",
  TEXT = "text",
}
export const DEFAULT_DB_VIEW = DbViewEnum.TEXT;
