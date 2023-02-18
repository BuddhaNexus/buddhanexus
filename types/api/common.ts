import type { VIEWS } from "utils/constants";
// Example response:
// {
//   displayName: 'Cūḷadhammasamādāna Sutta',
//   search_field: 'Mn 45 Cūḷadhammasamādāna Sutta (Culadhammasamadana Sutta)',
//   textname: 'Mn 45',
//   filename: 'mn45',
//   category: 'mn',
//   available_lang: null
// }

export interface ApiLanguageMenuData {
  displayName: string;
  search_field: string;
  textname: string;
  filename: string;
  category: string;
  available_lang: null;
}

export interface ApiCategoryMenuData {
  category: string;
  categoryname: string;
}

export interface ApiFolioData {
  segment_nr: string;
  num: string;
}

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

export type DbView = (typeof VIEWS)[number];
