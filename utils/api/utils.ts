import type { FilePropApiQuery } from "types/api/common";
import apiClient from "@api";

// TODO: - remove type casting once response model is added to api

export async function getParallelCount({
  fileName,
  queryParams,
}: FilePropApiQuery): Promise<Record<string, number>> {
  const { data } = await apiClient.POST("/utils/count-matches/", {
    body: { file_name: fileName, ...queryParams, limits: {} },
  });

  return data as Record<string, number>;
}

export interface DatabaseFolio {
  id: string;
  segmentNr: string;
}

export async function getFolios(fileName: string): Promise<DatabaseFolio[]> {
  const { data } = await apiClient.GET("/utils/folios/", {
    params: { query: { file_name: fileName } },
  });

  const folioData = data as { folios: any[] };

  return folioData.folios.map((folio: { segment_nr: string; num: string }) => ({
    id: folio.num,
    segmentNr: folio.segment_nr,
  }));
}
