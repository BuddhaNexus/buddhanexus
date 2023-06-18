import type { DbViewEnum } from "@components/hooks/useDbView";
import type { SourceLanguage } from "utils/constants";

import type { settingsList } from "./composits";
import type {
  DbPageFilterEnum,
  LocalDisplayOptionEnum,
  QueriedDisplayOptionEnum,
  UtilityOptionEnum,
} from "./settings";

export {
  type DbPageFilterEnum,
  type LocalDisplayOptionEnum,
  type QueriedDisplayOptionEnum,
  type UtilityOptionEnum,
} from "./settings";

export type SidebarSuitePageContext = "db" | "search";

export type DisplayOption = LocalDisplayOptionEnum | QueriedDisplayOptionEnum;

export type MenuSetting = DbPageFilterEnum | DisplayOption | UtilityOptionEnum;

export type ViewOmission = (SourceLanguage | "allLangs")[];
export type SettingContext = Partial<Record<DbViewEnum, ViewOmission>>;

export type SettingOmissions<K extends string, T = SettingContext> = Partial<
  Record<K, T>
>;

export type MenuOmission = SettingOmissions<MenuSetting>;

type ExtractValues<T> = {
  [K in keyof T]: T[K];
}[keyof T];

type QueryParamsKeys = ExtractValues<typeof settingsList.queryParams>;

type QueryNumberParam = "par_length" | "score";
type QueryStringParam =
  | "folio"
  | "language"
  | "multi_lingual"
  | "search_string"
  | "target_collection";
type QueryStringArrayParam =
  | "exclude_collection"
  | "exclude_text"
  | "include_collection"
  | "include_text";

type SortMethodType = "sort_method";
type SortMethod = "length2" | "position" | "quoted-text";

type OptionalParams = QueryStringArrayParam | QueryStringParam | SortMethodType;

export type QueryParams = {
  [K in QueryParamsKeys]: K extends QueryStringParam
    ? string | (K extends OptionalParams ? undefined : never)
    : K extends QueryNumberParam
    ? number
    : K extends SortMethodType
    ? SortMethod | (K extends OptionalParams ? undefined : never)
    : K extends QueryStringArrayParam
    ? string[] | (K extends OptionalParams ? undefined : never)
    : never;
};

export type DefaultQueryParams = Omit<QueryParams, OptionalParams>;
