import apiClient from "@api";
import { parseAPIRequestBody } from "@utils/api/apiQueryUtils";
import type { APIPostRequestBody, APIPostResponse } from "@utils/api/types";
import { getValidDbLanguage } from "@utils/validators";

function parseAPITableData(
  data: APIPostResponse<"/table-view/table/"> | undefined,
) {
  return data && Array.isArray(data)
    ? data.map((p) => ({
        dbLanguage: getValidDbLanguage(p.src_lang),
        targetLanguage: getValidDbLanguage(p.tgt_lang),
        // fileName: p.file_name,
        fileName: "",
        score: p.score,

        parallelFullNames: {
          displayName: p.par_full_names.display_name ?? "",
          textName: p.par_full_names.text_name ?? "",
        },
        parallelFullText: p.par_fulltext ?? [],
        parallelLength: p.par_length,
        parallelSegmentNumberRange: p.par_segnr_range,

        rootFullNames: {
          displayName: p.root_full_names.display_name ?? "",
          textName: p.root_full_names.text_name ?? "",
        },
        rootFullText: p.root_fulltext ?? [],
        rootLength: p.root_length,
        rootSegmentNumberRange: p.root_segnr_range,
      }))
    : [];
}

export type ParsedTableViewParallel = ReturnType<
  typeof parseAPITableData
>[number];
export type ParsedTableViewData = ParsedTableViewParallel[];

export async function getTableData(
  body: APIPostRequestBody<"/table-view/table/">,
) {
  const { page = 0, ...params } = body;

  const { data } = await apiClient.POST("/table-view/table/", {
    body: parseAPIRequestBody({ ...params, page }),
  });

  return {
    data: parseAPITableData(data),
    pageNumber: page,
  };
}
