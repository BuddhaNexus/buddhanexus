import {
  SortMethod,
  DBSourceFilePageFilterUISettingName,
  SearchPageFilterUISettingName,
  DisplayUISettingName,
  UtilityUISettingName,
  AllUIComponentParamNames,
} from "./types";

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
  par_length: "par_length",
  score: "score",
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
