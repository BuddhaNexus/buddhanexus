// numbers view
import queryString from "query-string";
import type { ApiNumbersPageData, FilePropApiQuery } from "types/api/common";

import { API_ROOT_URL } from "./constants";

export async function getNumbersData({
  fileName,
  queryParams,
}: FilePropApiQuery): Promise<ApiNumbersPageData> {
  const res = await fetch(
    `${API_ROOT_URL}/files/${fileName}/segments?co_occ=30&${queryString.stringify(
      queryParams
    )}`
  );
  return await res.json();
}
