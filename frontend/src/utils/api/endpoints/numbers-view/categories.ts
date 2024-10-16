import apiClient from "@api";
import type { APIGetRequestQuery } from "@utils/api/types";

export async function getNumbersViewCategories(
  query: APIGetRequestQuery<"/numbers-view/categories/">
) {
  const { data } = await apiClient.GET("/numbers-view/categories/", {
    params: { query },
  });

  return data ?? [];
}
