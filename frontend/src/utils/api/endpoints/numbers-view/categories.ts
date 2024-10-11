import apiClient from "@api";
import type { APINumbersViewCategoryRequestQuery } from "@utils/api/types";

export async function getNumbersViewCategories(
  query: APINumbersViewCategoryRequestQuery,
) {
  const { data } = await apiClient.GET("/numbers-view/categories/", {
    params: { query },
  });

  return data ?? [];
}
