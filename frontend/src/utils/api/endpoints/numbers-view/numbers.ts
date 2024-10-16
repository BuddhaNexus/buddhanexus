import apiClient from "@api";
import { parseAPIRequestBody } from "@utils/api/apiQueryUtils";
import type { APIPostRequestBody, APIPostResponse } from "@utils/api/types";

export type NumbersViewData = {
  data: APIPostResponse<"/numbers-view/numbers/">;
  hasNextPage: boolean;
  pageNumber: number;
};

export async function getNumbersViewData(
  body: APIPostRequestBody<"/numbers-view/numbers/">
): Promise<NumbersViewData> {
  const { data } = await apiClient.POST("/numbers-view/numbers/", {
    body: parseAPIRequestBody(body),
  });

  const hasNextPage = Boolean(data && data.length < 100);
  return { data: data ?? [], pageNumber: body.page!, hasNextPage };
}
