// used in numbers view.
// TODO: transform this data to have a better structure
import type { ApiSegmentsData } from "types/api/common";

import { API_ROOT_URL } from "./constants";

export async function getSegmentsData(
  fileName: string
): Promise<ApiSegmentsData> {
  const res = await fetch(
    `${API_ROOT_URL}/files/${fileName}/segments?page=0&co_occ=2000&folio=`
  );
  return await res.json();
}
