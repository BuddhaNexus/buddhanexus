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

/** This creates a list of unique settings available across the SidebarSuite. Where there is overlap (e.g. "include_collection" applies to both DB results and search results pages) the value is taken from the first listed item.
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
} as const;

/** A results (.xmlx) download is triggered via an API endpoint, but is never set as a query param.
 */
const remote = {
  download: UtilityOptionEnum.DOWNLOAD,
} as const;

/** No API calls needed.
 */
const local = {
  script: LocalDisplayOptionEnum.SCRIPT,
  showAndPositionSegmentNrs:
    LocalDisplayOptionEnum.SHOW_AND_POSITION_SEGMENT_NRS,
  copyQueryTitle: UtilityOptionEnum.COPY_QUERY_TITLE,
  copyQueryLink: UtilityOptionEnum.COPY_QUERY_LINK,
  emailQueryLink: UtilityOptionEnum.EMAIL_QUERY_LINK,
} as const;

export const settingsList = {
  queryParams,
  remote,
  local,
};
