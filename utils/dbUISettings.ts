/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
import type { DbView } from "types/api/common";
import {
  ArrayParam,
  NumberParam,
  StringParam,
  withDefault,
} from "use-query-params";

export type FilterQuery =
  | "co_occ" // TODO: remove on API update
  | "limit_collection"
  | "par_length"
  | "score" // TODO: confirm if to be removed
  | "target_collection";

export type QueriedDisplayOption = "folio" | "multi_lingual" | "sort_method";

export type LocalDisplayOption = "script" | "showAndPositionSegmentNrs";

export type LocalUtilityOption =
  | "copyQueryLink" // PROPOSED
  | "copyQueryTitle"
  | "download"
  | "emailQueryLink" // PROPOSED
  | "resourceLinks";

export type DisplayOption = LocalDisplayOption | QueriedDisplayOption;

export type DisplayOptions = Record<DbView, DisplayOption[]>;

const legacyFilters: FilterQuery[] = ["co_occ", "score"];
const basicFilters: FilterQuery[] = [...legacyFilters, "par_length"];
const standardFilters: FilterQuery[] = [...basicFilters, "limit_collection"];

export const filters: Record<DbView, FilterQuery[]> = {
  graph: [...basicFilters, "target_collection"],
  numbers: standardFilters,
  table: standardFilters,
  text: standardFilters,
};

// "folio" is used as "jump to" in text view and "only show" in other applicable views
export const viewDisplayOptions: DisplayOptions = {
  graph: [],
  numbers: ["folio"],
  table: ["folio", "sort_method"],
  text: ["folio", "showAndPositionSegmentNrs"],
};

// TODO: confirm default values
export const queryConfig = {
  co_occ: withDefault(NumberParam, 30),
  score: withDefault(NumberParam, 30),
  par_length: withDefault(NumberParam, 30),
  limit_collection: withDefault(ArrayParam, undefined),
  target_collection: withDefault(StringParam, undefined),
  folio: withDefault(StringParam, undefined),
  sort_method: withDefault(StringParam, undefined),
};

export const queryDefaults = {
  co_occ: 30,
  score: 30,
  par_length: 30,
  limit_collection: undefined,
  target_collection: undefined,
  folio: undefined,
  sort_method: undefined,
};
