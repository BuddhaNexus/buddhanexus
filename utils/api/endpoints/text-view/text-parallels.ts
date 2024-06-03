import apiClient from "@api";
import { parseAPIRequestBody } from "utils/api/apiQueryUtils";
import type {
  APITextViewParallelsRequestBody,
  APITextViewParallelsResponseData,
} from "utils/api/types";

function parseTextViewParallelsData(data: APITextViewParallelsResponseData) {
  //   return data.map((segment) => ({
  //   segmentNumber: segment.segnr,
  //   segmentText: segment.segtext,
  // }));
  // TODO: remove temporary parsing / casting when backend model is updated
  return data.map((segment) => {
    const { segnr, segtext } = segment;
    return {
      segmentNumber: segnr,
      segmentText: segtext.map(({ text, highlightColor, matches }) => ({
        text: text as string,
        highlightColor: highlightColor as number,
        matches: matches as string[],
      })),
    };
  });
}

export type ParsedTextViewParallel = ReturnType<
  typeof parseTextViewParallelsData
>[0];
export type ParsedTextViewParallelsData = ParsedTextViewParallel[];

export async function getTextViewParallelsData(
  body: APITextViewParallelsRequestBody,
) {
  const { page_number = 0, ...params } = body;

  const { data } = await apiClient.POST("/text-view/text-parallels/", {
    body: {
      ...parseAPIRequestBody({ ...params, page_number }),
      // TODO: add support for multiple languages when available
      multi_lingual: ["skt", "pli", "chn", "tib"],
    },
  });

  return {
    data: parseTextViewParallelsData(data ?? []),
    pageNumber: page_number,
  };
}
