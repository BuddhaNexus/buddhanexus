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
  displayName: string;
  fileName: string;
  parallelLength: number;
  parallelFullText: ApiTextSegment[];
  // TODO: confirm `parallelSegmentNumbers` is aligned with api
  parallelSegmentNumbers: string;
  score: number;
  targetLanguage: SourceLanguage;
};

export type TextViewMiddleParallelsData = TextViewMiddleParallel[];

export type ApiTextViewMiddleParallel = {
  file_name: string;
  display_name: string;
  length: number;
  par_fulltext: ApiTextSegment[];
  // TODO: confirm `par_segnr` is aligned with api
  par_segnr_range: string;
  score: number;
  tgt_lang: SourceLanguage;
};

export type ApiTextPageMiddleParallelsData = ApiTextViewMiddleParallel[];
