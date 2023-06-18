import {
  DbPageFilterEnum,
  LocalDisplayOptionEnum,
  QueriedDisplayOptionEnum,
  SearchPageFilterEnum,
  UtilityOptionEnum,
} from "./settings";

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

const remote = {
  download: UtilityOptionEnum.DOWNLOAD,
} as const;

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
