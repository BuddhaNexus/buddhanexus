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
export const ALL_LOCALES = ["en", "de"];

export const ROUTE_PATTERNS = {
  home: "^/$",
  atii: "^/atii",
  search: "^/search",
  table: "^/db/([^/]+?/){2}table",
};
