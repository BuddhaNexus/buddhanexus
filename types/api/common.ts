import type { SourceLanguage } from "utils/constants";

export interface ApiGraphPageData {
  histogramgraphdata: [name: string, count: number][];
  piegraphdata: [name: string, count: number][];
}

export interface ApiSegmentsData {
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

export interface LanguagePropApiQuery {
  language: SourceLanguage;
  queryParams: QueryParams;
}
