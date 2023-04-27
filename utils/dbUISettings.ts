/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
import type { DbView } from "features/sidebar/settingComponents/DbViewSelector";
import { atom } from "jotai";
import type { CategoryMenuItem, TextMenuItem } from "utils/api/textLists";

const dbLangs = ["pli", "chn", "tib", "skt"] as const;
export type DbLang = (typeof dbLangs)[number];

export const filterList = [
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
  return Boolean(
    omissions?.[settingName]?.[view]?.some((omittedLang) =>
      ["allLangs", dbLang].includes(omittedLang)
    )
  );
};

export interface CoercedCollectionValues {
  excludedCategories: Map<string, CategoryMenuItem>;
  excludedTexts: Map<string, TextMenuItem>;
  includedCategories: Map<string, CategoryMenuItem>;
  includedTexts: Map<string, TextMenuItem>;
}

export interface QueryValues {
  score: number;
  par_length: number | undefined;
  folio: string | undefined;
  sort_method: "length2" | "position" | "quoted-text" | undefined;
  limit_collection: CoercedCollectionValues;
  target_collection: Map<string, CategoryMenuItem>;
}

// Stores query values of filter & option componenets, immediately reflecting value changes made by the user
export const DEFAULT_QUERY_VALUES: QueryValues = {
  score: 30,
  par_length: undefined, // Set when src lang value is available in query hook
  folio: undefined,
  sort_method: undefined,
  limit_collection: {
    excludedCategories: new Map<string, CategoryMenuItem>(),
    excludedTexts: new Map<string, TextMenuItem>(),
    includedCategories: new Map<string, CategoryMenuItem>(),
    includedTexts: new Map<string, TextMenuItem>(),
  },
  // TODO: add default values for target_collection
  target_collection: new Map<string, CategoryMenuItem>(),
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

export interface QueryParams {
  score: number;
  par_length: number | undefined;
  folio?: string;
  sort_method?: "length2" | "position" | "quoted-text";
  // TODO: update on backend refactor. For dev purposes "limit_collection" is being treated as the comming "included_collection" endpoint
  limit_collection?: string[];
  target_collection?: string[];
}

export const DEFAULT_QUERY_PARAMS: QueryParams = {
  ...DEFAULT_QUERY_VALUES,
  limit_collection: undefined,
  target_collection: undefined,
};

export const scoreFilterValueAtom = atom(DEFAULT_QUERY_VALUES.score);
export const parLengthFilterValueAtom = atom(DEFAULT_QUERY_VALUES.par_length);
export const folioOptionValueAtom = atom(DEFAULT_QUERY_VALUES.folio);
export const sortMethodOptionValueAtom = atom(DEFAULT_QUERY_VALUES.sort_method);
export const limitCollectionFilterValueAtom = atom(
  DEFAULT_QUERY_VALUES.limit_collection
);
export const targetCollectionFilterValueAtom = atom(
  DEFAULT_QUERY_VALUES.target_collection
);
