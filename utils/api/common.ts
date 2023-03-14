// used in numbers view.
// TODO: transform this data to have a better structure
import type { ApiSegmentsData } from "types/api/common";

import { API_ROOT_URL } from "./constants";

export async function getSegmentsData(
  fileName: string,
  serializedParams: string
): Promise<ApiSegmentsData> {
  const res = await fetch(
    `${API_ROOT_URL}/files/${fileName}/segments?${serializedParams}&page=0`
  );
  return await res.json();
}

export async function getParallelCount({
  fileName,
  serializedParams,
}: {
  fileName: string;
  serializedParams: string;
}): Promise<Record<string, number>> {
  const res = await fetch(
    `${API_ROOT_URL}/parallels/${fileName}/count?${serializedParams}`
  );

  return await res.json();
}

export interface DatabaseFolio {
  id: string;
  segmentNr: string;
}

export async function getFolios(fileName: string): Promise<DatabaseFolio[]> {
  const res = await fetch(`${API_ROOT_URL}/files/${fileName}/folios`);

  const response = await res.json();

  return response.folios.map((folio: { segment_nr: string; num: string }) => ({
    id: folio.num,
    segmentNr: folio.segment_nr,
  }));
}
