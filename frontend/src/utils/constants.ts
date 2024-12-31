import { SupportedLocales } from "src/types/i18next";

export const SUPPORTED_LOCALES: SupportedLocales = {
  en: "English",
  de: "Deutsch",
  bo: "བོད་ཡིག",
};

export enum DbViewEnum {
  TEXT = "text",
  TABLE = "table",
  GRAPH = "graph",
  NUMBERS = "numbers",
}

export const DEFAULT_DB_VIEW = DbViewEnum.TEXT;

export const RESULT_PAGE_TITLE_GROUP_ID = "result-page-title-group";
