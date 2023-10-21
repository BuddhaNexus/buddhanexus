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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ApiTextViewMiddleParallels {}

export type ApiTextPageData = ApiTextPageDataSegment[];

export type ApiTextPageMiddleParallelsData = ApiTextViewMiddleParallels[];
