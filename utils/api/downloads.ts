import queryString from "query-string";
import type { ViewPropApiQuery } from "types/api/common";

import { API_ROOT_URL, RESULTS_DOWNLOAD_ROOT_URL } from "./constants";

export async function getParallelDownloadData({
  fileName,
  queryParams,
  view,
}: ViewPropApiQuery): Promise<{ url: string; name: string } | undefined> {
  const res = await fetch(
    // this triggers the creation of an excel sheet of the data for the current view (table & number only) for the user to download. The sheet is generated on the backend and lives in a folder on the HDD of the server for a while and gets removed after a few days.
    `${API_ROOT_URL}/files/${fileName}/tabledownload?co_occ=2000&${queryString.stringify(
      queryParams
    )}&download_data=${view}`
  );

  // example response: download/dn2_download.xlsx
  const response = await res.json();
  const url = `${RESULTS_DOWNLOAD_ROOT_URL}/${response}`;

  // Creates a unique, timestamped file name to avoid overwriting existing files on the user's computer.
  const name = `BuddhaNexus_${fileName}_${new Date()
    .toISOString()
    .split(".")[0]
    .replace(/T/, "_")
    .replace(/:/g, "-")}.xlsx`;

  return { url, name };
}
