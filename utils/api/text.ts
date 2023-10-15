import apiClient from "@api";
import type { InfiniteFilePropApiQuery, PagedResponse } from "types/api/common";
import type {
  ApiTextPageData,
  ApiTextPageMiddleParallelsData,
  ApiTextViewMiddleParallels,
  TextPageData,
} from "types/api/text";

import { parseDbPageQueryParams } from "./utils";

function parseAPITextData(responseJSON: ApiTextPageData): TextPageData {
  return responseJSON.map((segment) => ({
    segmentNumber: segment.segnr,
    segmentText: segment.segtext,
  }));
}

function parseAPITextViewMiddleParallelsData(
  responseJSON: ApiTextPageMiddleParallelsData
): TextPageMiddleParallelsData {
  //  todo:
  return responseJSON;
}

export async function getTextData({
  fileName,
  queryParams,
  pageNumber,
}: InfiniteFilePropApiQuery): Promise<PagedResponse<TextPageData>> {
  // TODO: remove co_occ param after backend update
  // TODO: use the multi_lingual value from query params
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = await apiClient.POST("/text-view/text-parallels/", {
    body: {
      file_name: fileName,
      ...parseDbPageQueryParams(queryParams),
      multi_lingual: ["skt", "pli", "chn", "tib"],
      limits: {},
    },
  });

  return { data: parseAPITextData(data as ApiTextPageData), pageNumber };
}

export async function getTextViewMiddleParallelsData(
  parallelIds: string[]
): Promise<TextPageData> {
  // TODO: remove co_occ param after backend update
  // TODO: use the multi_lingual value from query params
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = await apiClient.POST("/text-view/middle/", {
    body: { parallel_ids: parallelIds },
  });

  return {
    data: parseAPITextViewMiddleParallelsData(
      data as ApiTextPageMiddleParallelsData
    ),
  };
}
