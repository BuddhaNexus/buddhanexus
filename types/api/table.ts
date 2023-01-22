import type { SourceLanguage } from "utils/constants";

type ApiFullNames = {
  display_name: string;
  text_name: string;
  link1?: string;
  link2?: string;
};

export type ApiTablePageParallel = {
  "co-occ": number;
  file_name: string;
  src_lang: SourceLanguage;
  tgt_lang: SourceLanguage;
  score: number;

  // Parallel text
  par_color_map: number[];
  par_full_names: ApiFullNames;
  par_fulltext: string;
  par_length: number;
  par_pos_beg: number;
  par_segnr: [start: string, end: string];

  // Root text
  root_color_map: number[];
  root_full_names: ApiFullNames;
  root_fulltext: string;
  root_length: number;
  root_segnr: [start: string, end: string];
};

export type ApiTablePageData = ApiTablePageParallel[];

type FullNames = {
  displayName: string;
  textName: string;
  link1?: string;
  link2?: string;
};

export type TablePageParallel = {
  coOccurrences: number;
  sourceLanguage: SourceLanguage;
  targetLanguage: SourceLanguage;
  fileName: string;
  score: number;

  // Parallel text
  parallelColorMap: number[];
  parallelFullNames: FullNames;
  parallelFullText: string;
  parallelPositionFromStart: number;
  parallelLength: number;
  parallelSegmentNumbers: [start: string, end: string];

  // Root text
  rootColorMap: number[];
  rootFullNames: FullNames;
  rootFullText: string;
  rootLength: number;
  rootSegmentNumbers: [start: string, end: string];
};

export type TablePageData = TablePageParallel[];
