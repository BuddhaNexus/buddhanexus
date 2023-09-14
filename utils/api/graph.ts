// graph view
import queryString from "query-string";
import type { ApiGraphPageData, FilePropApiQuery } from "types/api/common";

import { API_ROOT_URL } from "./constants";

export async function getGraphData({
  fileName,
  queryParams,
}: FilePropApiQuery): Promise<ApiGraphPageData> {
  const res = await fetch(
    `${API_ROOT_URL}/graph-view/?file_name=${fileName}&${queryString.stringify(
      queryParams
    )}`
  );
  return await res.json();
}
