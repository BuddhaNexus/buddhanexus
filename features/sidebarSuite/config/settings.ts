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
