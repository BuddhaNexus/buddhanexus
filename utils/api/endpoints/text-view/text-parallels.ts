import apiClient from "@api";
import type {
  InfiniteFilePropApiQuery,
  PagedResponse,
} from "utils/api/types/common";
import type { ApiTextPageData, TextPageData } from "utils/api/types/text";
import { parseDbPageQueryParams } from "utils/api/utils";

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
