import apiClient from "@api";
import { APIExternalLinksRequestQuery } from "@utils/api/types";

export async function getExternalLinksData(
  query: APIExternalLinksRequestQuery,
) {
  const { data } = await apiClient.GET("/links/external/", {
    params: { query },
  });

  return data;
}
