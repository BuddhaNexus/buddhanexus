import type { DbView } from "features/sidebar/settingComponents/DbViewSelector";

import { API_ROOT_URL, RESULTS_DOWNLOAD_ROOT_URL } from "./constants";

interface ApiDownloadProps {
  fileName: string;
  serializedParams: string;
  view: DbView;
}

const apiDownloadViews = ["numbers", "table"];

export async function getParallelDownloadData({
  fileName,
  serializedParams,
  view,
}: ApiDownloadProps): Promise<{ url: string; name: string } | undefined> {
  // TODO: remove when download util dev is complete. Awaiting backend fix for CORS error.
  if (!apiDownloadViews.includes(view)) {
    return;
  }

  const res = await fetch(
    `${API_ROOT_URL}/files/${fileName}/tabledownload?co_occ=2000&${serializedParams}&download_data=${view}`
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
