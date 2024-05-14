import apiClient from "@api";
import type {
  APIMenuData,
  APINumbersViewRequestBody,
  APINumbersViewResponseData,
} from "types/api";
import type { FilePropApiQuery, PagedResponse } from "types/api/common";

import { parseAPIRequestBody } from "./utils";

type ExtendedPagedResponse<T> = PagedResponse<T> & {
  hasNextPage: boolean;
};

export type PagedAPINumbersData =
  ExtendedPagedResponse<APINumbersViewResponseData>;

export async function getNumbersData(body: APINumbersViewRequestBody) {
  const { data } = await apiClient.POST("/numbers-view/numbers/", {
    body: parseAPIRequestBody(body),
  });

  const hasNextPage = Boolean(data && data.length < 100);
  return { data: data ?? [], pageNumber: body.page!, hasNextPage };
}

export async function getNumbersViewCategories({
  fileName,
}: FilePropApiQuery): Promise<APIMenuData> {
  const { data } = await apiClient.GET("/numbers-view/categories/", {
    params: { query: { file_name: fileName } },
  });

  return data ?? [];
}
