export const enum SourceLanguage {
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

// TODO: remove "proto-filters"
export const VIEWS = [
  "graph",
  "numbers",
  "proto-filters",
  "table",
  "text",
] as const;

export const SETTING_SIDEBAR_PATHS_REGEX =
  /\/db\/.*?\/(table|numbers|proto-filters|graph|text)/;
