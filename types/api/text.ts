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

export interface ApiTextViewMiddleParallels {}

export type ApiTextPageData = ApiTextPageDataSegment[];

export type ApiTextPageMiddleParallelsData = ApiTextViewMiddleParallels[];
