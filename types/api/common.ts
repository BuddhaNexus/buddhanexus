import type { DbViewEnum } from "@components/hooks/useDbView";

export interface ApiGraphPageData {
  histogramgraphdata: [name: string, count: number][];
  piegraphdata: [name: string, count: number][];
}

export interface ApiNumbersPageData {
  collections: Record<string, string>[][];
  segments: { parallels: string[][]; segmentnr: string }[];
}

export interface APIResponse<T> {
  result: T;
}

export type PagedResponse<T> = { pageNumber: number; data: T };

export type QueryParams = Partial<URLSearchParams>;

export interface FilePropApiQuery {
  fileName: string;
  queryParams: QueryParams;
}

export interface InfiniteFilePropApiQuery {
  fileName: string;
  queryParams: QueryParams;
  pageNumber: number;
}

export interface InfiniteSerachApiQuery {
  searchTerm: string;
  queryParams: QueryParams;
  pageNumber: number;
}

export interface ViewPropApiQuery extends FilePropApiQuery {
  view: DbViewEnum;
}

export type ApiTextSegment = {
  highlightColor: number;
  text: string;
  matches: [];
};
