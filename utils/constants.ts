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

export const VIEWS = ["graph", "numbers", "table", "text"] as const;

// TODO: FIND MORE ROBUST SOLUTION
export const SETTING_SIDEBAR_PATHS_REGEX =
  /\/db\/.*?\/(table|numbers|graph|text)/;
