import apiClient from "@api";
import type { APIPostRequestBody, APIPostResponse } from "@utils/api/types";
import { getValidDbLanguage } from "@utils/validators";

function parseAPITextViewMiddleParallelsData(
  data: APIPostResponse<"/text-view/middle/">,
) {
  return data.map((p) => ({
    id: p.id,
    displayName: p.display_name ?? "",
    fileName: p.filename ?? "",
    parallelLength: p.length,
    parallelFullText: p.par_fulltext ?? [],
    parallelSegmentNumber: p.par_segnr,
    parallelSegmentNumberRange: p.par_segnr_range,
    score: p.score,
    targetLanguage: getValidDbLanguage(p.tgt_lang),
  }));
}

export async function getTextViewMiddleParallelsData(
  body: APIPostRequestBody<"/text-view/middle/">,
) {
  const { data } = await apiClient.POST("/text-view/middle/", {
    body,
  });

  return parseAPITextViewMiddleParallelsData(data ?? []);
}
