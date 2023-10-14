import type { DbViewEnum } from "@components/hooks/useDbView";
import type { CategoryMenuItem, DatabaseText } from "types/api/menus";
import type { SourceLanguage } from "utils/constants";

import type {
  dbPageFilter,
  localDisplayOption,
  queriedDisplayOption,
  searchPageFilter,
  uniqueSettings,
  utilityOption,
} from "./settings";

export type SearchPageFilter =
  (typeof searchPageFilter)[keyof typeof searchPageFilter];
export type DbPageFilter = (typeof dbPageFilter)[keyof typeof dbPageFilter];
export type LocalDisplayOption =
  (typeof localDisplayOption)[keyof typeof localDisplayOption];
export type QueriedDisplayOption =
  (typeof queriedDisplayOption)[keyof typeof queriedDisplayOption];
export type UtilityOption = (typeof utilityOption)[keyof typeof utilityOption];

export type SidebarSuitePageContext = "db" | "search";

export type DisplayOption = LocalDisplayOption | QueriedDisplayOption;

export type MenuSetting =
  | DbPageFilter
  | DisplayOption
  | SearchPageFilter
  | UtilityOption;

export type ViewOmission = (SourceLanguage | "allLangs")[];
export type SettingContext = Partial<Record<DbViewEnum, ViewOmission>>;

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
  | "multi_lingual"
  | "search_string"
  | "target_collection";

export type LimitsParam = {
  category_exclude?: CategoryMenuItem[];
  category_include?: CategoryMenuItem[];
  file_exclude?: DatabaseText[];
  file_include?: DatabaseText[];
};

export type Limit = keyof LimitsParam;

// Tecnically "limits" is not a type but TS is limited in it's ability to enforce the contents of arrays based on types, so this is being defined here as a pseduo type.
export const limits: Limit[] = [
  "category_exclude",
  "category_include",
  "file_include",
  "file_exclude",
];

type SortMethod = "length2" | "position" | "quoted-text";

type OptionalParams =
  | "folio"
  | "language"
  | "limits"
  | "multi_lingual"
  | "search_string"
  | "sort_method"
  | "target_collection";

/**
 * `QueryParams` defineds all query params available in the API and the types they can take (and whether or not they can be left undefined, or must have a value set).
 *
 * The nested ternary checking if the object key is in `QueryStringParam`, `QueryNumberParam` or param with a custom type is unreasonably complex, but this is a common pattern in TS when you want to map different keys to different types.
 *
 * TS is perfectly bonkers and in the condition check context, `extends` means "is in".
 */
export type QueryParams = {
  [Key in QueryParamKeys]: Key extends QueryStringParam
    ? string | (Key extends OptionalParams ? undefined : never)
    : Key extends QueryNumberParam
    ? number
    : Key extends "sort_method"
    ? SortMethod | (Key extends OptionalParams ? undefined : never)
    : Key extends "limits"
    ? LimitsParam | (Key extends OptionalParams ? undefined : never)
    : Key extends "target_collection"
    ? string[] | (Key extends OptionalParams ? undefined : never)
    : never;
};

export type DefaultQueryParams = Omit<QueryParams, OptionalParams>;
