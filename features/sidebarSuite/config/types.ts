import type { ParsedCategoryMenuItem } from "utils/api/endpoints/menus/category";
import type { ParsedTextFileMenuItem } from "utils/api/endpoints/menus/files";
import type { DbViewEnum, SourceLanguage } from "utils/constants";

import {
  DisplayOption,
  PageFilter,
  uniqueSettings,
  UtilityOption,
} from "./settings";

export type SidebarSuitePageContext = "dbResult" | "search";
export type SettingOmissionContext = DbViewEnum | "search";

export type MenuSetting = PageFilter | DisplayOption | UtilityOption;

export type Omission = (SourceLanguage | "all")[];
export type SettingContext = Partial<Record<SettingOmissionContext, Omission>>;

export type SettingOmissions<K extends string, T = SettingContext> = Partial<
  Record<K, T>
>;

export type MenuOmission = SettingOmissions<MenuSetting>;

/**
 * This maps over all keys in ObjectType (`[Key in keyof ObjectType]`), extracting the type of each value (`ObjectType[Key]`), and then uses `[keyof ObjectType]` to create a union type of all these value types.
 *
 * For example, if `ObjectType` is `{ a: number, b: string, c: boolean }`, the resulting union type would be `number | string | boolean`.
 *
 * Here, `QueryParamKeys` uses the string litral types aligned with available API query params set in `uniqueSettings.queryParams`.
 */
type CreateUnionFromObjectValueTypes<ObjectType> = {
  [Key in keyof ObjectType]: ObjectType[Key];
}[keyof ObjectType];

type QueryParamKeys = CreateUnionFromObjectValueTypes<
  typeof uniqueSettings.queryParams
>;

type QueryNumberParam = "par_length" | "score";
type QueryStringParam =
  | "folio"
  | "language"
  | "search_string"
  | "target_collection";

export type MultiLingalParam = SourceLanguage[] | undefined;

/**
 * <LIMITS FILTER REFACTOR WORKING IN PROGRESS
 * BE updates pending, temp typing for now
 */

export type LimitsFilterValue = {
  category_exclude?: ParsedCategoryMenuItem[];
  category_include?: ParsedCategoryMenuItem[];
  file_exclude?: ParsedTextFileMenuItem[];
  file_include?: ParsedTextFileMenuItem[];
};

export type LimitsParam = {
  category_exclude?: string[];
  category_include?: string[];
  file_exclude?: string[];
  file_include?: string[];
};

export type Limit = keyof LimitsFilterValue;

// Technically "limits" is not a type but TS is limited in it's ability to enforce the contents of arrays based on types, so this is being defined here as a pseduo type.
export const limits: Limit[] = [
  "category_exclude",
  "file_exclude",
  "category_include",
  "file_include",
];

export type DbSourceFilters = {
  include_files?: string[];
  include_categories?: string[];
  include_collections?: string[];
  exclude_files?: string[];
  exclude_categories?: string[];
  exclude_collections?: string[];
};

export type DbSourceFilterType = "exclude" | "include";
export type DbSourceFiltersSelectedIds = Record<DbSourceFilterType, string[]>;

/**
 * LIMITS FILTER REFACTOR WORKING IN PROGRESS />
 */

export const sortMethods = ["position", "quoted-text", "length2"] as const;
export type SortMethod = (typeof sortMethods)[number];

// TODO: review contenxts (lang / view) in which different params are required.
type UndefinedParams =
  | "folio"
  | "language"
  | "limits"
  | "search_string"
  | "sort_method"
  | "target_collection";

type DefaultValueParams =
  | "score"
  | "par_length"
  | "multi_lingual"
  | "sort_method";

/**
 * `QueryParams` defines all query params available on the API and the types they can take (and whether or not they can be left undefined, or must have a value set).
 *
 * The nested ternary checks if the object key is in `QueryStringParam`, `QueryNumberParam` or a param with a custom type. It is unreasonably complex, but this is a common pattern in TS when you want to map different keys to different types.
 *
 * TS is perfectly bonkers and in the condition check context, `extends` means `is in`.
 */
export type QueryParams = {
  [Key in QueryParamKeys]: Key extends QueryStringParam
    ? string | (Key extends UndefinedParams ? undefined : never)
    : Key extends QueryNumberParam
      ? number
      : Key extends "sort_method"
        ? SortMethod | (Key extends UndefinedParams ? undefined : never)
        : Key extends "limits"
          ?
              | LimitsFilterValue
              | (Key extends UndefinedParams ? undefined : never)
          : Key extends "target_collection"
            ? string[] | (Key extends UndefinedParams ? undefined : never)
            : Key extends "multi_lingual"
              ?
                  | MultiLingalParam
                  | (Key extends UndefinedParams ? undefined : never)
              : never;
};

export type DefaultQueryParams = Pick<QueryParams, DefaultValueParams>;
