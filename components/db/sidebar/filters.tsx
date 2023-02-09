import {
  createContext,
  // useCallback,
  useContext,
  useMemo,
  // useReducer,
} from "react";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useQuery } from "@tanstack/react-query";
import type { TablePageData } from "types/api/table";
import { DbApi } from "utils/api/db";

export type FilterGroup = string[];
export type View = "graph" | "numbers" | "proto-filters" | "table" | "text";
export type Lang = "chn" | "pli" | "skt" | "tib";

export type Filters = Record<View, Record<Lang, string[]>>;

const LEGACY_FILTERS: FilterGroup = ["co_occ", "score"];

const COMMON_BASIC_FILTERS: FilterGroup = [...LEGACY_FILTERS, "par_length"];

const STANDARD_FILTERS: FilterGroup = [
  ...COMMON_BASIC_FILTERS,
  "limit_collection",
  "active_segment",
];

const TABLE_FILTERS: FilterGroup = [...STANDARD_FILTERS, "sort_method"];

const GRAPH_FILTERS: FilterGroup = [
  ...COMMON_BASIC_FILTERS,
  "target_collection",
];

export const VIEW_FILTERS: Filters = {
  numbers: {
    pli: [...STANDARD_FILTERS],
    chn: [...STANDARD_FILTERS],
    tib: [],
    skt: [],
  },
  text: {
    pli: [...STANDARD_FILTERS],
    chn: [...STANDARD_FILTERS],
    tib: [...STANDARD_FILTERS],
    skt: [...STANDARD_FILTERS],
  },
  table: {
    pli: [...TABLE_FILTERS],
    chn: [...TABLE_FILTERS],
    tib: [...TABLE_FILTERS],
    skt: [...TABLE_FILTERS],
  },
  graph: {
    pli: [...GRAPH_FILTERS],
    chn: [...GRAPH_FILTERS],
    tib: [...GRAPH_FILTERS],
    skt: [...GRAPH_FILTERS],
  },
  "proto-filters": {
    pli: [...STANDARD_FILTERS],
    chn: [...STANDARD_FILTERS],
    tib: [...STANDARD_FILTERS],
    skt: [...STANDARD_FILTERS],
  },
};

const initQueryParams = {
  co_occ: "30",
  score: "30",
  par_length: "200",
};

function useParallelSource(): {
  isLoading: boolean;
  parallels: TablePageData;
  queryParams: Record<string, string>;
  // search: string;
  // setSearch: (search: string) => void;
} {
  const { fileName } = useDbQueryParams();

  const { data: parallels, isLoading } = useQuery<TablePageData>({
    queryKey: DbApi.TableView.makeQueryKey(fileName),
    queryFn: () =>
      DbApi.TableView.call({
        fileName,
        queryParams: initQueryParams,
      }),
    initialData: [],
  });

  // type FilterState = {
  //   search: string;
  // };

  // type FilterAction = { type: "setSearch"; payload: string };

  // const [{ search }, dispatch] = useReducer(
  //   (state: FilterState, action: FilterAction) => {
  //     const actions = {
  //       setSearch: { ...state, search: action.payload },
  //     };

  //     return actions[action.type];
  //   },
  //   {
  //     search: "",
  //   }
  // );

  // const setSearch = useCallback((search: string) => {
  //   dispatch({
  //     type: "setSearch",
  //     payload: search,
  //   });
  // }, []);

  // const filteredParallels = useMemo(
  //   () =>
  //     parallels
  //       .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  //       .slice(0, 20),
  //   [parallels, search]
  // );

  const sortedParallels = useMemo(
    () => [...parallels].sort((a, b) => b.score - a.score),
    [parallels]
  );

  return {
    isLoading,
    parallels: sortedParallels,
    queryParams: initQueryParams,
  };
}

const FilterContext = createContext<ReturnType<typeof useParallelSource>>(
  {} as unknown as ReturnType<typeof useParallelSource>
);

export function useParallels() {
  return useContext(FilterContext);
}

export function FilterProvider({ children }: { children: React.ReactNode }) {
  return (
    <FilterContext.Provider value={useParallelSource()}>
      {children}
    </FilterContext.Provider>
  );
}
