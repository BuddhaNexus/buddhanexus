import type { DbView } from "features/sidebar/settingComponents/DbViewSelector";

const dbLangs = ["pli", "chn", "tib", "skt"] as const;
export type DbLang = (typeof dbLangs)[number];

export const filterList = [
  // TODO: update include/exclude list when added to db
  "limit_collection",
  "par_length",
  "score",
  "target_collection",
] as const;

export const queriedDisplayOptionList = [
  "folio",
  "multi_lingual",
  "sort_method",
] as const;

export const localDisplayOptionList = [
  "script",
  "showAndPositionSegmentNrs",
] as const;

export const utilityOptionList = [
  "download",
  "copyQueryTitle",
  "copyQueryLink",
  "emailQueryLink",
] as const;

export const resourceLinksOptionKey = "resourceLinks";

export type Filter = (typeof filterList)[number];
export type QueriedDisplayOption = (typeof queriedDisplayOptionList)[number];
export type LocalDisplayOption = (typeof localDisplayOptionList)[number];
export type DisplayOption = LocalDisplayOption | QueriedDisplayOption;
export type UtilityOption = (typeof utilityOptionList)[number];

export type ViewOmission = (DbLang | "allLangs")[];
export type SettingContext = Partial<Record<DbView, ViewOmission>>;

export type FilterOmissions = Partial<Record<Filter, SettingContext>>;
export const FILTER_CONTEXT_OMISSIONS: FilterOmissions = {
  limit_collection: { graph: ["allLangs"] },
  target_collection: {
    numbers: ["allLangs"],
    table: ["allLangs"],
    text: ["allLangs"],
  },
};

const QUERIED_DISPLAY_OPTIONS_CONTEXT_OMISSIONS: Partial<
  Record<QueriedDisplayOption, SettingContext>
> = {
  folio: {
    // "folio" is used as "jump to" in text view and "only show" in other applicable views
    graph: ["allLangs"],
  },
  multi_lingual: {
    graph: ["allLangs"],
    numbers: ["allLangs"],
    table: ["allLangs"],
  },
  sort_method: {
    graph: ["allLangs"],
    numbers: ["allLangs"],
    text: ["allLangs"],
  },
};

const LOCAL_DISPLAY_OPTIONS_CONTEXT_OMISSIONS: Partial<
  Record<LocalDisplayOption, SettingContext>
> = {
  script: {
    graph: ["allLangs"],
    numbers: ["allLangs"],
    table: ["pli", "chn", "skt"],
    text: ["pli", "chn", "skt"],
  },
  showAndPositionSegmentNrs: {
    graph: ["allLangs"],
    numbers: ["allLangs"],
    table: ["allLangs"],
  },
};

export type DisplayOmissions = Partial<
  Record<LocalDisplayOption | QueriedDisplayOption, SettingContext>
>;
export const DISPLAY_OPTIONS_CONTEXT_OMISSIONS: DisplayOmissions = {
  ...QUERIED_DISPLAY_OPTIONS_CONTEXT_OMISSIONS,
  ...LOCAL_DISPLAY_OPTIONS_CONTEXT_OMISSIONS,
};

export type UtilityOmissions = Partial<Record<UtilityOption, SettingContext>>;
export const UTILITY_OPTIONS_CONTEXT_OMISSIONS: UtilityOmissions = {
  download: {
    graph: ["allLangs"],
    text: ["allLangs"],
  },
};

export interface QueryParams {
  score: number;
  par_length: number;
  folio?: string;
  sort_method?: "length2" | "position" | "quoted-text";
  // TODO: update on backend refactor. For dev purposes "limit_collection" is being treated as the comming endpoints
  limit_collection?: string[];
  include_collection?: string[];
  exclude_collection?: string[];
  include_text?: string[];
  exclude_text?: string[];
  target_collection?: string[];
}

export const DEFAULT_QUERY_PARAMS: QueryParams = {
  score: 30,
  // par_length is given a dummy value of 25 (lowest value applicable to all languages). The true value is initated in useDbQueryParams hook when src lang value is available.
  par_length: 25,
  folio: undefined,
  sort_method: undefined,
  limit_collection: undefined,
  include_collection: undefined,
  exclude_collection: undefined,
  include_text: undefined,
  exclude_text: undefined,
  target_collection: undefined,
};

export const MIN_PAR_LENGTH_VALUES: Record<DbLang, number> = {
  chn: 5,
  pli: 25,
  skt: 25,
  tib: 7,
};
export const DEFAULT_PAR_LENGTH_VALUES: Record<DbLang, number> = {
  chn: 7,
  pli: 30,
  skt: 30,
  tib: 14,
};
