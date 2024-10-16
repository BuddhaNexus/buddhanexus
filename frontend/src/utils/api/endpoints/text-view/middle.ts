import apiClient from "@api";
import type { APIPostRequestBody, APIPostResponse } from "@utils/api/types";
import { SourceLanguage } from "@utils/constants";

function parseAPITextViewMiddleParallelsData(
  data: APIPostResponse<"/text-view/middle/">
) {
  return data.map((p) => ({
    displayName: p.display_name ?? "",
    fileName: p.filename ?? "",
    parallelLength: p.length,
    parallelFullText: p.par_fulltext ?? [],
    parallelSegmentNumberRange: p.par_segnr_range,
    score: p.score,
    targetLanguage: p.tgt_lang as SourceLanguage,
  }));
}

export async function getTextViewMiddleParallelsData(
  body: APIPostRequestBody<"/text-view/middle/">
) {
  const { data } = await apiClient.POST("/text-view/middle/", {
    body,
  });

  return parseAPITextViewMiddleParallelsData(data ?? []);
}
