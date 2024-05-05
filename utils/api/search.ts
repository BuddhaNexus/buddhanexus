import apiClient from "@api";
import type { SerachApiQuery } from "types/api/common";
import type { SourceLanguage } from "utils/constants";

import { parseDbPageQueryParams } from "./utils";

export type MatchTextPart = {
  text: string;
  highlightColor: 0 | 1;
};

export type SearchResult = {
  id: string;
  category: string;
  language: SourceLanguage;
  segmentNumber: string;
  displayName: string;
  links: string[];
  similarity: number;
  matchTextParts: MatchTextPart[];
};

export type SearchPageResults = SearchResult[];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseAPISearchData(apiData: any): SearchPageResults {
  const searchResults: SearchPageResults = [];
  for (const result of apiData) {
    const {
      category,
      language,
      segment_nr,
      full_names: { display_name, text_name, link1, link2 },
      similarity,
      segtext,
    } = result;
    searchResults.push({
      id: text_name,
      category,
      language,
      segmentNumber: segment_nr,
      displayName: display_name,
      links: [link1, link2],
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
export async function getGlobalSearchData({
  searchTerm,
  queryParams,
}: SerachApiQuery): Promise<SearchPageResults> {
  if (!searchTerm) {
    return [];
  }
  //  TODO: remove type casting once response model is added to api
  const { data } = await apiClient.POST("/search/", {
    body: {
      search_string: searchTerm,
      ...parseDbPageQueryParams(queryParams),
    },
  });

  const castData = data as { searchResults: any[] };

  return parseAPISearchData(castData.searchResults);
}
