import type { DbViewEnum } from "@components/hooks/useDbView";
import type { QueryParams } from "features/sidebarSuite/config/types";

export type GraphPageGraphData = [name: string, count: number][];

export interface ApiGraphPageData {
  histogramgraphdata: GraphPageGraphData;
  piegraphdata: GraphPageGraphData;
}

export interface ApiNumbersPageData {
  collections: Record<string, string>[][];
  segments: { parallels: string[][]; segmentnr: string }[];
}

export interface APIResponse<T> {
  result: T;
}

export type PagedResponse<T> = { pageNumber: number; data: T };

export type Params = Partial<QueryParams>;

export interface FilePropApiQuery {
  fileName: string;
  queryParams: Params;
}

export interface InfiniteFilePropApiQuery {
  fileName: string;
  queryParams: Params;
  pageNumber: number;
}

export interface SerachApiQuery {
  searchTerm: string;
  queryParams: Params;
}

export interface ViewPropApiQuery extends FilePropApiQuery {
  view: DbViewEnum;
}

export type ApiTextSegment = {
  highlightColor: number;
  text: string;
  matches: [];
};
