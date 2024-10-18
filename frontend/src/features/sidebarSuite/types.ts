import { AllAPIRequestProps, APISchemas } from "@utils/api/types";
import type { DbViewEnum } from "@utils/constants";

export type SidebarSuitePageContext = "dbSourceFile" | "search";
export type AppResultPageView = DbViewEnum | "search";

type APIRequestPropsName = keyof AllAPIRequestProps;

/**
const example: AllAPIRequestProps = {
  filters: {
    exclude_categories: [],
    exclude_collections: [],
    exclude_files: [],
    include_categories: [],
    include_collections: [],
    include_files: [],
    par_length: 0,
    score: 0,
    languages: ["all"],
  },
  active_segment: "",
  sort_method: "position",
  folio: "",
  page: 0,
  download_data: "",
  filename: "",
  language: "all",
  parallel_ids: [],
  search_string: "",
  segmentnr: "",
};
*/

/**
 *
 *
 * FILTER TYPES
 *
 */

export type RequestFilters = NonNullable<AllAPIRequestProps["filters"]> & {
  language: APISchemas["Languages"]; // TODO: DUE TO BE DEFINED ON API SO SHOULD BE REMOVED WHEN AVAILABLE.
};

export type RequestFilterName = keyof RequestFilters;

export type FilterUISettings = Omit<
  NonNullable<AllAPIRequestProps["filters"]>,
  | "exclude_categories"
  | "exclude_collections"
  | "exclude_files"
  | "include_categories"
  | "include_collections"
  | "include_files"
> & {
  exclude_sources: string[];
  include_sources: string[];
  language: APISchemas["Languages"]; // TODO: DUE TO BE DEFINED ON API SO SHOULD BE REMOVED WHEN AVAILABLE.
};

export type RequestFilterUISettingName = keyof FilterUISettings;

export type DBSourceFilePageFilterUISettingName = Exclude<
  RequestFilterUISettingName,
  "language"
>;

export type SearchPageFilterUISettingName = Exclude<
  RequestFilterUISettingName,
  "par_length" | "score" | "languages"
>;

export type DbSourceFilterUISetting = Extract<
  RequestFilterUISettingName,
  "exclude_sources" | "include_sources"
>;

export type DbSourceFiltersSelectedIds = Record<
  DbSourceFilterUISetting,
  string[]
>;

/**
 *
 *
 * DISPLAY TYPES
 *
 */

export type RequestDisplayUISettingName = Extract<
  APIRequestPropsName,
  "folio" | "sort_method"
>;

export type SortMethod = "position" | "quoted-text" | "length2"; // TODO: DUE TO BE DEFINED ON API SO SHOULD BE CONVERTED TO TYPE DERIVED FROM API AllAPIRequestProps

export type LocalDisplayUISettingName = "script" | "showSegmentNrs";

export type Script = "Unicode" | "Wylie";

export type DisplayUISettingName =
  | RequestDisplayUISettingName
  | LocalDisplayUISettingName;

/**
 *
 *
 * UTILITY TYPES
 *
 */

export type RequestUtilityUISettingName = Extract<
  APIRequestPropsName,
  "download_data"
>;

export type LocalUtilityUISettingName =
  | "copyQueryTitle"
  | "copyQueryLink"
  | "emailQueryLink";

export type UtilityUISettingName =
  | RequestUtilityUISettingName
  | LocalUtilityUISettingName;

/**
 *
 *
 * ALL SETTING NAMES
 *
 */

export type UIComponentParamName =
  | APIRequestPropsName
  | RequestFilterName
  | DisplayUISettingName
  | UtilityUISettingName;

export type AllUIComponentParamNames = Record<
  UIComponentParamName,
  UIComponentParamName
>;
