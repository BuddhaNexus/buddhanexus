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
