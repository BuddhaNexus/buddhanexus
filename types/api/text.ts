import { SourceLanguage } from "utils/constants";

import type { ApiTextSegment } from "./common";

export interface TextPageDataSegment {
  segmentNumber: string;
  segmentText: ApiTextSegment[];
}

export type TextPageData = TextPageDataSegment[];

export interface ApiTextPageDataSegment {
  segnr: string;
  segtext: ApiTextSegment[];
}

export type ApiTextPageData = ApiTextPageDataSegment[];

export type TextViewMiddleParallel = {
  fileName: string;
  parallelLength: number;
  parallelFullText: ApiTextSegment[];
  parallelSegmentNumbers: [start: string, end: string];
  score: number;
  targetLanguage: SourceLanguage;
};

export type TextViewMiddleParallelsData = TextViewMiddleParallel[];

export type ApiTextViewMiddleParallel = {
  file_name: string;
  length: number;
  par_fulltext: ApiTextSegment[];
  par_segnr: [start: string, end: string];
  score: number;
  tgt_lang: SourceLanguage;
};

export type ApiTextPageMiddleParallelsData = ApiTextViewMiddleParallel[];
