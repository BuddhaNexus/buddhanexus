import apiClient from "@api";
import type { InfiniteFilePropApiQuery, PagedResponse } from "types/api/common";
import type {
  ApiTextPageData,
  ApiTextPageMiddleParallelsData,
  TextPageData,
  TextViewMiddleParallelsData,
} from "types/api/text";

import { parseDbPageQueryParams } from "./utils";

function parseAPITextData(responseJSON: ApiTextPageData): TextPageData {
  return responseJSON.map((segment) => ({
    segmentNumber: segment.segnr,
    segmentText: segment.segtext,
  }));
}

function parseAPITextViewMiddleParallelsData(
  apiData: ApiTextPageMiddleParallelsData,
): TextViewMiddleParallelsData {
  return apiData.map((p) => ({
    displayName: p.display_name,
    targetLanguage: p.tgt_lang,
    fileName: p.file_name,
    score: p.score,
    parallelFullText: p.par_fulltext,
    parallelSegmentNumbers: p.par_segnr,
    parallelLength: p.length,
  }));
}

export async function getTextData({
  fileName,
  queryParams,
  pageNumber,
}: InfiniteFilePropApiQuery): Promise<PagedResponse<TextPageData>> {
  // TODO: use the multi_lingual value from query params
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = await apiClient.POST("/text-view/text-parallels/", {
    body: {
      file_name: fileName,
      ...parseDbPageQueryParams(queryParams),
      multi_lingual: ["skt", "pli", "chn", "tib"],
    },
  });

  return { data: parseAPITextData(data as ApiTextPageData), pageNumber };
}

export async function getTextViewMiddleParallelsData(
  parallelIds: string[],
): Promise<TextViewMiddleParallelsData> {
  // TODO: remove co_occ param after backend update
  // TODO: use the multi_lingual value from query params
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = await apiClient.POST("/text-view/middle/", {
    body: { parallel_ids: parallelIds },
  });

  return parseAPITextViewMiddleParallelsData(
    data as ApiTextPageMiddleParallelsData,
  );
}
