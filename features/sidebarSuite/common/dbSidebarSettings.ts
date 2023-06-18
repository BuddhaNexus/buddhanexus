import { DbViewEnum } from "@components/hooks/useDbView";
import { SourceLanguage } from "utils/constants";

export type SidebarSuitePageContext = "db" | "search";

// Items in the following settings arrays are given in order of appearance in sidebar
export enum SearchPageFilterEnum {
  LANGUAGE = "language",
  SEARCH = "search_string",
  INCLUDE_COLLECTION = "include_collection",
  INCLUDE_TEXT = "include_text",
  EXCLUDE_COLLECTION = "exclude_collection",
  EXCLUDE_TEXT = "exclude_text",
}

export enum DbPageFilterEnum {
  SCORE = "score",
  PAR_LENGTH = "par_length",
  INCLUDE_COLLECTION = "include_collection",
  INCLUDE_TEXT = "include_text",
  EXCLUDE_COLLECTION = "exclude_collection",
  EXCLUDE_TEXT = "exclude_text",
  TARGET_COLLECTION = "target_collection",
}

export enum QueriedDisplayOptionEnum {
  FOLIO = "folio",
  MULTI_LINGUAL = "multi_lingual",
  SORT_METHOD = "sort_method",
}
export enum LocalDisplayOptionEnum {
  SCRIPT = "script",
  SHOW_AND_POSITION_SEGMENT_NRS = "showAndPositionSegmentNrs",
}
export type DisplayOption = LocalDisplayOptionEnum | QueriedDisplayOptionEnum;

export enum UtilityOptionEnum {
  DOWNLOAD = "download",
  COPY_QUERY_TITLE = "copyQueryTitle",
  COPY_QUERY_LINK = "copyQueryLink",
  EMAIL_QUERY_LINK = "emailQueryLink",
}

export const settingEnums = {
  SearchPageFilterEnum,
  DbPageFilterEnum,
  QueriedDisplayOptionEnum,
  LocalDisplayOptionEnum,
  UtilityOptionEnum,
};

/** This creates a unique list of available settings across the SidebarSuite. Where there is overlap (e.g. "include_collection" applies to both DB results and search results pages) the value is taken from the first listed item.
 */

const queryParams = {
  language: SearchPageFilterEnum.LANGUAGE,
  searchString: SearchPageFilterEnum.SEARCH,
  includeCollection: SearchPageFilterEnum.INCLUDE_COLLECTION,
  includeText: SearchPageFilterEnum.INCLUDE_TEXT,
  excludeCollection: SearchPageFilterEnum.EXCLUDE_COLLECTION,
  excludeText: SearchPageFilterEnum.EXCLUDE_TEXT,
  score: DbPageFilterEnum.SCORE,
  parLength: DbPageFilterEnum.PAR_LENGTH,
  targetCollection: DbPageFilterEnum.TARGET_COLLECTION,
  folio: QueriedDisplayOptionEnum.FOLIO,
  multiLingual: QueriedDisplayOptionEnum.MULTI_LINGUAL,
  sortMethod: QueriedDisplayOptionEnum.SORT_METHOD,
};
const remote = {
  download: UtilityOptionEnum.DOWNLOAD,
};
const local = {
  script: LocalDisplayOptionEnum.SCRIPT,
  showAndPositionSegmentNrs:
    LocalDisplayOptionEnum.SHOW_AND_POSITION_SEGMENT_NRS,
  copyQueryTitle: UtilityOptionEnum.COPY_QUERY_TITLE,
  copyQueryLink: UtilityOptionEnum.COPY_QUERY_LINK,
  emailQueryLink: UtilityOptionEnum.EMAIL_QUERY_LINK,
};

export const settingsList = {
  queryParams,
  remote,
  local,
};

/**
 * Query params that only effect display (not number of results).
 */
export const displaySettingChipQueries: string[] = [
  queryParams.folio,
  queryParams.multiLingual,
  queryParams.sortMethod,
];

/**
 * Query params that are not counted as custom filter settings.
 */
export const filterChipQueryExclusions: string[] = [
  ...displaySettingChipQueries,
  queryParams.searchString,
];

export type MenuSetting = DbPageFilterEnum | DisplayOption | UtilityOptionEnum;

export type ViewOmission = (SourceLanguage | "allLangs")[];
export type SettingContext = Partial<Record<DbViewEnum, ViewOmission>>;

type SettingOmissions<K extends string, T = SettingContext> = Partial<
  Record<K, T>
>;

export type MenuOmission = SettingOmissions<MenuSetting>;

// Not all filters, options and utilities are applicable for all DB languages and views. The setting menu assumes each setting component is to be rendered, unless defined in the following config objects listing contexts in which specific settings should be ommitted. For example, the `limit_collection` filter should be shown in all cases except for graph view, in any language.

export const DB_PAGE_FILTER_OMISSIONS_CONFIG: SettingOmissions<DbPageFilterEnum> =
  {
    [queryParams.includeCollection]: {
      [DbViewEnum.GRAPH]: ["allLangs"],
    },
    [queryParams.includeText]: {
      [DbViewEnum.GRAPH]: ["allLangs"],
    },
    [queryParams.excludeCollection]: {
      [DbViewEnum.GRAPH]: ["allLangs"],
    },
    [queryParams.excludeText]: {
      [DbViewEnum.GRAPH]: ["allLangs"],
    },
    [queryParams.targetCollection]: {
      [DbViewEnum.NUMBERS]: ["allLangs"],
      [DbViewEnum.TABLE]: ["allLangs"],
      [DbViewEnum.TEXT]: ["allLangs"],
    },
  };

const QUERIED_DISPLAY_OPTIONS_OMISSIONS_CONFIG: SettingOmissions<QueriedDisplayOptionEnum> =
  {
    [queryParams.folio]: {
      // "folio" is used as "jump to" in text view and "only show" in other applicable views
      [DbViewEnum.GRAPH]: ["allLangs"],
    },
    [queryParams.multiLingual]: {
      [DbViewEnum.GRAPH]: ["allLangs"],
      [DbViewEnum.NUMBERS]: ["allLangs"],
      [DbViewEnum.TABLE]: ["allLangs"],
    },
    [queryParams.sortMethod]: {
      [DbViewEnum.GRAPH]: ["allLangs"],
      [DbViewEnum.NUMBERS]: ["allLangs"],
      [DbViewEnum.TEXT]: ["allLangs"],
    },
  };

const LOCAL_DISPLAY_OPTIONS_OMISSIONS_CONFIG: SettingOmissions<LocalDisplayOptionEnum> =
  {
    [local.script]: {
      [DbViewEnum.GRAPH]: ["allLangs"],
      [DbViewEnum.NUMBERS]: ["allLangs"],
      [DbViewEnum.TABLE]: [
        SourceLanguage.PALI,
        SourceLanguage.CHINESE,
        SourceLanguage.SANSKRIT,
      ],
      [DbViewEnum.TEXT]: [
        SourceLanguage.PALI,
        SourceLanguage.CHINESE,
        SourceLanguage.SANSKRIT,
      ],
    },
    [local.showAndPositionSegmentNrs]: {
      [DbViewEnum.GRAPH]: ["allLangs"],
      [DbViewEnum.NUMBERS]: ["allLangs"],
      [DbViewEnum.TABLE]: ["allLangs"],
    },
  };

export const DISPLAY_OPTIONS_OMISSIONS_CONFIG: SettingOmissions<DisplayOption> =
  {
    ...QUERIED_DISPLAY_OPTIONS_OMISSIONS_CONFIG,
    ...LOCAL_DISPLAY_OPTIONS_OMISSIONS_CONFIG,
  };

export const UTILITY_OPTIONS_OMISSIONS_CONFIG: SettingOmissions<UtilityOptionEnum> =
  {
    [remote.download]: {
      [DbViewEnum.GRAPH]: ["allLangs"],
      [DbViewEnum.TEXT]: ["allLangs"],
    },
  };

export const SETTINGS_OMISSIONS_CONFIG = {
  filters: { ...DB_PAGE_FILTER_OMISSIONS_CONFIG },
  displayOptions: {
    ...DISPLAY_OPTIONS_OMISSIONS_CONFIG,
  },
  utilityOptions: { ...UTILITY_OPTIONS_OMISSIONS_CONFIG },
};

type ExtractValues<T> = {
  [K in keyof T]: T[K];
}[keyof T];

type QueryParamsKeys = ExtractValues<typeof queryParams>;

type QueryNumberParam = "par_length" | "score";
type QueryStringParam =
  | "folio"
  | "language"
  | "multi_lingual"
  | "search_string"
  | "target_collection";
type QueryStringArrayParam =
  | "exclude_collection"
  | "exclude_text"
  | "include_collection"
  | "include_text";

type SortMethodType = "sort_method";
type SortMethod = "length2" | "position" | "quoted-text";

type OptionalParams = QueryStringArrayParam | QueryStringParam | SortMethodType;

export type QueryParams = {
  [K in QueryParamsKeys]: K extends QueryStringParam
    ? string | (K extends OptionalParams ? undefined : never)
    : K extends QueryNumberParam
    ? number
    : K extends SortMethodType
    ? SortMethod | (K extends OptionalParams ? undefined : never)
    : K extends QueryStringArrayParam
    ? string[] | (K extends OptionalParams ? undefined : never)
    : never;
};

export type DefaultQueryParams = Omit<QueryParams, OptionalParams>;

export const DEFAULT_QUERY_PARAMS_VALUES: QueryParams = {
  score: 30,
  // par_length is given a dummy value of 25 (lowest value applicable to all languages). The true value is initated in useDbQueryParams hook when src lang value is available.
  par_length: 25,
  folio: undefined,
  sort_method: undefined,
  include_collection: undefined,
  exclude_collection: undefined,
  include_text: undefined,
  exclude_text: undefined,
  target_collection: undefined,
  multi_lingual: undefined,
  language: undefined,
  search_string: undefined,
};

export const MIN_PAR_LENGTH_VALUES: Record<SourceLanguage, number> = {
  chn: 5,
  pli: 25,
  skt: 25,
  tib: 7,
};
export const DEFAULT_PAR_LENGTH_VALUES: Record<SourceLanguage, number> = {
  chn: 7,
  pli: 30,
  skt: 30,
  tib: 14,
};
