import type { SourceLanguage } from "utils/constants";

import type { ApiTextSegment } from "./common";

type ApiFullNames = {
  display_name: string;
  text_name: string;
  link1?: string;
  link2?: string;
};

// Raw type from BE
export type ApiTablePageParallel = {
  file_name: string;
  src_lang: SourceLanguage;
  tgt_lang: SourceLanguage;
  score: number;

  // Parallel text
  par_full_names: ApiFullNames;
  par_fulltext: ApiTextSegment[];
  par_length: number;
  par_pos_beg: number;
  par_segnr: [start: string, end: string];

  // Root text
  root_full_names: ApiFullNames;
  root_fulltext: ApiTextSegment[];
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

// Type of the parsed object that's used on the FE
export type TablePageParallel = {
  // coOccurrences: number;
  sourceLanguage: SourceLanguage;
  targetLanguage: SourceLanguage;
  fileName: string;
  score: number;

  // Parallel text
  parallelFullNames: FullNames;
  parallelFullText: ApiTextSegment[];
  parallelPositionFromStart: number;
  parallelLength: number;
  parallelSegmentNumbers: [start: string, end: string];

  // Root text
  rootFullNames: FullNames;
  rootFullText: ApiTextSegment[];
  rootLength: number;
  rootSegmentNumbers: [start: string, end: string];
};

export type TablePageData = TablePageParallel[];
