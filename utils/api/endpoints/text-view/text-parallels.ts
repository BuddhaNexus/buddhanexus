import apiClient from "@api";
import type {
  APITextViewParallelsRequestBody,
  APITextViewParallelsResponseData,
} from "utils/api/types";
import { parseAPIRequestBody } from "utils/api/utils";

function parseTextViewParallelsData(data: APITextViewParallelsResponseData) {
  return data.map((segment) => ({
    segmentNumber: segment.segnr,
    segmentText: segment.segtext,
  }));
}

export type ParsedTextViewParallel = ReturnType<
  typeof parseTextViewParallelsData
>[0];
export type ParsedTextViewParallelsData = ParsedTextViewParallel[];

// TODO: remove temporary types when backend is updated
export type TemporaryParsedTextViewParallel = Omit<
  ParsedTextViewParallel,
  "segmentText"
> & {
  // undefined values will be cleared on backend with pending data update
  segmentText: {
    text: string;
    highlightColor: number;
    // unknown[] needs to be changed to string[] on the backend
    matches: string[];
  }[];
};

export type TemporaryParsedTextViewParallelsData =
  TemporaryParsedTextViewParallel[];

export async function getTextViewParallelsData(
  body: APITextViewParallelsRequestBody,
  // TODO: remove return type when backend is updated (see above)
): Promise<{ data: TemporaryParsedTextViewParallelsData; pageNumber: number }> {
  const { data } = await apiClient.POST("/text-view/text-parallels/", {
    body: parseAPIRequestBody(body),
  });

  return {
    data: parseTextViewParallelsData(
      data ?? [],
    ) as TemporaryParsedTextViewParallelsData,
    pageNumber: body.page_number!,
  };
}
