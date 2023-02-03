export type FilterGroup = string[];
export type View = "graph" | "numbers" | "proto-filters" | "table" | "text";
export type Lang = "chn" | "pli" | "skt" | "tib";

export type Filters = Record<View, Record<Lang, string[]>>;

const COMMON_BASIC_FILTERS: FilterGroup = ["MinMatchLength"];
const COMMON_INCLUSION_FILTERS: FilterGroup = [
  "ExcludeCollection",
  "ExcludeFile",
  "LimitToCollection",
  "LimitToFile",
];
const STANDARD_FILTERS: FilterGroup = [
  ...COMMON_BASIC_FILTERS,
  ...COMMON_INCLUSION_FILTERS,
];

const TABLE_FILTERS: FilterGroup = [...STANDARD_FILTERS, "Sorting"];
const GRAPH_FILTERS: FilterGroup = [
  ...COMMON_BASIC_FILTERS,
  "TargetCollection",
];

export const VIEW_FILTERS: Filters = {
  numbers: {
    pli: [...STANDARD_FILTERS, "PTSSection"],
    chn: [...STANDARD_FILTERS, "Facsimile"],
    tib: [],
    skt: [],
  },
  text: {
    pli: [...STANDARD_FILTERS, "PTSSection"],
    chn: [...STANDARD_FILTERS, "Facsimile"],
    tib: [...STANDARD_FILTERS, "Folio"],
    skt: [...STANDARD_FILTERS, "Segment"],
  },
  table: {
    pli: [...TABLE_FILTERS, "PTSSection"],
    chn: [...TABLE_FILTERS, "Facsimile"],
    tib: [...TABLE_FILTERS, "Folio"],
    skt: [...TABLE_FILTERS, "Segment"],
  },
  graph: {
    pli: [...GRAPH_FILTERS],
    chn: [...GRAPH_FILTERS],
    tib: [...GRAPH_FILTERS],
    skt: [...GRAPH_FILTERS],
  },
  "proto-filters": {
    pli: [...COMMON_BASIC_FILTERS, "SectionSelect"],
    chn: [...COMMON_BASIC_FILTERS, "SectionSelect"],
    tib: [...COMMON_BASIC_FILTERS, "SectionSelect"],
    skt: [...COMMON_BASIC_FILTERS, "SectionSelect"],
  },
};
