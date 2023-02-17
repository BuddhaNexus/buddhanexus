/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
import {
  ArrayParam,
  NumberParam,
  StringParam,
  withDefault,
} from "use-query-params";

type Filter =
  | "co_occ" // TODO: remove on API update
  | "folio"
  | "limit_collection"
  | "par_length"
  | "score" // TODO: confirm if to be removed
  | "sort_method"
  | "target_collection";

type FilterGroup = Filter[];
// TODO: remove "proto-filters"
type View = "graph" | "numbers" | "proto-filters" | "table" | "text";

const legacyFilters: FilterGroup = ["co_occ", "score"];

const basicFilters: FilterGroup = [...legacyFilters, "par_length"];

const standardFilters: FilterGroup = [...basicFilters, "limit_collection"];

export const filters: Record<View, FilterGroup> = {
  graph: [...basicFilters, "target_collection"],
  numbers: [...standardFilters, "folio"],
  "proto-filters": [...standardFilters, "folio", "sort_method"],
  table: [...standardFilters, "folio", "sort_method"],
  text: standardFilters,
};

// TODO: confirm default values
export const filterConfig = {
  co_occ: withDefault(NumberParam, 30),
  score: withDefault(NumberParam, 30),
  par_length: withDefault(NumberParam, 30),
  limit_collection: withDefault(ArrayParam, undefined),
  target_collection: withDefault(StringParam, undefined),
  folio: withDefault(StringParam, undefined),
  sort_method: withDefault(StringParam, undefined),
};

export const filterDefaults = {
  co_occ: 30,
  score: 30,
  par_length: 30,
  limit_collection: undefined,
  target_collection: undefined,
  folio: undefined,
  sort_method: undefined,
};
