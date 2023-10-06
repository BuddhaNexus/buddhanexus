import apiClient from "@api";
import type { ApiNumbersPageData, FilePropApiQuery } from "types/api/common";

export async function getNumbersData({
  fileName,
  queryParams,
}: FilePropApiQuery): Promise<ApiNumbersPageData> {
  const limits = queryParams?.limits
    ? JSON.parse(queryParams.limits as string)
    : {};

  const { data } = await apiClient.POST("/numbers-view/numbers", {
    body: { file_name: fileName, ...queryParams, limits, page: 0 },
  });
  // TODO: - remove type casting once response model is added to api
  // - add page prop
  return data as ApiNumbersPageData;
}
