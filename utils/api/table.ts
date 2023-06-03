import queryString from "query-string";
import type { InfiniteFilePropApiQuery, PagedResponse } from "types/api/common";
import type { ApiTablePageData, TablePageData } from "types/api/table";

import { API_ROOT_URL } from "./constants";

function parseAPITableData(apiData: ApiTablePageData): TablePageData {
  return apiData.map((p) => ({
    coOccurrences: p["co-occ"],
    sourceLanguage: p.src_lang,
    targetLanguage: p.tgt_lang,
    fileName: p.file_name,
    score: p.score,

    parallelFullNames: {
      displayName: p.par_full_names.display_name,
      textName: p.par_full_names.text_name,
      link1: p.par_full_names.link1,
      link2: p.par_full_names.link2,
    },
    parallelFullText: p.par_fulltext,
    parallelLength: p.par_length,
    parallelPositionFromStart: p.par_pos_beg,
    parallelSegmentNumbers: p.par_segnr,

    rootLength: p.root_length,
    rootSegmentNumbers: p.root_segnr,
    rootFullNames: {
      displayName: p.root_full_names.display_name,
      textName: p.root_full_names.text_name,
      link1: p.root_full_names.link1,
      link2: p.root_full_names.link2,
    },
    rootFullText: p.root_fulltext,
  }));
}

export async function getTableData({
  fileName,
  queryParams,
  pageNumber,
}: InfiniteFilePropApiQuery): Promise<PagedResponse<TablePageData>> {
  // TODO: remove co_occ param after backend update
  const res = await fetch(
    `${API_ROOT_URL}/table-view/table/?file_name=${fileName}&page=${pageNumber}&co_occ=2000&${queryString.stringify(
      queryParams
    )}`
  );
  const responseJSON = await res.json();
  return { data: parseAPITableData(responseJSON), pageNumber };
}
