import apiClient from "@api";
import type {
  APINumbersViewCategoryRequestQuery,
  APINumbersViewCategoryResponseData,
} from "utils/api/types";

export async function getNumbersViewCategories(
  query: APINumbersViewCategoryRequestQuery,
): Promise<APINumbersViewCategoryResponseData> {
  const { data } = await apiClient.GET("/numbers-view/categories/", {
    params: { query },
  });

  return data ?? [];
}
