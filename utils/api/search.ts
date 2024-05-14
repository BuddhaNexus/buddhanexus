import apiClient from "@api";
import type {
  APISearchRequestBody,
  APISearchResponseData,
  FullText,
} from "types/api";
import type { SourceLanguage } from "utils/constants";

import { parseAPIRequestBody } from "./utils";

export type ParsedSearchResult = {
  id: string;
  category: string;
  language: SourceLanguage;
  segmentNumber: string;
  displayName: string;
  links: string[];
  similarity: number;
  matchTextParts: FullText[];
};

function parseAPISearchData(data: APISearchResponseData): ParsedSearchResult[] {
  const searchResults: ParsedSearchResult[] = [];

  for (const result of data.searchResults) {
    const {
      category,
      language,
      segment_nr,
      full_names: { display_name, text_name, link1, link2 },
      similarity,
      segtext,
    } = result;

    searchResults.push({
      id: text_name ?? "",
      category,
      language: language as SourceLanguage,
      segmentNumber: segment_nr,
      displayName: display_name ?? "",
      links: [`${link1}`, `${link2}`],
      similarity,
      matchTextParts: segtext,
    });
  }
  return searchResults;
}

/**
 * Return has a hard limit of 200 matches.
 * @see https://github.com/BuddhaNexus/buddhanexus-frontend-next/issues/122#issuecomment-1925895599
 */
export async function getGlobalSearchData(
  body: APISearchRequestBody,
): Promise<ParsedSearchResult[]> {
  if (!body.search_string) {
    return [];
  }

  const { data } = await apiClient.POST("/search/", {
    body: parseAPIRequestBody(body),
  });

  return data ? parseAPISearchData(data) : [];
}
