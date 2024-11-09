import apiClient from "@api";
import type { APIGetRequestQuery } from "@utils/api/types";

export async function getFolios(query: APIGetRequestQuery<"/utils/folios/">) {
  const { data } = await apiClient.GET("/utils/folios/", {
    params: { query },
  });

  // TODO: remove casting on backend model fix
  return (data?.folios as string[]) ?? [];
}
