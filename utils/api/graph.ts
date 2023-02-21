// graph view
import type { ApiGraphPageData } from "types/api/common";

import { API_ROOT_URL } from "./constants";

export async function getGraphData(
  fileName: string,
  serializedParams: string
): Promise<ApiGraphPageData> {
  const res = await fetch(
    `${API_ROOT_URL}/files/${fileName}/graph?${serializedParams}`
  );
  return await res.json();
}
