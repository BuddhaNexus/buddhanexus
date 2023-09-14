// TODO: transform this data to have a better structure
import queryString from "query-string";
import type { FilePropApiQuery } from "types/api/common";

import { API_ROOT_URL } from "./constants";

export async function getParallelCount({
  fileName,
  queryParams,
}: FilePropApiQuery): Promise<Record<string, number>> {
  const res = await fetch(
    `${API_ROOT_URL}/utils/count-matches/?file_name=${fileName}&${queryString.stringify(
      queryParams
    )}`
  );

  return await res.json();
}

export interface DatabaseFolio {
  id: string;
  segmentNr: string;
}

export async function getFolios(fileName: string): Promise<DatabaseFolio[]> {
  const res = await fetch(
    `${API_ROOT_URL}/utils/folios/?file_name=${fileName}`
  );

  const response = await res.json();

  return response.folios.map((folio: { segment_nr: string; num: string }) => ({
    id: folio.num,
    segmentNr: folio.segment_nr,
  }));
}
