import type { DbView } from "@components/db/DbViewSelector";
import {
  ArrayParam,
  NumberParam,
  StringParam,
  withDefault,
} from "use-query-params";

const dbLangs = ["pli", "chn", "tib", "skt"] as const;
type DbLang = (typeof dbLangs)[number];

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
] as const;

export const resourceLinksOptionKey = "resourceLinks";

export type Filter = (typeof filterList)[number];
export type QueriedDisplayOption = (typeof queriedDisplayOptionList)[number];
export type LocalDisplayOption = (typeof localDisplayOptionList)[number];
export type DisplayOption = LocalDisplayOption | QueriedDisplayOption;
export type UtilityOption = (typeof utilityOptionList)[number];

type ViewOmission = (DbLang | "allLangs")[];
type SettingContext = Partial<Record<DbView, ViewOmission>>;

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

export const TEMP_EXTERNAL_TEXT_LINKS: Record<DbLang, string[]> = {
  // TODO: clarify external link sources & applications
  pli: ["SC", "VRI"],
  skt: ["GRETIL", "DSBC"],
  tib: ["BDRC", "RKTS"],
  chn: ["CBETA", "SC", "CBC"],
};

type Omission = Partial<
  Record<
    Filter | LocalDisplayOption | QueriedDisplayOption | UtilityOption,
    SettingContext
  >
>;

export const isSettingOmitted = ({
  omissions,
  settingName,
  dbLang,
  view,
}: {
  omissions: Omission;
  settingName: DisplayOption | Filter | UtilityOption;
  dbLang: DbLang;
  view: DbView;
}) => {
  if (
    omissions?.[settingName]?.[view]?.some((ommittedLang) =>
      ["allLangs", dbLang].includes(ommittedLang)
    )
  ) {
    return true;
  }

  return false;
};

export function isOnlyNull(children: (React.ReactNode | null)[]) {
  return [...children].filter((item) => item !== null).length === 0;
}

// TODO: confirm default values
export const QUERY_DEFAULTS = {
  co_occ: 30,
  score: 30,
  par_length: 30,
  limit_collection: undefined,
  target_collection: undefined,
  folio: undefined,
  sort_method: undefined,
};

export const queryConfig = {
  co_occ: withDefault(NumberParam, QUERY_DEFAULTS.co_occ),
  score: withDefault(NumberParam, QUERY_DEFAULTS.score),
  par_length: withDefault(NumberParam, QUERY_DEFAULTS.par_length),
  limit_collection: withDefault(ArrayParam, QUERY_DEFAULTS.limit_collection),
  target_collection: withDefault(StringParam, QUERY_DEFAULTS.target_collection),
  folio: withDefault(StringParam, QUERY_DEFAULTS.folio),
  sort_method: withDefault(StringParam, QUERY_DEFAULTS.sort_method),
};
