import { SupportedLocales } from "src/types/i18next";
// i18n
export const SUPPORTED_LOCALES: SupportedLocales = {
  en: "English",
  de: "Deutsch",
};

export enum DbViewEnum {
  TEXT = "text",
  TABLE = "table",
  GRAPH = "graph",
  NUMBERS = "numbers",
}
export const DEFAULT_DB_VIEW = DbViewEnum.TEXT;
