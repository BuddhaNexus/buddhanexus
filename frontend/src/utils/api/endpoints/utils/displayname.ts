import apiClient from "@api";
import type {
  APIDisplayNameRequestQuery,
  APIDisplayNameResponseData,
} from "@utils/api/types";

const parseTextDisplayNameData = (data: APIDisplayNameResponseData) => {
  const [textName] = data.displayname;
  return textName as string;
};

export async function getTextDisplayName(
  query: APIDisplayNameRequestQuery,
): Promise<string> {
  if (!query.segmentnr) {
    return "";
  }

  const { data } = await apiClient.GET("/utils/displayname/", {
    params: { query },
  });

  return data ? parseTextDisplayNameData(data) : "";
}
