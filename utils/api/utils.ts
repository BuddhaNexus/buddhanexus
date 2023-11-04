import apiClient from "@api";
import type { QueryParams } from "features/sidebarSuite/config/types";
import type { FilePropApiQuery } from "types/api/common";
import type { SourceLanguage } from "utils/constants";

// TODO: - remove type casting once response model is added to api

export function parseDbPageQueryParams(
  params: Partial<QueryParams>,
): Partial<QueryParams> {
  const limits = params?.limits ? JSON.parse(params.limits as string) : {};

  return { ...params, limits };
}

export async function getParallelCount({
  fileName,
  queryParams,
}: FilePropApiQuery): Promise<Record<string, number>> {
  const { data } = await apiClient.POST("/utils/count-matches/", {
    body: { file_name: fileName, ...parseDbPageQueryParams(queryParams) },
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

export async function getAvailableLanguages(
  fileName: string,
): Promise<SourceLanguage[]> {
  if (!fileName) {
    return [];
  }

  const { data } = await apiClient.GET("/utils/available-languages/", {
    params: { query: { file_name: fileName } },
  });

  const awaitingTypesFromApiData = data as {
    langList: SourceLanguage[];
  };

  return data ? awaitingTypesFromApiData.langList.filter(Boolean) : [];
}
