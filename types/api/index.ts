import type { components } from "codegen/api/v2.d.ts";

// TODO: most endpoint query functions have a `if undefined` check, this is to match a temp fix for BE data issues. The check should be cleared onee Pali data is updated on the BE.

/** TODO: hit list
 * InfiniteFilePropApiQuery,
 * parseDbPageQueryParams
 * ApiTextSegment
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

/** SEARCH */

export type APISearchRequestBody = APISchemas["SearchInput"];
export type APISearchResponseData = APISchemas["SearchOutput"];

/** GRAPH VIEW - not implemented */

/** VISUAL VIEW - not implemented */

/** TABEL VIEW */
export type APITableViewRequestBody = APIGeneralInput;
export type APITableViewResponseData = components["schemas"]["TableViewOutput"];

/** NUMBERS VIEW */

export type NumbersParallel = APISchemas["Parallel"];
export type NumbersSegment =
  APISchemas["api__endpoints__models__numbers_view_models__Segment"];

export type APINumbersViewRequestBody = APIGeneralInput;
export type APINumbersViewResponseData =
  components["schemas"]["NumbersViewOutput"];

/** MENUS */

export type APIMenuData = components["schemas"]["MenuOutput"];
