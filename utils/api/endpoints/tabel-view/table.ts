import apiClient from "@api";
import type {
  APIFullText,
  APITableViewRequestBody,
  APITableViewResponseData,
} from "utils/api/types";
import type { PagedResponse, ParsedFullNames } from "utils/api/types/common";
import { parseAPIRequestBody } from "utils/api/utils";
import type { SourceLanguage } from "utils/constants";

export type ParsedTableViewParallel = {
  // coOccurrences: number;
  sourceLanguage: SourceLanguage;
  targetLanguage: SourceLanguage;
  fileName: string;
  score: number;

  // Parallel text
  parallelFullNames: ParsedFullNames;
  parallelFullText: APIFullText[];
  parallelLength: number;
  parallelSegmentNumberRange: string;

  // Root text
  rootFullNames: ParsedFullNames;
  rootFullText: APIFullText[];
  rootLength: number;
  rootSegmentNumberRange: string;
};

export type ParsedTableViewData = ParsedTableViewParallel[];

function parseAPITableData(
  data: APITableViewResponseData,
): ParsedTableViewData {
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

export async function getTableData(
  body: APITableViewRequestBody,
): Promise<PagedResponse<ParsedTableViewData>> {
  const { data } = await apiClient.POST("/table-view/table/", {
    body: parseAPIRequestBody(body),
  });
  return {
    data: data ? parseAPITableData(data) : [],
    pageNumber: body.page!,
  };
}
