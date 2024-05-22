import type { components, operations } from "codegen/api/v2.d.ts";

// TODO: most endpoint query functions have a `if undefined` check, this is to match a temp fix for BE data issues. The check should be cleared onee Pali data is updated on the BE.

/**
 * *********** !!! ***********
 * CODEGEN DERIVATE TYPES ONLY
 * Requests & responses mirror `operations` interface
 * from `codegen/api/v2.d.ts`
 * Sub-components taken directly from `components` interface
 * ************************** ¡¡¡ **************************
 */

export type APISchemas = components["schemas"];

type APIRequestBody<OperationName extends keyof operations> =
  "requestBody" extends keyof operations[OperationName]
    ? "content" extends keyof operations[OperationName]["requestBody"]
      ? "application/json" extends keyof operations[OperationName]["requestBody"]["content"]
        ? operations[OperationName]["requestBody"]["content"]["application/json"]
        : never
      : never
    : never;

type APIRequestParams<OperationName extends keyof operations> =
  "parameters" extends keyof operations[OperationName]
    ? "query" extends keyof operations[OperationName]["parameters"]
      ? operations[OperationName]["parameters"]["query"]
      : never
    : never;

type APIResponse<OperationName extends keyof operations> =
  200 extends keyof operations[OperationName]["responses"]
    ? operations[OperationName]["responses"][200]["content"]["application/json"]
    : never;

/** COMMON */

// request
export type APIGeneralInput = APISchemas["GeneralInput"];

// response
export type APILimits = APISchemas["Limits"];
export type APIFullNames = APISchemas["FullNames"];
export type APIFullText = APISchemas["FullText"];
export type APIFullMatchText = APISchemas["FullMatchText"];
export type APIParallel = APISchemas["Parallel"];

/**
 * *****************************************
 * ENDPOINTS (`operations` interface mirror)
 * *****************************************
 */

/** SEARCH */

export type APISearchRequestBody =
  APIRequestBody<"get_search_results_search__post">;
export type APISearchResponseData =
  APIResponse<"get_search_results_search__post">;

/** GRAPH VIEW  */

export type APIGraphViewRequestBody =
  APIRequestBody<"get_graph_for_file_graph_view__post">;
export type APIGraphViewResponseData =
  APIResponse<"get_graph_for_file_graph_view__post">;

/** VISUAL VIEW  */

export type APIVisualViewRequestBody =
  APIRequestBody<"get_visual_view_for_file_visual_view__get">;
export type APIVisualViewResponseData =
  APIResponse<"get_visual_view_for_file_visual_view__get">;

/** TABEL VIEW */

export type APITableViewRequestBody =
  APIRequestBody<"get_table_view_table_view_table__post">;
export type APITableViewResponseData =
  APIResponse<"get_table_view_table_view_table__post">;

export type APITableViewDownloadRequestBody =
  APIRequestBody<"get_table_download_table_view_download__post">;
export type APITableViewDownloadResponseData =
  APIResponse<"get_table_download_table_view_download__post">;

/** TEXT VIEW */

export type APITextViewMiddleRequestBody =
  APIRequestBody<"get_parallels_for_middle_text_view_middle__post">;
export type APITextViewMiddleResponseData =
  APIResponse<"get_parallels_for_middle_text_view_middle__post">;

export type APITextViewParallelsRequestBody =
  APIRequestBody<"get_file_text_segments_and_parallels_text_view_text_parallels__post">;
export type APITextViewParallelsResponseData =
  APIResponse<"get_file_text_segments_and_parallels_text_view_text_parallels__post">;

/** NUMBERS VIEW */

export type APINumbersViewRequestBody =
  APIRequestBody<"get_numbers_view_numbers_view_numbers__post">;
export type APINumbersViewResponseData =
  APIResponse<"get_numbers_view_numbers_view_numbers__post">;
// `APINumbersSegment`: type for individual result item returned in `NumbersViewOutput` array.
export type APINumbersSegment = APINumbersViewResponseData[number];

export type APINumbersViewCategoryRequestQuery =
  APIRequestParams<"get_categories_for_numbers_view_numbers_view_categories__get">;
export type APINumbersViewCategoryResponseData =
  APIResponse<"get_categories_for_numbers_view_numbers_view_categories__get">;

/** EXTERNAL LINKS */

export type APIExternalLinksRequestQuery =
  APIRequestParams<"get_external_links_links_external__get">;
export type APIExternalLinksResponseData =
  APIResponse<"get_external_links_links_external__get">;

/** UTILS */

export type APICountMatchesRequestBody =
  APIRequestBody<"get_counts_for_file_utils_count_matches__post">;
export type APICountMatchesResponseData =
  APIResponse<"get_counts_for_file_utils_count_matches__post">;

export type APIFolioRequestQuery =
  APIRequestParams<"get_folios_for_file_utils_folios__get">;
export type APIFolioResponseData =
  APIResponse<"get_folios_for_file_utils_folios__get">;

export type APIDisplayNameRequestQuery =
  APIRequestParams<"get_displayname_for_segmentnr_utils_displayname__get">;
export type APIDisplayNameResponseData =
  APIResponse<"get_displayname_for_segmentnr_utils_displayname__get">;

// sanskrittagger - not implemented

export type APIAvailableLanguagesRequestQuery =
  APIRequestParams<"get_multilingual_utils_available_languages__get">;
export type APIAvailableLanguagesResponseData =
  APIResponse<"get_multilingual_utils_available_languages__get">;

/** MENUS */

export type APIMenuFilesRequestQuery =
  APIRequestParams<"get_files_for_menu_menus_files__get">;
export type APIMenuFilesResponseData =
  APIResponse<"get_files_for_menu_menus_files__get">;

export type APIMenuFilterFilesRequestQuery =
  APIRequestParams<"get_files_for_filter_menu_menus_filter__get">;
export type APIMenuFilterFilesResponseData =
  APIResponse<"get_files_for_filter_menu_menus_filter__get">;

export type APIMenuFilterCategoriesRequestQuery =
  APIRequestParams<"get_categories_for_filter_menu_menus_category__get">;
export type APIMenuFilterCategoriesResponseData =
  APIResponse<"get_categories_for_filter_menu_menus_category__get">;

export type APIMenuAllCollectionsResponseData =
  APIResponse<"get_all_collections_menus_collections__get">;

export type APIMenuSidebarRequestQuery =
  APIRequestParams<"get_data_for_sidebar_menu_menus_sidebar__get">;
export type APIMenuSidebarResponseData =
  APIResponse<"get_data_for_sidebar_menu_menus_sidebar__get">;
