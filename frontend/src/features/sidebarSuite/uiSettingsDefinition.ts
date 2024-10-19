import {
  SortMethod,
  DBSourceFilePageFilterUISettingName,
  SearchPageFilterUISettingName,
  DisplayUISettingName,
  UtilityUISettingName,
  AllUIComponentParamNames,
} from "./types";
import { DbLanguage } from "@utils/api/types";

import { exhaustiveStringTuple } from "@utils/validators";

// order sets appearance in sidebar

export const dbSoureFileRequestFilters =
  exhaustiveStringTuple<DBSourceFilePageFilterUISettingName>()(
    "score",
    "par_length",
    "exclude_sources",
    "include_sources",
    "languages"
  );
export const searchRequestFilters =
  exhaustiveStringTuple<SearchPageFilterUISettingName>()(
    "language",
    "exclude_sources",
    "include_sources"
  );

export const sortMethods = exhaustiveStringTuple<SortMethod>()(
  "position",
  "quoted-text",
  "length2"
);

export const displayUISettings = exhaustiveStringTuple<DisplayUISettingName>()(
  "folio",
  "sort_method",
  "script",
  "showSegmentNrs"
);

export const utilityUISettings = exhaustiveStringTuple<UtilityUISettingName>()(
  "download_data",
  "copyQueryTitle",
  "copyQueryLink",
  "emailQueryLink"
);

export const allUIComponentParamNames: AllUIComponentParamNames = {
  score: "score",
  par_length: "par_length",
  languages: "languages",
  exclude_categories: "exclude_categories",
  exclude_collections: "exclude_collections",
  exclude_files: "exclude_files",
  include_categories: "include_categories",
  include_collections: "include_collections",
  language: "language",
  include_files: "include_files",
  folio: "folio",
  sort_method: "sort_method",
  script: "script",
  showSegmentNrs: "showSegmentNrs",
  download_data: "download_data",
  copyQueryTitle: "copyQueryTitle",
  copyQueryLink: "copyQueryLink",
  emailQueryLink: "emailQueryLink",
  active_segment: "active_segment",
  page: "page",
  filename: "filename",
  parallel_ids: "parallel_ids",
  search_string: "search_string",
  segmentnr: "segmentnr",
  filters: "filters",
};

export const DEFAULT_PARAM_VALUES = {
  score: 30,
  // par_length is given a dummy value of 25 (lowest value applicable to all languages). The true value is initated when src lang value is available.
  par_length: 25,
  folio: undefined,
  sort_method: undefined,
  limits: undefined,
  target_collection: undefined,
  multi_lingual: undefined,
  language: undefined,
  search_string: undefined,
};

export const MIN_PAR_LENGTH_VALUES: Record<DbLanguage, number> = {
  zh: 5,
  pa: 25,
  sa: 25,
  bo: 7,
};

export const DEFAULT_PAR_LENGTH_VALUES: Record<DbLanguage, number> = {
  zh: 7,
  pa: 30,
  sa: 30,
  bo: 14,
};
