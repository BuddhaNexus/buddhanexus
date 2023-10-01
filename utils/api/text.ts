import apiClient from "@api";
import type { InfiniteFilePropApiQuery, PagedResponse } from "types/api/common";
import type { ApiTextPageData, TextPageData } from "types/api/text";

function parseAPITextData(responseJSON: ApiTextPageData): TextPageData {
  return responseJSON.map((segment) => ({
    segmentNumber: segment.segnr,
    segmentText: segment.segtext,
  }));
}

export async function getTextData({
  fileName,
  queryParams,
  pageNumber,
}: InfiniteFilePropApiQuery): Promise<PagedResponse<TextPageData>> {
  // TODO: remove co_occ param after backend update
  const { data } = await apiClient.POST("/text-view/text-parallels/", {
    body: { file_name: fileName, ...queryParams, limits: {} },
  });

  return { data: parseAPITextData(data as ApiTextPageData), pageNumber };
}
