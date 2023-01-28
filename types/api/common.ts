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
