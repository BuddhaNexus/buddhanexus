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

export type ApiTablePageData = {
  "co-occ": number;
  file_name: string;
  par_length: number;
  par_offset_beg: 0;
  par_offset_end: 0;
  par_pos_beg: number;
  par_segnr: [start: string, end: string];
  par_segment: [start: string, end: string];
  root_length: number;
  root_offset_beg: number;
  root_offset_end: number;
  root_seg_text: [start: string, end: string];
  root_segnr: [start: string, end: string];
  score: number;
}[];

export interface ApiSegmentsData {
  collections: Record<string, string>[][];
  segments: { parallels: string[][]; segmentnr: string }[];
}

export interface APIResponse<T> {
  result: T;
}
