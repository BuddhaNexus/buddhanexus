import apiClient from "@api";
import { parseAPIRequestBody } from "@utils/api/apiQueryUtils";
import type { APIPostRequestBody } from "@utils/api/types";

export async function getCountMatches(
  body: APIPostRequestBody<"/utils/count-matches/">
) {
  const { data } = await apiClient.POST("/utils/count-matches/", {
    body: parseAPIRequestBody(body),
  });

  return data ?? { parallel_count: 0 };
}
