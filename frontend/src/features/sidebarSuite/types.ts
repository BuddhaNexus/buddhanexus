import { AllAPIRequestProps, APISchemas } from "@utils/api/types";
import type { DbViewEnum } from "@utils/constants";

export type SidebarSuitePageContext = "dbSourceFile" | "search";
export type AppResultPageView = DbViewEnum | "search";

type APIRequestPropsName = keyof AllAPIRequestProps;

// `AllAPIRequestPropModel` is an `at a glance` ref that catches any model changes pulled from the API
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AllAPIRequestPropModel: AllAPIRequestProps = {
  filters: {
    score: 0,
    par_length: 0,
    exclude_collections: [],
    exclude_categories: [],
    exclude_files: [],
    include_collections: [],
    include_categories: [],
    include_files: [],
    language: "all",
    languages: ["all"],
  },
  active_segment: "",
  sort_method: "position",
  folio: "",
  page: 0,
  download_data: "",
  filename: "",
  language: "pa",
  parallel_ids: [],
  search_string: "",
  segmentnr: "",
};

/**
 *
 *
 * FILTER TYPES
 *
 */

export type WorkingAPIFilters = NonNullable<AllAPIRequestProps["filters"]>;

export type APIFilterName = keyof WorkingAPIFilters;

export type IndividualFilterName = Extract<
  APIFilterName,
  "languages" | "score" | "par_length"
>;

export type DbSourceFilters = Omit<WorkingAPIFilters, IndividualFilterName>;

export type DbSourceFilterName = keyof DbSourceFilters;

export type RequestFilters = WorkingAPIFilters & {
  language: APISchemas["Languages"]; // TODO: DUE TO BE DEFINED ON API SO SHOULD BE REMOVED WHEN AVAILABLE.
};

export type RequestFilterName = keyof RequestFilters;

export type FilterUISettings = Omit<
  WorkingAPIFilters,
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

export type LocalDisplayUISettingName = "script" | "showSegmentNrs";

export type DisplayUISettingName =
  | RequestDisplayUISettingName
  | LocalDisplayUISettingName;

// --- DISPLAY TYPES VALUES

export type SortMethod = APISchemas["Sortmethod"];

export type Script = "Unicode" | "Wylie";

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
