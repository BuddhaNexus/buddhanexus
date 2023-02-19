// graph view
import type { ApiGraphPageData } from "types/api/common";

import { API_ROOT_URL } from "./constants";

export async function getGraphData(
  fileName: string
): Promise<ApiGraphPageData> {
  const res = await fetch(
    `${API_ROOT_URL}/files/${fileName}/graph?co_occ=2000`
  );
  return await res.json();
}
