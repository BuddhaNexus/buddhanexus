import apiClient from "@api";
import { APIGetRequestQuery } from "@utils/api/types";

export async function getExternalLinksData(
  query: APIGetRequestQuery<"/links/external/">
) {
  const { data } = await apiClient.GET("/links/external/", {
    params: { query },
  });

  return data;
}
