import apiClient from "@api";
import { parseAPIRequestBody } from "@utils/api/apiQueryUtils";
import type {
  APINumbersViewRequestBody,
  APINumbersViewResponseData,
} from "@utils/api/types";

export type NumbersViewData = {
  data: APINumbersViewResponseData;
  hasNextPage: boolean;
  pageNumber: number;
};

export async function getNumbersViewData(
  body: APINumbersViewRequestBody,
): Promise<NumbersViewData> {
  const { data } = await apiClient.POST("/numbers-view/numbers/", {
    body: parseAPIRequestBody(body),
  });

  const hasNextPage = Boolean(data && data.length < 100);
  return { data: data ?? [], pageNumber: body.page!, hasNextPage };
}
