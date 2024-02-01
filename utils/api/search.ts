import apiClient from "@api";
import type { InfiniteSerachApiQuery, PagedResponse } from "types/api/common";
import type { SourceLanguage } from "utils/constants";

import { parseDbPageQueryParams } from "./utils";

export type SearchResult = {
  id: string;
  segmentNumbers: string[];
  matchStringOriginal: string;
  matchStringStemmed: string;
  category: string;
  language: SourceLanguage;
  fileName: string;
  matchOffsetStart: number;
  matchOffsetEnd: number;
  matchCenteredness: number;
  matchDistance: number;
};

export type SearchPageResults = SearchResult[];
// export type SearchPageData = { data: SearchPageResults };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseAPISearchData(apiData: any): SearchPageResults {
  const searchResults: SearchPageResults = [];
  for (const result of apiData) {
    const {
      _key,
      segment_nr,
      original,
      stemmed,
      category,
      language,
      file_name,
      offset_beg,
      offset_end,
      centeredness,
      distance,
    } = result;
    searchResults.push({
      id: _key,
      segmentNumbers: segment_nr,
      matchStringOriginal: original,
      matchStringStemmed: stemmed,
      category,
      language,
      fileName: file_name,
      matchOffsetStart: offset_beg,
      matchOffsetEnd: offset_end,
      matchCenteredness: centeredness,
      matchDistance: distance,
    });
  }
  return searchResults;
}

export async function getGlobalSearchData({
  searchTerm,
  pageNumber,
  queryParams,
}: InfiniteSerachApiQuery): Promise<PagedResponse<SearchPageResults>> {
  // IN DEVELOPMENT
  // TODO: Add pagination on BE
  //  - remove type casting once response model is added to api
  //  - review parsed prop nams.
  const { data } = await apiClient.POST("/search/", {
    // page: 0
    body: { search_string: searchTerm, ...parseDbPageQueryParams(queryParams) },
  });

  const castData = data as { searchResults: any[] };

  return {
    data: parseAPISearchData(castData.searchResults),
    pageNumber,
  };
}
