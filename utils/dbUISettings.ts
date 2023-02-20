import type { DbView } from "@components/db/DbViewSelector";
import {
  ArrayParam,
  NumberParam,
  StringParam,
  withDefault,
} from "use-query-params";

const dbLangs = ["pli", "chn", "tib", "skt"] as const;

const filterList = [
  "co_occ",
  "limit_collection",
  "par_length",
  "score",
  "target_collection",
] as const;

const queriedDisplayOptionList = [
  "folio",
  "multi_lingual",
  "sort_method",
] as const;

const localDisplayOptionList = ["script", "showAndPositionSegmentNrs"] as const;

const utilityOptionList = [
  "download",
  "copyQueryTitle",
  "copyQueryLink",
  "emailQueryLink",
  "resourceLinks",
] as const;

export type Filter = (typeof filterList)[number];
export type QueriedDisplayOption = (typeof queriedDisplayOptionList)[number];
export type LocalDisplayOption = (typeof localDisplayOptionList)[number];
export type DisplayOption = LocalDisplayOption | QueriedDisplayOption;
export type LocalUtilityOption = (typeof utilityOptionList)[number];

interface SettingContext {
  langs: (typeof dbLangs)[number][];
  views: DbView[];
}

export const FILTERS: Record<Filter, SettingContext> = {
  co_occ: {
    // TODO: remove on API update,
    langs: ["pli", "chn", "tib", "skt"],
    views: ["graph", "numbers", "table", "text"],
  },
  limit_collection: {
    langs: ["pli", "chn", "tib", "skt"],
    views: ["numbers", "table", "text"],
  },
  par_length: {
    langs: ["pli", "chn", "tib", "skt"],
    views: ["graph", "numbers", "table", "text"],
  },
  score: {
    // TODO: confirm if to be removed,
    langs: ["pli", "chn", "tib", "skt"],
    views: ["graph", "numbers", "table", "text"],
  },
  target_collection: {
    langs: ["pli", "chn", "tib", "skt"],
    views: ["graph"],
  },
};

const QUERIED_DISPLAY_OPTIONS: Record<QueriedDisplayOption, SettingContext> = {
  folio: {
    // "folio" is used as "jump to" in text view and "only show" in other applicable views
    langs: ["pli", "chn", "tib", "skt"],
    views: ["numbers", "table", "text"],
  },
  multi_lingual: {
    langs: ["pli", "chn", "tib", "skt"],
    views: ["text"],
  },
  sort_method: {
    langs: ["pli", "chn", "tib", "skt"],
    views: ["table"],
  },
};

const LOCAL_DISPLAY_OPTIONS: Record<LocalDisplayOption, SettingContext> = {
  script: {
    langs: ["tib"],
    views: ["table", "text"],
  },
  showAndPositionSegmentNrs: {
    langs: ["pli", "chn", "tib", "skt"],
    views: ["text"],
  },
};

export const DISPLAY_OPTIONS: Record<
  LocalDisplayOption | QueriedDisplayOption,
  SettingContext
> = {
  ...QUERIED_DISPLAY_OPTIONS,
  ...LOCAL_DISPLAY_OPTIONS,
};

export const UTILITY_OPTIONS: Record<LocalUtilityOption, SettingContext> = {
  download: {
    langs: ["pli", "chn", "tib", "skt"],
    views: ["numbers", "table"],
  },
  copyQueryTitle: {
    langs: ["pli", "chn", "tib", "skt"],
    views: ["graph", "numbers", "table", "text"],
  },
  copyQueryLink: {
    langs: ["pli", "chn", "tib", "skt"],
    views: ["graph", "numbers", "table", "text"],
  },
  emailQueryLink: {
    langs: ["pli", "chn", "tib", "skt"],
    views: ["graph", "numbers", "table", "text"],
  },
  resourceLinks: {
    langs: ["pli", "chn", "tib", "skt"],
    views: ["graph", "numbers", "table", "text"],
  },
};

// TODO: confirm default values
export const queryConfig = {
  co_occ: withDefault(NumberParam, 30),
  score: withDefault(NumberParam, 30),
  par_length: withDefault(NumberParam, 30),
  limit_collection: withDefault(ArrayParam, undefined),
  target_collection: withDefault(StringParam, undefined),
  folio: withDefault(StringParam, undefined),
  sort_method: withDefault(StringParam, undefined),
};

export const queryDefaults = {
  co_occ: 30,
  score: 30,
  par_length: 30,
  limit_collection: undefined,
  target_collection: undefined,
  folio: undefined,
  sort_method: undefined,
};
