import type { components, operations } from "codegen/api/v2.d.ts";

// TODO: most endpoint query functions have a `if undefined` check, this is to match a temp fix for BE data issues. The check should be cleared onee Pali data is updated on the BE.

/** TODO: hit list
 * InfiniteFilePropApiQuery,
 * parseDbPageQueryParams
 * ApiTextSegment
 * FilePropApiQuery
 */

/**
 * *********** !!! ***********
 * CODEGEN DERIVATE TYPES ONLY
 * Requests & responses mirror `operations` interface
 * from `codegen/api/v2.d.ts`
 * Sub-components taken directly from `components` interface
 * ************************** ¡¡¡ **************************
 */

export type APISchemas = components["schemas"];

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

export type APISearchRequestBody = APISchemas["SearchInput"];
export type APISearchResponseData = APISchemas["SearchOutput"];

/** GRAPH VIEW  */

export type APIGraphViewRequestBody = APIGeneralInput;
export type APIGraphViewResponseData = components["schemas"]["GraphViewOutput"];

/** VISUAL VIEW - not implemented */

/** TABEL VIEW */

export type APITableViewRequestBody = APIGeneralInput;
export type APITableViewResponseData = components["schemas"]["TableViewOutput"];

export type APITableViewDownloadRequestBody = APISchemas["TableDownloadInput"];
export type APITableViewDownloadResponseData =
  APISchemas["TableDownloadOutput"];

/** TEXT VIEW */

export type APITextViewMiddleRequestBody = APISchemas["TextViewMiddleInput"];
export type APITextViewMiddleResponseData = APISchemas["TextViewMiddleOutput"];

export type APITextViewParallelsRequestBody = APISchemas["TextParallelsInput"];
export type APITextViewParallelsResponseData = APISchemas["TextViewLeftOutput"];

/** NUMBERS VIEW */

export type APINumbersViewRequestBody = APIGeneralInput;
// `APINumbersSegment`: type for individual result item returned in `NumbersViewOutput` array.
export type APINumbersSegment =
  APISchemas["api__endpoints__models__numbers_view_models__Segment"];
export type APINumbersViewResponseData = APISchemas["NumbersViewOutput"];

export type APINumbersViewCategoryRequestQuery =
  operations["get_categories_for_numbers_view_numbers_view_categories__get"]["parameters"]["query"];
export type APINumbersViewCategoryResponseData = APISchemas["MenuOutput"];

/** EXTERNAL LINKS */

export type APIExternalLinksRequestQuery =
  operations["get_external_links_links_external__get"]["parameters"]["query"];
export type APIExternalLinksResponseData = APISchemas["LinksOutput"];

/** UTILS */

export type APICountMatchesRequestBody = APISchemas["CountMatchesInput"];
export type APICountMatchesResponseData = APISchemas["CountMatchesOutput"];

export type APIFolioRequestQuery =
  operations["get_folios_for_file_utils_folios__get"]["parameters"]["query"];
export type APIFolioResponseData = APISchemas["FolioOutput"];

export type APIDisplayNameRequestQuery =
  operations["get_displayname_for_segmentnr_utils_displayname__get"]["parameters"]["query"];
export type APIDisplayNameResponseData = APISchemas["DisplayNameOutput"];

// sanskrittagger - not implemented

export type APIAvailableLanguagesRequestQuery =
  operations["get_multilingual_utils_available_languages__get"]["parameters"]["query"];
export type APIAvailableLanguagesResponseData = APISchemas["LanguageOutput"];

/** MENUS */

export type APIMenuFilesRequestQuery =
  operations["get_files_for_menu_menus_files__get"]["parameters"]["query"];
export type APIMenuFilesResponseData = APISchemas["FilesOutput"];

export type APIMenuFilterFilesRequestQuery =
  operations["get_files_for_filter_menu_menus_filter__get"]["parameters"]["query"];
export type APIMenuFilterFilesResponseData = APISchemas["FilterOutput"];

export type APIMenuFilterCategoriesRequestQuery =
  operations["get_categories_for_filter_menu_menus_category__get"]["parameters"]["query"];
export type APIMenuFilterCategoriesResponseData = APISchemas["CategoryOutput"];

export type APIMenuAllCollectionsResponseData = APISchemas["CollectionsOutput"];

export type APIMenuSidebarRequestQuery =
  operations["get_data_for_sidebar_menu_menus_sidebar__get"]["parameters"]["query"];
export type APIMenuSidebarResponseData = APISchemas["SideBarOutput"];
