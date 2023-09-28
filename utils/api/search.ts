import type { InfiniteSerachApiQuery, PagedResponse } from "types/api/common";
import apiClient from "@api";

export type SearchResult = {
  id: string;
  segmentNumbers: string[];
  matchString: string;
  fileName: string;
  matchOffsetStart: number;
  matchOffsetEnd: number;
  matchCenteredness: number;
  matchDistance: number;
  multilangResults: string[];
};

export type SearchPageResults = Map<string, SearchResult>;
export type SearchPageData = { total: number; results: SearchPageResults };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseAPISearchData(apiData: any): SearchPageResults {
  const searchResults = new Map<string, SearchResult>();
  for (const result of apiData) {
    const searchPageResult: SearchResult = {
      id: result._key,
      segmentNumbers: result.segment_nr,
      matchString: result.search_string_precise,
      fileName: result.filename,
      matchOffsetStart: result.offset_beg,
      matchOffsetEnd: result.offset_end,
      matchCenteredness: result.centeredness,
      matchDistance: result.distance,
      multilangResults: result.multilang_results,
    };
    searchResults.set(searchPageResult.id, searchPageResult);
  }
  return searchResults;
}

export async function getGlobalSearchData({
  searchTerm,
  pageNumber,
}: InfiniteSerachApiQuery): Promise<PagedResponse<SearchPageData>> {
  // IN DEVELOPMENT
  // TODO: Add pagination on BE
  //  - remove type casting once response model is added to api
  //  - review parsed prop nams.

  const { data } = await apiClient.POST("/search/", {
    body: { search_string: searchTerm, limits: {} },
  });

  const castData = data as { searchResults: any[] };
  const parsedData = parseAPISearchData(castData.searchResults);

  return {
    data: { total: castData.searchResults.length, results: parsedData },
    pageNumber,
  };
}
