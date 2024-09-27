import apiClient from "@api";
import { parseAPIRequestBody } from "@utils/api/apiQueryUtils";
import type {
  APITableViewRequestBody,
  APITableViewResponseData,
} from "@utils/api/types";
import type { SourceLanguage } from "@utils/constants";

function parseAPITableData(data: APITableViewResponseData | undefined) {
  return data
    ? data.map((p) => ({
        sourceLanguage: p.src_lang as SourceLanguage,
        targetLanguage: p.tgt_lang as SourceLanguage,
        fileName: p.file_name,
        score: p.score,

        parallelFullNames: {
          displayName: p.par_full_names.display_name ?? "",
          textName: p.par_full_names.text_name ?? "",
          link1: p.par_full_names.link1,
          link2: p.par_full_names.link2,
        },
        parallelFullText: p.par_fulltext ?? [],
        parallelLength: p.par_length,
        parallelSegmentNumberRange: p.par_segnr_range,

        rootFullNames: {
          displayName: p.root_full_names.display_name ?? "",
          textName: p.root_full_names.text_name ?? "",
          link1: p.root_full_names.link1,
          link2: p.root_full_names.link2,
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

export async function getTableData(body: APITableViewRequestBody) {
  const { page = 0, ...params } = body;

  const { data } = await apiClient.POST("/table-view/table/", {
    body: parseAPIRequestBody({ ...params, page }),
  });

  return {
    data: parseAPITableData(data),
    pageNumber: page,
  };
}
