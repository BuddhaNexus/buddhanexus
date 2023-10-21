import apiClient from "@api";
import type { ApiNumbersPageData, FilePropApiQuery } from "types/api/common";

import { parseDbPageQueryParams } from "./utils";

export async function getNumbersData({
  fileName,
  queryParams,
}: FilePropApiQuery): Promise<ApiNumbersPageData> {
  const { data } = await apiClient.POST("/numbers-view/numbers", {
    body: {
      file_name: fileName,
      ...parseDbPageQueryParams(queryParams),
      page: 0,
    },
  });
  // TODO: - remove type casting once response model is added to api
  // - add page prop
  return data as ApiNumbersPageData;
}
