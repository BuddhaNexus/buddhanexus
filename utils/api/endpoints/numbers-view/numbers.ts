import apiClient from "@api";
import type {
  APINumbersViewRequestBody,
  APINumbersViewResponseData,
} from "utils/api/types";
import type { PagedResponse } from "utils/api/types/common";
import { parseAPIRequestBody } from "utils/api/utils";

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
