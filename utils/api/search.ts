import type { PagedResponse } from "types/api/common";

import { API_ROOT_URL } from "./constants";

export type SearchAPIResult = {
  _key: string;
  _id: string;
  _rev: string;
  segment_nr: string[];
  search_string_precise: string;
  search_string_fuzzy: string;
  split_points_precise: {
    current: number;
    next: number;
  };
  split_points_fuzzy: {
    current: number;
    next: number;
  };
  filename: string;
  offset_beg: number;
  offset_end: number;
  centeredness: number;
  distance: number;
  multilang_results: string[];
};

export type SearchResult = {
  id: string;
  segmentNumbers: string[];
  matchString: string;
  filename: string;
  matchOffsetStart: number;
  matchOffsetEnd: number;
  matchCenteredness: number;
  matchDistance: number;
  multilangResults: string[];
};

export type SearchPageData = Map<string, SearchResult>;

function parseAPISearchData(apiData: SearchAPIResult[]): SearchPageData {
  const result = new Map<string, SearchResult>();
  for (const r of apiData) {
    const searchPageResult: SearchResult = {
      id: r._key,
      segmentNumbers: r.segment_nr,
      matchString: r.search_string_precise,
      filename: r.filename,
      matchOffsetStart: r.offset_beg,
      matchOffsetEnd: r.offset_end,
      matchCenteredness: r.centeredness,
      matchDistance: r.distance,
      multilangResults: r.multilang_results,
    };
    result.set(searchPageResult.id, searchPageResult);
  }
  return result;
}

export async function getGlobalSearchData({
  searchTerm,
  pageNumber,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  serializedParams,
}: {
  searchTerm: string;
  pageNumber: number;
  serializedParams?: string;
}): Promise<PagedResponse<SearchPageData>> {
  // TODO: Add params & pagination
  const res = await fetch(`${API_ROOT_URL}/search/${searchTerm}`);
  const response = await res.json();

  return { data: parseAPISearchData(response.searchResults), pageNumber };
}

//
//
// Example API return
// [
// 	{
// 		"_key": "sn43:1.1.9_0",
// 		"_id": "search_index_pli/sn43:1.1.9_0",
// 		"_rev": "_fDbqR56-_J",
// 		"segment_nr": [
// 			"sn43:1.1.7_0",
// 			"sn43:1.1.8_0",
// 			"sn43:1.1.9_0"
// 		],
// 		"search_string_precise": "Katamo ca, bhikkhave, asaṅkhatagāmimaggo? Kāyagatāsati. Ayaṁ vuccati, bhikkhave, asaṅkhatagāmimaggo. ",
// 		"search_string_fuzzy": "katamo ca BikKave asaFKa ta gAmi maggo kAya gatA sati ayaM vuccati BikKave asaFKa ta gAmi maggo",
// 		"split_points_precise": {
// 			"current": 42,
// 			"next": 56
// 		},
// 		"split_points_fuzzy": {
// 			"current": 39,
// 			"next": 53
// 		},
// 		"filename": "/home/basti/data/pali/tsv/sn43",
// 		"offset_beg": 42,
// 		"offset_end": 100,
// 		"centeredness": 29,
// 		"distance": 2,
// 		"multilang_results": []
// 	}
// ]
