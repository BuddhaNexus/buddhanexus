export type ApiTablePageParallel = {
  "co-occ": number;
  file_name: string;
  par_length: number;
  par_offset_beg: number;
  par_offset_end: number;
  par_pos_beg: number;
  par_segnr: [start: string, end: string];
  par_segment: [start: string, end: string];
  root_length: number;
  root_offset_beg: number;
  root_offset_end: number;
  root_seg_text: [start: string, end: string];
  root_segnr: [start: string, end: string];
  score: number;
};

export type ApiTablePageData = ApiTablePageParallel[];

export type TablePageParallel = {
  coOccurrences: number;
  fileName: string;
  paragraphLength: number;
  paragraphOffsetFromStart: number;
  paragraphOffsetFromEnd: number;
  paragraphPositionFromStart: number;
  paragraphSegmentNumbers: [start: string, end: string];
  paragraphSegmentText: [start: string, end: string];
  rootLength: number;
  rootOffsetFromStart: number;
  rootOffsetFromEnd: number;
  rootSegmentText: [start: string, end: string];
  rootSegmentNumber: [start: string, end: string];
  score: number;
};

export type TablePageData = TablePageParallel[];
