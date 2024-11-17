import { AllAPIRequestProps, APISchemas } from "@utils/api/types";
import type { DbViewEnum } from "@utils/constants";

export type AppResultPageView = DbViewEnum | "search";

type APIRequestPropsName = keyof AllAPIRequestProps;

/**
 *
 *
 * FILTER TYPES
 *
 */

type FeStateParams = "active_segment_index" | "right_pane_active_segment";

export type APIRequestFilters = NonNullable<AllAPIRequestProps["filters"]>;

export type APIRequestFilterName = keyof APIRequestFilters;

export type IndividualFilterName = Extract<
  APIRequestFilterName,
  "languages" | "score" | "par_length"
>;

export type DbSourceFilters = Omit<APIRequestFilters, IndividualFilterName>;

export type DbSourceFilterName = keyof DbSourceFilters;

export type FilterUISettings = Omit<
  APIRequestFilters,
  | "exclude_categories"
  | "exclude_collections"
  | "exclude_files"
  | "include_categories"
  | "include_collections"
  | "include_files"
> & {
  exclude_sources: string[];
  include_sources: string[];
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

export type SortMethod = APISchemas["SortMethod"];

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
  | FeStateParams
  | APIRequestPropsName
  | APIRequestFilterName
  | DisplayUISettingName
  | UtilityUISettingName;

export type AllUIComponentParamNames = Record<
  UIComponentParamName,
  UIComponentParamName
>;
