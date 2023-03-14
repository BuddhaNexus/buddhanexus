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
