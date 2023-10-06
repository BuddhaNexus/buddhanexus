// graph view
import apiClient from "@api";
import type { ApiGraphPageData, FilePropApiQuery } from "types/api/common";

export async function getGraphData({
  fileName,
  queryParams,
}: FilePropApiQuery): Promise<ApiGraphPageData> {
  const { data } = await apiClient.POST("/graph-view/", {
    body: { file_name: fileName, ...queryParams, target_collection: [] },
  });
  // TODO: - remove type casting once response model is added to api
  return data as ApiGraphPageData;
}
