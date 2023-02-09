import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useQuery } from "@tanstack/react-query";
import type { TablePageData } from "types/api/table";
import { DbApi } from "utils/api/db";

export type Filter =
  | "active_segment"
  | "co_occ"
  | "limit_collection"
  | "par_length"
  | "score"
  | "sort_method"
  | "target_collection";

export type FilterGroup = Filter[];
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

type QueryParams = Partial<Record<Filter, string>>;

type ParallelsState = {
  queryParams: QueryParams;
  textSettings?: any;
};

type ParallelsAction =
  | { type: "setQueryParams"; payload: QueryParams }
  | { type: "setTextSettings"; payload: any };

export const initQueryParams = {
  co_occ: "30",
  score: "30",
  par_length: "500",
};

function useParallelsSource(): {
  isLoading: boolean;
  isFetching: boolean;
  parallels: TablePageData;
  queryParams: Record<string, string>;
  setQueryParams: (params: QueryParams) => void;
} {
  const { fileName } = useDbQueryParams();

  const [{ queryParams }, dispatch] = useReducer(
    (state: ParallelsState, action: ParallelsAction) => {
      const actions = {
        setQueryParams: { ...state, queryParams: action.payload },
        setTextSettings: { ...state, textSettings: action.payload },
      };

      return actions[action.type];
    },
    {
      queryParams: initQueryParams,
      textSettings: {},
    }
  );

  const {
    data: parallels,
    isLoading,
    isFetching,
  } = useQuery<TablePageData>({
    queryKey: [DbApi.TableView.makeQueryKey(fileName), { queryParams }],
    queryFn: () =>
      DbApi.TableView.call({
        fileName,
        queryParams,
      }),
    initialData: [],
    refetchOnWindowFocus: false,
  });

  const setQueryParams = useCallback((params: QueryParams) => {
    dispatch({
      type: "setQueryParams",
      payload: params,
    });
  }, []);

  const sortedParallels = useMemo(
    () => [...parallels].sort((a, b) => b.score - a.score),
    [parallels]
  );

  return {
    isLoading,
    isFetching,
    parallels: sortedParallels,
    queryParams,
    setQueryParams,
  };
}

const ParallelsContext = createContext<ReturnType<typeof useParallelsSource>>(
  {} as unknown as ReturnType<typeof useParallelsSource>
);

export function useParallels() {
  return useContext(ParallelsContext);
}

export function ParallelsProvider({ children }: { children: React.ReactNode }) {
  return (
    <ParallelsContext.Provider value={useParallelsSource()}>
      {children}
    </ParallelsContext.Provider>
  );
}
