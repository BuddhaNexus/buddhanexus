import apiClient from "@api";
import { parseAPIRequestBody } from "@utils/api/apiQueryUtils";
import type { APIPostRequestBody, APIPostResponse } from "@utils/api/types";
import { getValidDbLanguage } from "@utils/validators";

function parseAPISearchData(data: APIPostResponse<"/search/">) {
  const searchResults = [];

  for (const result of data.searchResults) {
    const {
      category,
      language,
      segment_nr,
      full_names: { display_name, text_name },
      similarity,
      segtext,
    } = result;

    searchResults.push({
      id: text_name ?? "",
      category,
      language: getValidDbLanguage(language),
      segmentNumber: segment_nr,
      displayName: display_name ?? "",
      links: [
        /*`${link1}`, `${link2}`*/
      ],
      similarity,
      matchTextParts: segtext,
    });
  }
  return searchResults;
}

export type ParsedSearchResult = ReturnType<typeof parseAPISearchData>[number];

/**
 * Return has a hard limit of 200 matches.
 * @see https://github.com/BuddhaNexus/buddhanexus-frontend-next/issues/122#issuecomment-1925895599
 */
export async function getGlobalSearchData(
  body: APIPostRequestBody<"/search/">,
) {
  if (!body.search_string) {
    return [];
  }

  const { data } = await apiClient.POST("/search/", {
    body: parseAPIRequestBody(body),
  });

  return data ? parseAPISearchData(data) : [];
}
