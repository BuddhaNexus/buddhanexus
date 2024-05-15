import apiClient from "@api";
import type {
  ApiTextPageMiddleParallelsData,
  TextViewMiddleParallelsData,
} from "utils/api/types/text";

function parseAPITextViewMiddleParallelsData(
  apiData: ApiTextPageMiddleParallelsData,
): TextViewMiddleParallelsData {
  return apiData.map((p) => ({
    displayName: p.display_name,
    targetLanguage: p.tgt_lang,
    fileName: p.file_name,
    score: p.score,
    parallelFullText: p.par_fulltext,
    parallelSegmentNumbers: p.par_segnr_range,
    parallelLength: p.length,
  }));
}

export async function getTextViewMiddleParallelsData(
  parallelIds: string[],
): Promise<TextViewMiddleParallelsData> {
  // TODO: remove co_occ param after backend update
  // TODO: use the multi_lingual value from query params
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = await apiClient.POST("/text-view/middle/", {
    body: { parallel_ids: parallelIds },
  });

  return parseAPITextViewMiddleParallelsData(
    data as ApiTextPageMiddleParallelsData,
  );
}
