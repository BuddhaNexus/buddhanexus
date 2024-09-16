import apiClient from "@api";
import type {
  APIFolioRequestQuery,
  APIFolioResponseData,
} from "utils/api/types";

const parseFolioData = (data: APIFolioResponseData) => {
  return data.folios.map((folio: { segment_nr: string; num: string }) => ({
    segmentNr: folio.segment_nr,
    number: folio.num,
  }));
};

export type ParsedFolio = ReturnType<typeof parseFolioData>[number];

export async function getFolios(query: APIFolioRequestQuery) {
  const { data } = await apiClient.GET("/utils/folios/", {
    params: { query },
  });

  return data ? parseFolioData(data) : [];
}
