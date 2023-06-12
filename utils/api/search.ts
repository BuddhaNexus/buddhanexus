import type { InfiniteSerachApiQuery, PagedResponse } from "types/api/common";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseAPISearchData(apiData: any): SearchPageData {
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

type DumbyData = Record<string, string>[];

function simulateFetch(dummyData: DumbyData): Promise<DumbyData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyData);
    }, 1000);
  });
}

export async function getGlobalSearchData({
  searchTerm,
  pageNumber,
}: InfiniteSerachApiQuery): Promise<PagedResponse<DumbyData>> {
  const dummyData: DumbyData = [{ id: "1", thing: "TODO" }];

  if (!searchTerm) {
    return { data: [], pageNumber };
  }

  const data = await simulateFetch(dummyData);

  return { data, pageNumber };
}
