import apiClient from "@api";
import { parseAPIRequestBody } from "utils/api/apiQueryUtils";
import type { APICountMatchesRequestBody } from "utils/api/types";

export async function getCountMatches(body: APICountMatchesRequestBody) {
  const { data } = await apiClient.POST("/utils/count-matches/", {
    body: parseAPIRequestBody(body),
  });

  return data;
}
