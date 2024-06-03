import type { components, paths } from "codegen/api/v2.d.ts";

// TODO: most endpoint query functions have a `if undefined` check, this is to match a temp fix for BE data issues. The check should be cleared onee Pali data is updated on the BE.

/**
 * *********** !!! ***********
 * CODEGEN DERIVATE TYPES ONLY
 * Requests & responses mirror paths given in the `operations`
 * interface in `codegen/api/v2.d.ts`
 * Sub-components taken directly from `components` interface
 * ************************** ¡¡¡ **************************
 */

export type APISchemas = components["schemas"];

type APIRequestBody<operation> = "requestBody" extends keyof operation
  ? "content" extends keyof operation["requestBody"]
    ? "application/json" extends keyof operation["requestBody"]["content"]
      ? operation["requestBody"]["content"]["application/json"]
      : never
    : never
  : never;

type APIRequestParams<operation> = "parameters" extends keyof operation
  ? "query" extends keyof operation["parameters"]
    ? operation["parameters"]["query"]
    : never
  : never;

type APIResponse<operation> = "responses" extends keyof operation
  ? 200 extends keyof operation["responses"]
    ? "content" extends keyof operation["responses"][200]
      ? "application/json" extends keyof operation["responses"][200]["content"]
        ? operation["responses"][200]["content"]["application/json"]
        : never
      : never
    : never
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

export type APISearchRequestBody = APIRequestBody<paths["/search/"]["post"]>;
export type APISearchResponseData = APIResponse<paths["/search/"]["post"]>;

/** GRAPH VIEW  */

export type APIGraphViewRequestBody = APIRequestBody<
  paths["/graph-view/"]["post"]
>;
export type APIGraphViewResponseData = APIResponse<
  paths["/graph-view/"]["post"]
>;

/** VISUAL VIEW  */

export type APIVisualViewRequestBody = APIRequestParams<
  paths["/visual-view/"]["post"]
>;
export type APIVisualViewResponseData = APIResponse<
  paths["/visual-view/"]["post"]
>;

/** TABEL VIEW */

export type APITableViewRequestBody = APIRequestBody<
  paths["/table-view/table/"]["post"]
>;
export type APITableViewResponseData = APIResponse<
  paths["/table-view/table/"]["post"]
>;

export type APITableViewDownloadRequestBody = APIRequestBody<
  paths["/table-view/download/"]["post"]
>;
export type APITableViewDownloadResponseData = APIResponse<
  paths["/table-view/download/"]["post"]
>;

/** TEXT VIEW */

export type APITextViewMiddleRequestBody = APIRequestBody<
  paths["/text-view/middle/"]["post"]
>;
export type APITextViewMiddleResponseData = APIResponse<
  paths["/text-view/middle/"]["post"]
>;

export type APITextViewParallelsRequestBody = APIRequestBody<
  paths["/text-view/text-parallels/"]["post"]
>;
export type APITextViewParallelsResponseData = APIResponse<
  paths["/text-view/text-parallels/"]["post"]
>;

/** NUMBERS VIEW */

export type APINumbersViewRequestBody = APIRequestBody<
  paths["/numbers-view/numbers/"]["post"]
>;
export type APINumbersViewResponseData = APIResponse<
  paths["/numbers-view/numbers/"]["post"]
>;
// `APINumbersSegment`: type for individual result item returned in `NumbersViewOutput` array.
export type APINumbersSegment = APINumbersViewResponseData[number];

export type APINumbersViewCategoryRequestQuery = APIRequestParams<
  paths["/numbers-view/categories/"]["get"]
>;
export type APINumbersViewCategoryResponseData = APIResponse<
  paths["/numbers-view/categories/"]["get"]
>;

/** EXTERNAL LINKS */

export type APIExternalLinksRequestQuery = APIRequestParams<
  paths["/links/external/"]["get"]
>;
export type APIExternalLinksResponseData = APIResponse<
  paths["/links/external/"]["get"]
>;

/** UTILS */

export type APICountMatchesRequestBody = APIRequestBody<
  paths["/utils/count-matches/"]["post"]
>;
export type APICountMatchesResponseData = APIResponse<
  paths["/utils/count-matches/"]["post"]
>;

export type APIFolioRequestQuery = APIRequestParams<
  paths["/utils/folios/"]["get"]
>;
export type APIFolioResponseData = APIResponse<paths["/utils/folios/"]["get"]>;

export type APIDisplayNameRequestQuery = APIRequestParams<
  paths["/utils/displayname/"]["get"]
>;
export type APIDisplayNameResponseData = APIResponse<
  paths["/utils/displayname/"]["get"]
>;

// sanskrittagger - not implemented

export type APIAvailableLanguagesRequestQuery = APIRequestParams<
  paths["/utils/available-languages/"]["get"]
>;
export type APIAvailableLanguagesResponseData = APIResponse<
  paths["/utils/available-languages/"]["get"]
>;

/** MENUS */

export type APIMenuFilesRequestQuery = APIRequestParams<
  paths["/menus/files/"]["get"]
>;
export type APIMenuFilesResponseData = APIResponse<
  paths["/menus/files/"]["get"]
>;

export type APIMenuFilterFilesRequestQuery = APIRequestParams<
  paths["/menus/filter/"]["get"]
>;
export type APIMenuFilterFilesResponseData = APIResponse<
  paths["/menus/filter/"]["get"]
>;

export type APIMenuFilterCategoriesRequestQuery = APIRequestParams<
  paths["/menus/category/"]["get"]
>;
export type APIMenuFilterCategoriesResponseData = APIResponse<
  paths["/menus/category/"]["get"]
>;

export type APIMenuAllCollectionsResponseData = APIResponse<
  paths["/menus/collections/"]["get"]
>;

export type APIMenuSidebarRequestQuery = APIRequestParams<
  paths["/menus/sidebar/"]["get"]
>;
export type APIMenuSidebarResponseData = APIResponse<
  paths["/menus/sidebar/"]["get"]
>;
