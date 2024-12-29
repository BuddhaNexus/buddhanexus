import apiClient from "@api";
import type { APIGetRequestQuery, APIGetResponse } from "@utils/api/types";

const parseTextDisplayNameData = (
  data?: APIGetResponse<"/utils/displayname/">,
) => {
  const [displayName, displayId] = data?.displayname ?? [];
  return {
    displayName,
    displayId,
  };
};

export type ParsedTextDisplayNameData = ReturnType<
  typeof parseTextDisplayNameData
>;

export async function getTextDisplayName(
  query: APIGetRequestQuery<"/utils/displayname/">,
) {
  if (!query.segmentnr) {
    return parseTextDisplayNameData();
  }

  const { data } = await apiClient.GET("/utils/displayname/", {
    params: { query },
  });

  return parseTextDisplayNameData(data);
}
