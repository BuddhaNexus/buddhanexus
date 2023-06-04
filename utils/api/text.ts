import type { InfiniteFilePropApiQuery, PagedResponse } from "types/api/common";
import type { ApiTextPageData, TextPageData } from "types/api/text";

import { API_ROOT_URL } from "./constants";

function parseAPITextData(responseJSON: ApiTextPageData): TextPageData {
  return responseJSON.map((segment) => ({
    segmentNumber: segment.segnr,
    segmentText: segment.segtext,
  }));
}

export async function getTextData({
  fileName,
  // queryParams,
  pageNumber,
}: InfiniteFilePropApiQuery): Promise<PagedResponse<TextPageData>> {
  // TODO: remove co_occ param after backend update
  const res = await fetch(
    `${API_ROOT_URL}/text-view/text-parallels/?file_name=${fileName}&page=${pageNumber}`
  );
  const responseJSON = await res.json();
  return { data: parseAPITextData(responseJSON), pageNumber };
}
