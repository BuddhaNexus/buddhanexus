import apiClient from "@api";
import type { APIGetRequestQuery, APIGetResponse } from "@utils/api/types";

const parseTextDisplayNameData = (
  data: APIGetResponse<"/utils/displayname/">
) => {
  const [textName] = data.displayname;
  return textName as string;
};

export async function getTextDisplayName(
  query: APIGetRequestQuery<"/utils/displayname/">
): Promise<string> {
  if (!query.segmentnr) {
    return "";
  }

  const { data } = await apiClient.GET("/utils/displayname/", {
    params: { query },
  });

  return data ? parseTextDisplayNameData(data) : "";
}
