import apiClient from "@api";
import type {
  APIMenuData,
  APINumbersViewRequestBody,
  APINumbersViewResponseData,
} from "types/api";
import type { FilePropApiQuery, PagedResponse } from "types/api/common";

import { parseAPIRequestLimitsParam } from "./utils";

type ExtendedPagedResponse<T> = PagedResponse<T> & {
  hasNextPage: boolean;
};

export type PagedAPINumbersData =
  ExtendedPagedResponse<APINumbersViewResponseData>;

export async function getNumbersData(body: APINumbersViewRequestBody) {
  const { limits, page, ...params } = body;
  const { data } = await apiClient.POST("/numbers-view/numbers/", {
    body: {
      ...params,
      limits: parseAPIRequestLimitsParam(limits),
      page,
    },
  });

  const hasNextPage = Boolean(data && data.length < 100);
  return { data: data ?? [], pageNumber: page!, hasNextPage };
}

export async function getNumbersViewCategories({
  fileName,
}: FilePropApiQuery): Promise<APIMenuData> {
  const { data } = await apiClient.GET("/numbers-view/categories/", {
    params: { query: { file_name: fileName } },
  });

  return data ?? [];
}
