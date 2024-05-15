import apiClient from "@api";
import type { APIMenuData } from "utils/api/types";
import type { FilePropApiQuery } from "utils/api/types/common";

export async function getNumbersViewCategories({
  fileName,
}: FilePropApiQuery): Promise<APIMenuData> {
  const { data } = await apiClient.GET("/numbers-view/categories/", {
    params: { query: { file_name: fileName } },
  });

  return data ?? [];
}
